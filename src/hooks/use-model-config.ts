/**
 * React hook for managing model configuration state
 */
import { useCallback, useEffect, useState } from "react";
import { ModelDefinition, ModelParameter } from "@/types/models";

/**
 * Type for model configuration
 */
export type ModelConfig = Record<string, any>;

/**
 * Hook for managing model configuration state
 * @param model The model definition to configure
 * @returns Object containing configuration state and methods
 */
export function useModelConfig(model: ModelDefinition | null) {
  // Initialize configuration with default values from model parameters
  const getDefaultConfig = useCallback(() => {
    if (!model) return {};

    return model.parameters.reduce<ModelConfig>((config, param) => {
      config[param.id] = param.defaultValue;
      return config;
    }, {});
  }, [model]);

  const [config, setConfig] = useState<ModelConfig>(getDefaultConfig());

  // Reset configuration when model changes
  useEffect(() => {
    setConfig(getDefaultConfig());
  }, [model, getDefaultConfig]);

  /**
   * Update a single parameter value
   * @param paramId The parameter ID to update
   * @param value The new value
   */
  const updateParameter = useCallback((paramId: string, value: any) => {
    setConfig((current) => ({
      ...current,
      [paramId]: value,
    }));
  }, []);

  /**
   * Reset configuration to default values
   */
  const resetToDefaults = useCallback(() => {
    setConfig(getDefaultConfig());
  }, [getDefaultConfig]);

  /**
   * Update multiple parameters at once
   * @param updates Object containing parameter updates
   */
  const updateMultipleParameters = useCallback((updates: ModelConfig) => {
    setConfig((current) => ({
      ...current,
      ...updates,
    }));
  }, []);

  /**
   * Save the current configuration with a name
   * @param name Name to save the configuration as
   * @returns The saved configuration object
   */
  const saveConfiguration = useCallback((name: string) => {
    if (!model) return null;

    const savedConfig = {
      id: `${model.id}-${Date.now()}`,
      name,
      modelId: model.id,
      modelName: model.name,
      parameters: { ...config },
      createdAt: new Date().toISOString(),
    };

    // Here you could persist to localStorage or an API
    // For now, we just return the object
    return savedConfig;
  }, [model, config]);

  /**
   * Load a saved configuration
   * @param savedConfig The saved configuration to load
   */
  const loadConfiguration = useCallback((savedConfig: any) => {
    if (savedConfig && savedConfig.parameters) {
      setConfig(savedConfig.parameters);
    }
  }, []);

  /**
   * Validate the current configuration
   * @returns Object with validation results
   */
  const validateConfiguration = useCallback(() => {
    if (!model) return { isValid: false, errors: ["No model selected"] };

    const errors: string[] = [];

    model.parameters.forEach((param) => {
      const value = config[param.id];

      // Check required parameters
      if (value === undefined || value === null) {
        errors.push(`Parameter ${param.name} is required`);
      }

      // Validate number parameters
      if (param.type === "number" || param.type === "slider") {
        if (typeof value === "number") {
          if (param.min !== undefined && value < param.min) {
            errors.push(`${param.name} must be at least ${param.min}`);
          }
          if (param.max !== undefined && value > param.max) {
            errors.push(`${param.name} must be at most ${param.max}`);
          }
        } else if (value !== undefined) {
          errors.push(`${param.name} must be a number`);
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [model, config]);

  return {
    config,
    updateParameter,
    resetToDefaults,
    updateMultipleParameters,
    saveConfiguration,
    loadConfiguration,
    validateConfiguration,
  };
}
