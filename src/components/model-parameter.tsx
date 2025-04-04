"use client";

import { useState } from "react";
import { ModelParameter } from "@/types/models";
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
import { Info } from "lucide-react";

interface ModelParameterProps {
  parameter: ModelParameter;
  value: string | number | boolean | null | undefined;
  onChange: (value: string | number | boolean) => void;
}

export default function ModelParameterComponent({
  parameter,
  value,
  onChange,
}: ModelParameterProps) {
  // Use parameter's default value if no value is provided
  const paramValue = value !== undefined && value !== null
    ? value
    : parameter.defaultValue;

  const renderParameterInput = () => {
    switch (parameter.type) {
      case "boolean":
        // Ensure boolean type
        const boolValue = typeof paramValue === "boolean"
          ? paramValue
          : Boolean(paramValue);
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={parameter.id}
              checked={boolValue}
              onCheckedChange={onChange}
            />
            <Label htmlFor={parameter.id}>{parameter.name}</Label>
          </div>
        );

      case "number":
        // Ensure number type
        const numValue = typeof paramValue === "number"
          ? paramValue
          : Number(paramValue) || 0;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={parameter.id}>{parameter.name}</Label>
              {parameter.description && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{parameter.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <Input
              id={parameter.id}
              type="number"
              min={parameter.min}
              max={parameter.max}
              step={parameter.step}
              value={numValue}
              onChange={(e) => onChange(parseFloat(e.target.value))}
            />
          </div>
        );

      case "string":
        // Ensure string type
        const strValue = typeof paramValue === "string"
          ? paramValue
          : String(paramValue || "");
        return (
          <div className="space-y-2">
            <Label htmlFor={parameter.id}>{parameter.name}</Label>
            <Input
              id={parameter.id}
              type="text"
              value={strValue}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );

      case "select":
        // Ensure string type for select value
        const selectValue = paramValue !== null ? String(paramValue) : "";
        return (
          <div className="space-y-2">
            <Label htmlFor={parameter.id}>{parameter.name}</Label>
            <Select
              value={selectValue}
              onValueChange={(val) => {
                // Convert to appropriate type based on options
                const option = parameter.options?.find((opt) =>
                  String(opt.value) === val
                );
                if (option) {
                  onChange(option.value);
                } else {
                  onChange(val);
                }
              }}
            >
              <SelectTrigger id={parameter.id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {parameter.options?.map((option) => (
                  <SelectItem
                    key={String(option.value)}
                    value={String(option.value)}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "slider":
        // Ensure number type for slider
        const sliderValue = typeof paramValue === "number"
          ? paramValue
          : Number(paramValue) || 0;
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={parameter.id}>{parameter.name}</Label>
              <span className="text-sm text-muted-foreground">
                {sliderValue}
              </span>
            </div>
            <Slider
              id={parameter.id}
              min={parameter.min}
              max={parameter.max}
              step={parameter.step}
              value={[sliderValue]}
              onValueChange={(values) => onChange(values[0])}
            />
            {parameter.min !== undefined && parameter.max !== undefined && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{parameter.min}</span>
                <span>{parameter.max}</span>
              </div>
            )}
          </div>
        );

      default:
        return <div>Unsupported parameter type</div>;
    }
  };

  return (
    <div className="mb-4">
      {renderParameterInput()}
    </div>
  );
}
