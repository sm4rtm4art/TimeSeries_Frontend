import React from "react";
import { ModelDefinition, ModelTag } from "@/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ModelCardProps {
  /** The model definition to display */
  model: ModelDefinition;
  /** Whether this model is currently selected */
  selected?: boolean;
  /** Handler for when the model is selected */
  onSelect?: (modelId: string) => void;
  /** Handler for when configure is clicked */
  onConfigure?: (modelId: string) => void;
  /** Whether to show the configure button */
  showConfigureButton?: boolean;
}

/**
 * A card component to display a model with its details
 * @param props Component props
 * @returns ModelCard component
 */
export default function ModelCard({
  model,
  selected = false,
  onSelect,
  onConfigure,
  showConfigureButton = true,
}: ModelCardProps) {
  const handleClick = () => {
    if (onSelect) {
      onSelect(model.id);
    }
  };

  const handleConfigureClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onConfigure) {
      onConfigure(model.id);
    }
  };

  return (
    <Card
      className={`cursor-pointer transition-all ${
        selected ? "border-primary ring-2 ring-primary ring-opacity-50" : ""
      }`}
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{model.name}</CardTitle>
          {selected && <Badge className="bg-primary">Selected</Badge>}
        </div>
        <div className="flex flex-wrap gap-2">
          {model.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{model.description}</p>
        {showConfigureButton && (
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={handleConfigureClick}
          >
            {selected ? "Configure" : "Select"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
