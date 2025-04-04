/**
 * API client for communicating with the FastAPI backend
 */

// Default API configuration
// Use Deno's environment variables if available, fallback to default
let API_BASE_URL = "http://localhost:8000";
try {
  // @ts-ignore - Handle both Deno and Node.js environments
  if (typeof Deno !== "undefined" && Deno.env && Deno.env.get) {
    const envUrl = Deno.env.get("NEXT_PUBLIC_API_BASE_URL");
    if (envUrl) {
      API_BASE_URL = envUrl;
    }
  }
  // We'll let the default stay if we can't read environment variables
} catch (_error) {
  // Ignore errors when checking environment - will use default
}

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
  metrics?: Record<string, number>;
  message?: string;
}

// Define ForecastResponse type
export interface ForecastResponse {
  forecast: number[];
  confidence_intervals: {
    lower: number[];
    upper: number[];
  };
  timestamps: string[];
  metrics: {
    mape: number;
    rmse: number;
    mae: number;
    [key: string]: number;
  };
}

// Define ModelListResponse type
export interface ModelListResponse {
  models: Array<{
    id: string;
    name: string;
    description?: string;
    tags?: string[];
  }>;
}

// Define Dataset type
export interface Dataset {
  id: string;
  name: string;
  description?: string;
  rows: number;
  columns: number;
  created_at: string;
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
export function trainModel(
  modelId: string,
  modelParams: Record<string, unknown>,
  datasetId: string,
  trainingConfig: Record<string, unknown> = {},
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
export function getTrainingStatus(
  jobId: string,
): Promise<TrainingStatusResponse> {
  return apiRequest<TrainingStatusResponse>(`/api/train/status/${jobId}`);
}

// Get trained model forecast
export function getForecast(
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

// Get available models
export function getAvailableModels(): Promise<ModelListResponse> {
  return apiRequest<ModelListResponse>("/api/models");
}

// Upload dataset
export function uploadDataset(
  file: File,
  config: {
    name: string;
    description?: string;
  },
): Promise<{ dataset_id: string }> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("name", config.name);

  if (config.description) {
    formData.append("description", config.description);
  }

  return apiRequest<{ dataset_id: string }>("/api/datasets/upload", {
    method: "POST",
    body: formData,
    headers: {
      // Remove content-type header to let browser set it with boundary
      "Content-Type": undefined as unknown as string,
    },
  });
}

// Get dataset list
export function getDatasets(): Promise<{
  datasets: Dataset[];
}> {
  return apiRequest<{ datasets: Dataset[] }>("/api/datasets");
}

export default {
  trainModel,
  getTrainingStatus,
  getForecast,
  getAvailableModels,
  uploadDataset,
  getDatasets,
};
