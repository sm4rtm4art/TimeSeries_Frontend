import React from "react";
import { ModelParameter as IModelParameter } from "@/types/models";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";

/**
 * Props for the ModelParameter component
 * @interface ModelParameterProps
 */
interface ModelParameterProps {
  /** The parameter definition */
  parameter: IModelParameter;
  /** Current value of the parameter */
  value: string | number | boolean | null | undefined;
  /** Callback when the parameter value changes */
  onChange: (paramId: string, value: string | number | boolean) => void;
  /** Whether the parameter is disabled */
  disabled?: boolean;
}

/**
 * A component that renders a parameter input based on its type
 *
 * @component ModelParameter
 */
export const ModelParameter: React.FC<ModelParameterProps> = ({
  parameter,
  value,
  onChange,
  disabled = false,
}) => {
  const {
    id,
    name,
    description,
    type,
    min,
    max,
    step,
    options,
  } = parameter;

  // If value is undefined, use the default value
  const currentValue = value !== undefined ? value : parameter.defaultValue;

  /**
   * Render the appropriate input control based on parameter type
   */
  const renderInputControl = () => {
    switch (type) {
      case "boolean":
        return (
          <Switch
            checked={Boolean(currentValue)}
            onCheckedChange={(checked) => onChange(id, checked)}
            disabled={disabled}
          />
        );

      case "number":
        return (
          <Input
            type="number"
            min={min}
            max={max}
            step={step || 1}
            value={currentValue}
            onChange={(e) => onChange(id, Number(e.target.value))}
            disabled={disabled}
            className="w-full"
          />
        );

      case "string":
        return (
          <Input
            type="text"
            value={currentValue}
            onChange={(e) => onChange(id, e.target.value)}
            disabled={disabled}
            className="w-full"
          />
        );

      case "select":
        return (
          <Select
            value={String(currentValue)}
            onValueChange={(value) => onChange(id, value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {options?.map((option) => (
                <SelectItem
                  key={String(option.value)}
                  value={String(option.value)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "slider":
        return (
          <div className="space-y-2">
            <Slider
              min={min}
              max={max}
              step={step || 1}
              value={[Number(currentValue)]}
              onValueChange={(values) => onChange(id, values[0])}
              disabled={disabled}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{min}</span>
              <span>{max}</span>
            </div>
          </div>
        );

      default:
        return <div>Unsupported parameter type: {type}</div>;
    }
  };

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Label htmlFor={id}>{name}</Label>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* For boolean parameters, show the switch in the label row */}
        {type === "boolean" && renderInputControl()}
      </div>

      {/* For non-boolean parameters, show the control below the label */}
      {type !== "boolean" && (
        <div className="w-full">
          {renderInputControl()}
        </div>
      )}
    </div>
  );
};

export default ModelParameter;
