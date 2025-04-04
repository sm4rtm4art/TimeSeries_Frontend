/**
 * Mock service for local development without a backend
 * This simulates API responses from a FastAPI backend
 */

import {
  ForecastResponse,
  ModelListResponse,
  TrainingResponse,
  TrainingStatusResponse,
} from "./api-client";
import { getAllModels } from "./model-registry";

// Define more specific types
type JobStatus = "queued" | "running" | "completed" | "failed";
interface JobInfo {
  jobId: string;
  modelId: string;
  status: JobStatus;
  progress: number;
  startTime: number;
  parameters: Record<string, unknown>;
}

type MetricsType = {
  mape: number;
  rmse: number;
  mae: number;
};

interface MockDataset {
  id: string;
  name: string;
  description: string;
  rows: number;
  columns: number;
  created_at: string;
}

// Simulated job storage
const activeJobs: Record<string, JobInfo> = {};

// Simulated datasets
const mockDatasets: MockDataset[] = [
  {
    id: "default",
    name: "Default Dataset",
    description: "Sample time series data",
    rows: 1000,
    columns: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: "sales",
    name: "Sales Data",
    description: "Historical sales data",
    rows: 500,
    columns: 10,
    created_at: new Date().toISOString(),
  },
  {
    id: "weather",
    name: "Weather Data",
    description: "Temperature and humidity measurements",
    rows: 2000,
    columns: 8,
    created_at: new Date().toISOString(),
  },
];

// Mock training function
export function mockTrainModel(
  modelId: string,
  parameters: Record<string, unknown>,
  _datasetId: string,
  _trainingConfig: Record<string, unknown> = {},
): Promise<TrainingResponse> {
  return new Promise((resolve) => {
    // Create a job ID
    const jobId = `job-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Store job information
    activeJobs[jobId] = {
      jobId,
      modelId,
      status: "queued",
      progress: 0,
      startTime: Date.now(),
      parameters,
    };

    // Simulate job starting after a delay
    setTimeout(() => {
      if (activeJobs[jobId]) {
        activeJobs[jobId].status = "running";

        // Simulate training progress
        const intervalId = setInterval(() => {
          if (!activeJobs[jobId] || activeJobs[jobId].status !== "running") {
            clearInterval(intervalId);
            return;
          }

          // Increase progress
          activeJobs[jobId].progress += 5;

          // Complete job when progress reaches 100%
          if (activeJobs[jobId].progress >= 100) {
            activeJobs[jobId].progress = 100;
            activeJobs[jobId].status = "completed";
            clearInterval(intervalId);
          }
        }, 500);
      }
    }, 1000);

    resolve({
      job_id: jobId,
      model_id: modelId,
      status: "queued",
      message: "Training job queued successfully",
    });
  });
}

// Mock status check
export function mockGetTrainingStatus(
  jobId: string,
): Promise<TrainingStatusResponse> {
  return new Promise((resolve, reject) => {
    if (!activeJobs[jobId]) {
      reject(new Error("Job not found"));
      return;
    }

    const job = activeJobs[jobId];

    // Generate random metrics if job is completed
    const metrics = job.status === "completed"
      ? {
        mape: parseFloat((3 + Math.random() * 7).toFixed(2)),
        rmse: parseFloat((5 + Math.random() * 15).toFixed(2)),
        mae: parseFloat((4 + Math.random() * 11).toFixed(2)),
      }
      : undefined;

    resolve({
      job_id: jobId,
      model_id: job.modelId,
      status: job.status,
      progress: job.progress,
      metrics,
    });
  });
}

// Mock forecast
export function mockGetForecast(
  _modelId: string,
  parameters: {
    horizon: number;
    confidence_interval?: number;
    start_date?: string;
  },
): Promise<ForecastResponse> {
  return new Promise((resolve) => {
    const forecast_length = parameters.horizon;
    const base_value = 50 + Math.random() * 100;
    const trend = -0.2 + Math.random() * 0.4;
    const seasonality_factor = 5 + Math.random() * 10;

    // Generate timestamps
    const start_date = parameters.start_date
      ? new Date(parameters.start_date)
      : new Date();

    const timestamps = Array.from({ length: forecast_length }, (_, i) => {
      const date = new Date(start_date);
      date.setDate(date.getDate() + i);
      return date.toISOString();
    });

    // Generate forecast values
    const forecast = Array.from({ length: forecast_length }, (_, i) => {
      const trend_component = trend * i;
      const seasonal_component = seasonality_factor *
        Math.sin(i / 7 * 2 * Math.PI);
      const noise = (Math.random() - 0.5) * base_value * 0.1;
      return base_value + trend_component + seasonal_component + noise;
    });

    // Calculate confidence intervals
    const std_dev = Math.sqrt(
      forecast.reduce((acc, val) => {
        const diff = val -
          (forecast.reduce((sum, v) => sum + v, 0) / forecast.length);
        return acc + diff * diff;
      }, 0) / forecast.length,
    ) * 1.96;

    resolve({
      forecast,
      confidence_intervals: {
        lower: forecast.map((v) => v - std_dev),
        upper: forecast.map((v) => v + std_dev),
      },
      timestamps,
      metrics: {
        mape: parseFloat((3 + Math.random() * 7).toFixed(2)),
        rmse: parseFloat((5 + Math.random() * 15).toFixed(2)),
        mae: parseFloat((4 + Math.random() * 11).toFixed(2)),
      },
    });
  });
}

// Mock get available models
export function mockGetAvailableModels(): Promise<ModelListResponse> {
  return Promise.resolve({
    models: getAllModels().map((model) => ({
      id: model.id,
      name: model.name,
      description: model.description,
      tags: model.tags,
    })),
  });
}

// Mock get datasets
export function mockGetDatasets(): Promise<{
  datasets: MockDataset[];
}> {
  return Promise.resolve({ datasets: mockDatasets });
}

// Mock upload dataset
export function mockUploadDataset(
  _file: File,
  config: {
    name: string;
    description?: string;
  },
): Promise<{ dataset_id: string }> {
  return new Promise((resolve) => {
    const datasetId = `dataset-${Date.now()}`;

    // Add to mock datasets
    mockDatasets.push({
      id: datasetId,
      name: config.name,
      description: config.description || "",
      rows: 500 + Math.floor(Math.random() * 4500),
      columns: 3 + Math.floor(Math.random() * 12),
      created_at: new Date().toISOString(),
    });

    resolve({ dataset_id: datasetId });
  });
}

export default {
  trainModel: mockTrainModel,
  getTrainingStatus: mockGetTrainingStatus,
  getForecast: mockGetForecast,
  getAvailableModels: mockGetAvailableModels,
  getDatasets: mockGetDatasets,
  uploadDataset: mockUploadDataset,
};
