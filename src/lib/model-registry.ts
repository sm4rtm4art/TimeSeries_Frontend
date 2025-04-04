import { ModelDefinition, ModelParameter, ModelTag } from "@/types/models";

/**
 * Model Registry that implements the Factory pattern for creating and managing forecasting models.
 *
 * The registry acts as a central repository for all available model definitions
 * and provides methods to register, retrieve, and create instances of models.
 *
 * @class ModelRegistry
 */
class ModelRegistry {
  private models: Map<string, ModelDefinition>;
  private static instance: ModelRegistry;

  /**
   * Private constructor to prevent direct construction calls with the `new` operator.
   * This enforces the Singleton pattern.
   */
  private constructor() {
    this.models = new Map<string, ModelDefinition>();
  }

  /**
   * Get the singleton instance of the ModelRegistry
   * @returns The ModelRegistry instance
   */
  public static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  /**
   * Register a model with the registry
   * @param model The model definition to register
   * @throws Error if a model with the same ID already exists
   */
  public registerModel(model: ModelDefinition): void {
    if (this.models.has(model.id)) {
      throw new Error(
        `Model with ID ${model.id} already exists in the registry`,
      );
    }
    this.models.set(model.id, model);
  }

  /**
   * Get a model by its ID
   * @param id The ID of the model to retrieve
   * @returns The model definition or undefined if not found
   */
  public getModel(id: string): ModelDefinition | undefined {
    return this.models.get(id);
  }

  /**
   * Get all registered models
   * @returns Array of all model definitions
   */
  public getAllModels(): ModelDefinition[] {
    return Array.from(this.models.values());
  }

  /**
   * Register multiple models at once
   * @param models Array of model definitions to register
   */
  public registerModels(models: ModelDefinition[]): void {
    models.forEach((model) => this.registerModel(model));
  }

  /**
   * Filter models by tag
   * @param tag The tag to filter by
   * @returns Array of models with the specified tag
   */
  public getModelsByTag(tag: ModelTag): ModelDefinition[] {
    return this.getAllModels().filter((model) => model.tags.includes(tag));
  }

  /**
   * Check if a model exists in the registry
   * @param id The ID of the model to check
   * @returns True if the model exists, false otherwise
   */
  public hasModel(id: string): boolean {
    return this.models.has(id);
  }

  /**
   * Create a new model definition
   * Factory method that creates a model definition with default values
   *
   * @param id Unique identifier for the model
   * @param name Display name of the model
   * @returns A new model definition with default values
   */
  public createModelDefinition(id: string, name: string): ModelDefinition {
    return {
      id,
      name,
      description: "",
      tags: [],
      characteristics: {
        accuracy: 3,
        speed: 3,
        interpretability: 3,
        dataReq: 3,
      },
      bestFor: [],
      parameters: [],
    };
  }

  /**
   * Create a parameter for a model
   * Factory method that creates a parameter with the specified type
   *
   * @param id Unique identifier for the parameter
   * @param name Display name of the parameter
   * @param type The type of parameter to create
   * @returns A new parameter with default values based on type
   */
  public createParameter(
    id: string,
    name: string,
    type: ModelParameter["type"],
  ): ModelParameter {
    // Create parameter with defaults appropriate to the type
    switch (type) {
      case "number":
        return {
          id,
          name,
          type,
          defaultValue: 0,
          min: 0,
          max: 100,
          step: 1,
        };
      case "boolean":
        return {
          id,
          name,
          type,
          defaultValue: false,
        };
      case "select":
        return {
          id,
          name,
          type,
          defaultValue: "",
          options: [],
        };
      case "slider":
        return {
          id,
          name,
          type,
          defaultValue: 50,
          min: 0,
          max: 100,
          step: 1,
        };
      case "string":
        return {
          id,
          name,
          type,
          defaultValue: "",
        };
    }
  }
}

// Create the singleton instance
const modelRegistry = ModelRegistry.getInstance();

