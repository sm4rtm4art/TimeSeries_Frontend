/**
 * React hook for working with models from the model registry
 */
import { useEffect, useState } from "react";
import { ModelDefinition, ModelTag } from "@/types/models";
import modelRegistry, {
  getAllModels,
  getModel,
  getModelsByTag,
} from "@/lib/model-registry";

/**
 * Hook for accessing and filtering models from the registry
 * @returns Object containing models and filter methods
 */
export function useModels() {
  const [models, setModels] = useState<ModelDefinition[]>([]);
  const [filteredModels, setFilteredModels] = useState<ModelDefinition[]>([]);
  const [selectedTags, setSelectedTags] = useState<ModelTag[]>([]);
  const [selectedModel, setSelectedModel] = useState<ModelDefinition | null>(
    null,
  );

  // Load all models on initial render
  useEffect(() => {
    const allModels = getAllModels();
    setModels(allModels);
    setFilteredModels(allModels);
  }, []);

  // Filter models when selected tags change
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredModels(models);
    } else {
      const filtered = models.filter((model) =>
        selectedTags.some((tag) => model.tags.includes(tag))
      );
      setFilteredModels(filtered);
    }
  }, [selectedTags, models]);

  /**
   * Filter models by a specific tag
   * @param tag The tag to filter by
   */
  const filterByTag = (tag: ModelTag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  /**
   * Clear all tag filters
   */
  const clearTagFilters = () => {
    setSelectedTags([]);
  };

  /**
   * Select a model by its ID
   * @param modelId The ID of the model to select
   * @returns The selected model or null if not found
   */
  const selectModelById = (modelId: string) => {
    const model = getModel(modelId);
    setSelectedModel(model || null);
    return model || null;
  };

  /**
   * Get all available tags from all models
   * @returns Array of unique tags
   */
  const getAllTags = () => {
    const tags = new Set<ModelTag>();
    models.forEach((model) => {
      model.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  };

  return {
    models: filteredModels,
    allModels: models,
    selectedModel,
    selectedTags,
    filterByTag,
    clearTagFilters,
    selectModelById,
    getAllTags,
  };
}
