"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ModelDefinition, ModelTag } from "@/types/models";
import _modelRegistry, {
  getAllModels,
  getModel,
  getModelsByTag as _getModelsByTag,
} from "@/lib/model-registry";

interface ModelContextType {
  models: ModelDefinition[];
  filteredModels: ModelDefinition[];
  selectedModel: ModelDefinition | null;
  selectedTags: ModelTag[];
  filterByTag: (tag: ModelTag) => void;
  clearTagFilters: () => void;
  selectModelById: (modelId: string) => ModelDefinition | null;
  getAllTags: () => ModelTag[];
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelProvider({ children }: { children: ReactNode }) {
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

    // For debugging
    console.log("ModelContext: Loaded models", allModels);
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

  const value = {
    models: filteredModels,
    filteredModels,
    selectedModel,
    selectedTags,
    filterByTag,
    clearTagFilters,
    selectModelById,
    getAllTags,
  };

  return (
    <ModelContext.Provider value={value}>
      {children}
    </ModelContext.Provider>
  );
}

export function useModels() {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error("useModels must be used within a ModelProvider");
  }
  return context;
}
