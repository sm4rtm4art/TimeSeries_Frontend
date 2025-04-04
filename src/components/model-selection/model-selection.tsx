/**
 * Component for browsing and selecting models
 */
import { useState } from "react";
import { ModelDefinition, ModelTag as _ModelTag } from "@/types/models";
import { useModels } from "@/hooks/use-models";
import ModelCard from "@/components/model-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface ModelSelectionProps {
  /** Handler for when a model is selected */
  onModelSelect?: (model: ModelDefinition) => void;
}

/**
 * Model browsing and selection component
 * @param props Component props
 * @returns ModelSelection component
 */
export default function ModelSelection({ onModelSelect }: ModelSelectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    models,
    selectedModel,
    selectedTags,
    filterByTag,
    clearTagFilters,
    selectModelById,
    getAllTags,
  } = useModels();

  // Filter models by search term
  const filteredModels = searchTerm
    ? models.filter((model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : models;

  const handleModelSelect = (modelId: string) => {
    const model = selectModelById(modelId);
    if (model && onModelSelect) {
      onModelSelect(model);
    }
  };

  const allTags = getAllTags();

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9"
          />
        </div>
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="h-10 px-3"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Filter by tag:</h3>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => filterByTag(tag)}
            >
              {tag}
            </Badge>
          ))}
          {selectedTags.length > 0 && (
            <Badge
              variant="secondary"
              className="cursor-pointer"
              onClick={clearTagFilters}
            >
              Clear filters
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filteredModels.length > 0
          ? (
            filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                selected={selectedModel?.id === model.id}
                onSelect={handleModelSelect}
              />
            ))
          )
          : (
            <div className="col-span-2 flex h-40 items-center justify-center rounded-lg border border-dashed">
              <p className="text-muted-foreground">
                No models match your search criteria
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
