import React, { useEffect, useState } from "react";
import {
  getAllModels,
  getModelsByTag as _getModelsByTag,
} from "@/lib/model-registry";
import { ModelDefinition, ModelTag } from "@/types/models";
import ModelCard from "./ModelCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";

/**
 * Props for the ModelSelector component
 * @interface ModelSelectorProps
 */
interface ModelSelectorProps {
  /** Array of model IDs that are currently selected */
  selectedModels: string[];
  /** Callback when the selection changes */
  onSelectionChange: (modelIds: string[]) => void;
}

/**
 * A component that displays a grid of model cards and handles model selection
 *
 * @component ModelSelector
 */
export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModels,
  onSelectionChange,
}) => {
  const [models, setModels] = useState<ModelDefinition[]>([]);
  const [filteredModels, setFilteredModels] = useState<ModelDefinition[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTags, setActiveTags] = useState<ModelTag[]>([]);
  const [allTags, setAllTags] = useState<ModelTag[]>([]);

  // Load models on component mount
  useEffect(() => {
    const availableModels = getAllModels();
    setModels(availableModels);
    setFilteredModels(availableModels);

    // Extract all unique tags
    const tags = new Set<ModelTag>();
    availableModels.forEach((model) => {
      model.tags.forEach((tag) => tags.add(tag));
    });
    setAllTags(Array.from(tags));
  }, []);

  // Filter models when search query or tags change
  useEffect(() => {
    let filtered = models;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (model) =>
          model.name.toLowerCase().includes(query) ||
          model.description.toLowerCase().includes(query) ||
          model.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          model.bestFor.some((use) => use.toLowerCase().includes(query)),
      );
    }

    // Filter by active tags
    if (activeTags.length > 0) {
      filtered = filtered.filter((model) =>
        activeTags.some((tag) => model.tags.includes(tag))
      );
    }

    setFilteredModels(filtered);
  }, [searchQuery, activeTags, models]);

  /**
   * Toggle a model's selection state
   * @param modelId The ID of the model to toggle
   */
  const handleToggleSelection = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      onSelectionChange(selectedModels.filter((id) => id !== modelId));
    } else {
      onSelectionChange([...selectedModels, modelId]);
    }
  };

  /**
   * Toggle a tag's active state
   * @param tag The tag to toggle
   */
  const handleToggleTag = (tag: ModelTag) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter((t) => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  /**
   * Clear all filters
   */
  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveTags([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Label htmlFor="search-models" className="sr-only">
            Search models
          </Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              id="search-models"
              placeholder="Search models..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                onClick={() => setSearchQuery("")}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            disabled={!searchQuery && activeTags.length === 0}
            type="button"
          >
            <Filter className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={activeTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleToggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {filteredModels.length === 0
        ? (
          <div className="flex h-40 flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No models found matching your search criteria.
            </p>
            <Button
              variant="link"
              size="sm"
              onClick={handleClearFilters}
              className="mt-2"
              type="button"
            >
              Clear filters
            </Button>
          </div>
        )
        : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={selectedModels.includes(model.id)}
                onToggleSelection={handleToggleSelection}
              />
            ))}
          </div>
        )}

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {selectedModels.length} model{selectedModels.length !== 1 && "s"}{" "}
          selected
        </span>
      </div>
    </div>
  );
};

export default ModelSelector;
