import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Brain, HelpCircle, Info } from "lucide-react";
import { ModelDefinition } from "@/types/models";

/**
 * Props for the ModelCard component
 * @interface ModelCardProps
 */
interface ModelCardProps {
  /** The model definition to display */
  model: ModelDefinition;
  /** Whether the model is currently selected */
  isSelected: boolean;
  /** Callback when the model selection state changes */
  onToggleSelection: (modelId: string) => void;
}

/**
 * A card component that displays information about a model and handles selection
 *
 * @component ModelCard
 */
export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  isSelected,
  onToggleSelection,
}) => {
  /**
   * Get the appropriate color class for a characteristic value
   * @param value The characteristic value (1-5)
   * @returns A CSS color class
   */
  const getCharacteristicColor = (value: number): string => {
    if (value >= 4) return "text-green-500";
    if (value >= 3) return "text-blue-500";
    if (value >= 2) return "text-yellow-500";
    return "text-red-500";
  };

  /**
   * Render bar indicators for a characteristic value
   * @param value The characteristic value (1-5)
   * @returns JSX for the bar indicators
   */
  const renderCharacteristicBars = (value: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 w-3 rounded-sm ${
              i <= Math.floor(value)
                ? getCharacteristicColor(value)
                : "bg-gray-200 dark:bg-gray-700"
            } ${
              i === Math.ceil(value) && i > Math.floor(value)
                ? "opacity-50"
                : "opacity-100"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card
      className={`transition-all hover:shadow-md ${
        isSelected
          ? "border-blue-400 dark:border-blue-500"
          : "hover:border-gray-300 dark:hover:border-gray-600"
      }`}
      onClick={() => onToggleSelection(model.id)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <div className="flex items-center">
            <CardTitle className="text-xl">{model.name}</CardTitle>
            {model.documentationUrl && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href={model.documentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <Info className="h-4 w-4" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View documentation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          <div>
            {model.version && (
              <Badge variant="outline" className="text-xs">
                v{model.version}
              </Badge>
            )}
          </div>
        </div>
        <CardDescription>{model.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-2 flex flex-wrap gap-1">
          {model.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-xs">
              <span>Accuracy</span>
              <span
                className={getCharacteristicColor(
                  model.characteristics.accuracy,
                )}
              >
                {model.characteristics.accuracy.toFixed(1)}
              </span>
            </div>
            {renderCharacteristicBars(model.characteristics.accuracy)}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-xs">
              <span>Speed</span>
              <span
                className={getCharacteristicColor(model.characteristics.speed)}
              >
                {model.characteristics.speed.toFixed(1)}
              </span>
            </div>
            {renderCharacteristicBars(model.characteristics.speed)}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-xs">
              <span>Interpretability</span>
              <span
                className={getCharacteristicColor(
                  model.characteristics.interpretability,
                )}
              >
                {model.characteristics.interpretability.toFixed(1)}
              </span>
            </div>
            {renderCharacteristicBars(model.characteristics.interpretability)}
          </div>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-xs">
              <span>Data Requirements</span>
              <span
                className={getCharacteristicColor(
                  5 - model.characteristics.dataReq,
                )}
              >
                {model.characteristics.dataReq.toFixed(1)}
              </span>
            </div>
            {renderCharacteristicBars(model.characteristics.dataReq)}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <span className="font-medium">Best for:</span>
          {model.bestFor.join(", ")}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ModelCard;
