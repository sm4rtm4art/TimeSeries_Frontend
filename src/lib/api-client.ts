/**
 * API client for communicating with the FastAPI backend
 */

// Default API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:8000";
const API_TIMEOUT = 30000; // 30 seconds default timeout

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TrainingResponse {
  job_id: string;
  model_id: string;
  status: "queued" | "running" | "completed" | "failed";
  message?: string;
}

export interface TrainingStatusResponse {
  job_id: string;
  model_id: string;
  status: "queued" | "running" | "completed" | "failed";
  progress: number;
  metrics?: {
    [key: string]: number;
  };
  message?: string;
}

export interface ForecastResponse {
  forecast: number[];
  confidence_intervals?: {
    lower: number[];
    upper: number[];
  };
  timestamps: string[];
  metrics?: {
    [key: string]: number;
  };
}

export interface ModelListResponse {
  models: {
    id: string;
    name: string;
    description: string;
    tags: string[];
  }[];
}

// Error class for API errors
export class ApiError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

/**
 * Base API request function with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    credentials: "include", // Include cookies for session-based auth
  };

  const requestOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    // Add timeout to fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(url, {
      ...requestOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const responseData = await response.json();

    if (!response.ok) {
      throw new ApiError(
        responseData.error || `API error with status: ${response.status}`,
        response.status,
      );
    }

    return responseData as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("Request timeout", 408);
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Unknown API error",
      500,
    );
  }
}

// Model Training API
export async function trainModel(
  modelId: string,
  modelParams: Record<string, any>,
  datasetId: string,
  trainingConfig: Record<string, any> = {},
): Promise<TrainingResponse> {
  return apiRequest<TrainingResponse>("/api/train", {
    method: "POST",
    body: JSON.stringify({
      model_id: modelId,
      parameters: modelParams,
      dataset_id: datasetId,
      config: trainingConfig,
    }),
  });
}

// Get training status
export async function getTrainingStatus(
  jobId: string,
): Promise<TrainingStatusResponse> {
  return apiRequest<TrainingStatusResponse>(`/api/train/status/${jobId}`);
}

// Get trained model forecast
export async function getForecast(
  modelId: string,
  parameters: {
    horizon: number;
    confidence_interval?: number;
    start_date?: string;
  },
): Promise<ForecastResponse> {
  return apiRequest<ForecastResponse>(`/api/forecast/${modelId}`, {
    method: "POST",
    body: JSON.stringify(parameters),
  });
}

// Get available models from backend
export async function getAvailableModels(): Promise<ModelListResponse> {
  return apiRequest<ModelListResponse>("/api/models");
}

// Upload a dataset
export async function uploadDataset(
  file: File,
  config: {
    name: string;
    description?: string;
    frequency?: string;
    date_column?: string;
    target_column?: string;
  },
): Promise<{ dataset_id: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("config", JSON.stringify(config));

  return apiRequest<{ dataset_id: string }>("/api/datasets/upload", {
    method: "POST",
    body: formData,
    headers: {
      // Don't set Content-Type with FormData, browser will set it with boundary
    },
  });
}

// Get dataset list
export async function getDatasets(): Promise<{
  datasets: Array<{
    id: string;
    name: string;
    description?: string;
    rows: number;
    columns: number;
    created_at: string;
  }>;
}> {
  return apiRequest<{ datasets: Array<any> }>("/api/datasets");
}

export default {
  trainModel,
  getTrainingStatus,
  getForecast,
  getAvailableModels,
  uploadDataset,
  getDatasets,
};
