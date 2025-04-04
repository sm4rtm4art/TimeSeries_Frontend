/**
 * Defines the structure of a model parameter
 * @interface ModelParameter
 */
export interface ModelParameter {
  /** Unique identifier for the parameter */
  id: string;
  /** Display name of the parameter */
  name: string;
  /** Optional description explaining the parameter's purpose */
  description?: string;
  /** Parameter input type that determines the UI component rendered */
  type: "number" | "boolean" | "select" | "string" | "slider";
  /** Default value for the parameter */
  defaultValue: string | number | boolean | null;
  /** Minimum value (for number and slider types) */
  min?: number;
  /** Maximum value (for number and slider types) */
  max?: number;
  /** Step increment (for number and slider types) */
  step?: number;
  /** Available options for select type parameters */
  options?: Array<{ label: string; value: string | number | boolean }>;
}

/**
 * Type for storing model configuration parameters
 */
export type ModelConfig = Record<string, any>;

/**
 * Defines model performance characteristics on a 1-5 scale
 * @interface ModelCharacteristics
 */
export interface ModelCharacteristics {
  /** Prediction accuracy (1-5) */
  accuracy: number;
  /** Training and inference speed (1-5) */
  speed: number;
  /** How interpretable/explainable the model is (1-5) */
  interpretability: number;
  /** Data requirements (1-5, higher means more data needed) */
  dataReq: number;
}

/**
 * Type for model tags
 */
export type ModelTag =
  | "Deep Learning"
  | "Statistical"
  | "Neural Network"
  | "Decomposition"
  | "Multivariate"
  | "MLP"
  | "Ensemble"
  | "Recurrent"
  | "Transformer"
  | "State Space"
  | string; // Allow custom tags

/**
 * Complete definition of a forecasting model
 * @interface ModelDefinition
 */
export interface ModelDefinition {
  /** Unique identifier for the model */
  id: string;
  /** Display name of the model */
  name: string;
  /** Detailed description of the model */
  description: string;
  /** Categorization tags */
  tags: ModelTag[];
  /** Performance characteristics ratings */
  characteristics: ModelCharacteristics;
  /** Use cases this model excels at */
  bestFor: string[];
  /** Configuration parameters for this model */
  parameters: ModelParameter[];
  /** Version of the model (optional) */
  version?: string;
  /** URL to documentation or reference implementation */
  documentationUrl?: string;
}

/**
 * Metric fields for model evaluation
 * @interface ModelMetrics
 */
export interface ModelMetrics {
  /** Mean Absolute Percentage Error */
  mape: number;
  /** Root Mean Square Error */
  rmse: number;
  /** Mean Absolute Error */
  mae: number;
  /** Additional custom metrics (optional) */
  [key: string]: number;
}

/**
 * Training result including metrics and parameters used
 * @interface TrainingResult
 */
export interface TrainingResult {
  /** Unique identifier for the training result */
  id: string;
  /** ID of the model used */
  modelId: string;
  /** Display name of the model */
  modelName: string;
  /** Name of the experiment */
  experimentName: string;
  /** Evaluation metrics */
  metrics: ModelMetrics;
  /** Time taken to train */
  runtime: string;
  /** When the model was trained */
  timestamp: string;
  /** Parameters used for this training run */
  parameters: Record<string, any>;
}

/**
 * Status of a training job
 */
export type TrainingStatus = "queued" | "running" | "completed" | "failed";

/**
 * Training configuration options
 * @interface TrainingConfig
 */
export interface TrainingConfig {
  /** Number of epochs to train for */
  epochs?: number;
  /** Percentage of data to use for validation */
  validationSplit?: number;
  /** Random seed for reproducibility */
  seed?: number;
  /** Whether to use hyperparameter tuning */
  autoTune?: boolean;
  /** Time budget for auto-tuning in minutes */
  tuningBudget?: number;
  /** Optimization strategy for tuning */
  tuningStrategy?: "bayesian" | "random" | "grid";
  /** Additional model-specific options */
  [key: string]: any;
}