// Pre-register default models
modelRegistry.registerModels([
  {
    id: "nbeats",
    name: "N-BEATS",
    description:
      "Neural Basis Expansion Analysis for Time Series. Deep neural architecture based on backward and forward residual links and a deep stack of fully-connected layers.",
    tags: ["Deep Learning", "Neural Network"],
    characteristics: {
      accuracy: 4.5,
      speed: 3,
      interpretability: 2.5,
      dataReq: 4,
    },
    bestFor: ["Long sequences", "Multiple seasonality", "Complex patterns"],
    parameters: [
      {
        id: "trend_stack",
        name: "Trend Stack",
        description: "Include trend stack in the model",
        type: "boolean",
        defaultValue: true,
      },
      {
        id: "seasonality_stack",
        name: "Seasonality Stack",
        description: "Include seasonality stack in the model",
        type: "boolean",
        defaultValue: true,
      },
      {
        id: "generic_stack",
        name: "Generic Stack",
        description: "Include generic stack in the model",
        type: "boolean",
        defaultValue: true,
      },
      {
        id: "blocks_per_stack",
        name: "Blocks per Stack",
        description: "Number of blocks in each stack",
        type: "number",
        min: 1,
        max: 10,
        defaultValue: 3,
      },
      {
        id: "hidden_units",
        name: "Hidden Layer Units",
        description: "Number of units in hidden layers",
        type: "number",
        min: 16,
        max: 1024,
        step: 16,
        defaultValue: 128,
      },
      {
        id: "lookback_window",
        name: "Lookback Window Size",
        description: "Number of past time steps to use for prediction",
        type: "slider",
        min: 1,
        max: 100,
        step: 1,
        defaultValue: 24,
      },
    ],
  },
  {
    id: "tsmixer",
    name: "TsMixer",
    description:
      "A mixer-based architecture specifically designed for time series forecasting, combining the benefits of both CNN and Transformer approaches with efficient mixing operations.",
    tags: ["Deep Learning", "Mixer", "State-of-the-art"],
    characteristics: {
      accuracy: 4.7,
      speed: 3.5,
      interpretability: 2.3,
      dataReq: 3.8,
    },
    bestFor: ["Multiscale patterns", "Channel mixing", "Efficient training"],
    parameters: [
      {
        id: "hidden_size",
        name: "Hidden Size",
        description: "Dimension of hidden layers",
        type: "number",
        min: 32,
        max: 512,
        step: 32,
        defaultValue: 128,
      },
      {
        id: "num_layers",
        name: "Number of Layers",
        description: "Number of mixer layers",
        type: "number",
        min: 1,
        max: 8,
        defaultValue: 4,
      },
      {
        id: "seq_len",
        name: "Sequence Length",
        description: "Input sequence length for the model",
        type: "slider",
        min: 12,
        max: 168,
        step: 4,
        defaultValue: 96,
      },
      {
        id: "dropout",
        name: "Dropout Rate",
        description: "Dropout rate for regularization",
        type: "slider",
        min: 0,
        max: 0.5,
        step: 0.05,
        defaultValue: 0.1,
      },
      {
        id: "norm_first",
        name: "Normalize First",
        description: "Apply normalization before each block",
        type: "boolean",
        defaultValue: true,
      },
    ],
  },
  {
    id: "prophet",
    name: "Prophet",
    description:
      "Additive model where non-linear trends are fit with yearly, weekly, and daily seasonality, plus holiday effects. Robust to missing data and shifts in the trend.",
    tags: ["Statistical", "Decomposition"],
    characteristics: {
      accuracy: 3.5,
      speed: 4.5,
      interpretability: 4,
      dataReq: 2.5,
    },
    bestFor: ["Seasonal data", "Missing values", "Trend changes"],
    parameters: [
      {
        id: "yearly_seasonality",
        name: "Yearly Seasonality",
        description: "Include yearly seasonality component",
        type: "boolean",
        defaultValue: true,
      },
      {
        id: "weekly_seasonality",
        name: "Weekly Seasonality",
        description: "Include weekly seasonality component",
        type: "boolean",
        defaultValue: true,
      },
      {
        id: "daily_seasonality",
        name: "Daily Seasonality",
        description: "Include daily seasonality component",
        type: "boolean",
        defaultValue: true,
      },
      {
        id: "changepoint_prior_scale",
        name: "Changepoint Prior Scale",
        description:
          "Flexibility of the trend. Larger values allow more flexibility.",
        type: "number",
        min: 0.001,
        max: 0.5,
        step: 0.001,
        defaultValue: 0.05,
      },
      {
        id: "seasonality_prior_scale",
        name: "Seasonality Prior Scale",
        description:
          "Strength of the seasonality. Larger values allow stronger seasonal effects.",
        type: "number",
        min: 0.01,
        max: 10,
        step: 0.01,
        defaultValue: 10,
      },
    ],
  },
  {
    id: "tide",
    name: "TiDE",
    description:
      "Time-series Dense Encoder. A state-of-the-art deep learning model for multivariate time series forecasting with strong performance on complex datasets.",
    tags: ["Deep Learning", "Multivariate"],
    characteristics: {
      accuracy: 4.8,
      speed: 3.2,
      interpretability: 2,
      dataReq: 4.5,
    },
    bestFor: [
      "Multivariate data",
      "Complex dependencies",
      "Long-term forecasts",
    ],
    parameters: [
      {
        id: "encoder_layers",
        name: "Encoder Layers",
        description: "Number of encoder layers",
        type: "number",
        min: 1,
        max: 10,
        defaultValue: 3,
      },
      {
        id: "hidden_dim",
        name: "Hidden Dimension",
        description: "Size of hidden dimension",
        type: "number",
        min: 16,
        max: 512,
        step: 16,
        defaultValue: 128,
      },
      {
        id: "temporal_fusion_heads",
        name: "Temporal Fusion Heads",
        description: "Number of heads in temporal fusion",
        type: "number",
        min: 1,
        max: 8,
        defaultValue: 4,
      },
      {
        id: "dropout_rate",
        name: "Dropout Rate",
        description: "Rate of dropout for regularization",
        type: "slider",
        min: 0,
        max: 0.5,
        step: 0.01,
        defaultValue: 0.1,
      },
    ],
  },
  {
    id: "transformer",
    name: "Transformer",
    description:
      "Attention-based architecture for time series forecasting, leveraging self-attention mechanisms to capture temporal dependencies across the sequence.",
    tags: ["Deep Learning", "Attention", "Sequence-to-Sequence"],
    characteristics: {
      accuracy: 4.4,
      speed: 3.0,
      interpretability: 2.8,
      dataReq: 4.2,
    },
    bestFor: [
      "Complex temporal dependencies",
      "Long-range interactions",
      "High-dimensional data",
    ],
    parameters: [
      {
        id: "n_heads",
        name: "Attention Heads",
        description: "Number of attention heads",
        type: "number",
        min: 1,
        max: 16,
        defaultValue: 8,
      },
      {
        id: "d_model",
        name: "Model Dimension",
        description: "Dimension of the model",
        type: "number",
        min: 64,
        max: 512,
        step: 64,
        defaultValue: 256,
      },
      {
        id: "n_layers",
        name: "Number of Layers",
        description: "Number of transformer layers",
        type: "number",
        min: 1,
        max: 12,
        defaultValue: 6,
      },
      {
        id: "dropout",
        name: "Dropout Rate",
        description: "Rate of dropout for regularization",
        type: "slider",
        min: 0,
        max: 0.5,
        step: 0.05,
        defaultValue: 0.1,
      },
      {
        id: "max_seq_len",
        name: "Maximum Sequence Length",
        description: "Maximum length of input sequences",
        type: "slider",
        min: 24,
        max: 336,
        step: 24,
        defaultValue: 168,
      },
    ],
  },
]);

// Export the function interfaces
export const {
  registerModel,
  getModel,
  getAllModels,
  registerModels,
  getModelsByTag,
  hasModel,
  createModelDefinition,
  createParameter,
} = {
  registerModel: modelRegistry.registerModel.bind(modelRegistry),
  getModel: modelRegistry.getModel.bind(modelRegistry),
  getAllModels: modelRegistry.getAllModels.bind(modelRegistry),
  registerModels: modelRegistry.registerModels.bind(modelRegistry),
  getModelsByTag: modelRegistry.getModelsByTag.bind(modelRegistry),
  hasModel: modelRegistry.hasModel.bind(modelRegistry),
  createModelDefinition: modelRegistry.createModelDefinition.bind(
    modelRegistry,
  ),
  createParameter: modelRegistry.createParameter.bind(modelRegistry),
};

// Also export the registry instance for advanced use cases
export default modelRegistry;
