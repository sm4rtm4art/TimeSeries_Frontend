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
  value: any;
  onChange: (value: any) => void;
}

export default function ModelParameterComponent({
  parameter,
  value,
  onChange,
}: ModelParameterProps) {
  // Use parameter's default value if no value is provided
  const paramValue = value !== undefined ? value : parameter.defaultValue;

  const renderParameterInput = () => {
    switch (parameter.type) {
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={parameter.id}
              checked={paramValue}
              onCheckedChange={onChange}
            />
            <Label htmlFor={parameter.id}>{parameter.name}</Label>
          </div>
        );

      case "number":
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
              value={paramValue}
              onChange={(e) => onChange(parseFloat(e.target.value))}
            />
          </div>
        );

      case "string":
        return (
          <div className="space-y-2">
            <Label htmlFor={parameter.id}>{parameter.name}</Label>
            <Input
              id={parameter.id}
              type="text"
              value={paramValue}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        );

      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={parameter.id}>{parameter.name}</Label>
            <Select
              value={paramValue.toString()}
              onValueChange={onChange}
            >
              <SelectTrigger id={parameter.id}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {parameter.options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "slider":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={parameter.id}>{parameter.name}</Label>
              <span className="text-sm text-muted-foreground">
                {paramValue}
              </span>
            </div>
            <Slider
              id={parameter.id}
              min={parameter.min}
              max={parameter.max}
              step={parameter.step}
              value={[paramValue]}
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
