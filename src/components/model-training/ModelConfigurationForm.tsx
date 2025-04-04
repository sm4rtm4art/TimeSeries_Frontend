import React, { useEffect, useState } from "react";
import { ModelDefinition } from "@/types/models";
import { getModel } from "@/lib/model-registry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Settings, Wand2 } from "lucide-react";
import ModelParameter from "./ModelParameter";

// Define parameter value types
type ParameterValue = string | number | boolean | null | undefined;
type ParameterRecord = Record<string, ParameterValue>;

/**
 * Props for the ModelConfigurationForm component
 * @interface ModelConfigurationFormProps
 */
interface ModelConfigurationFormProps {
  /** The ID of the model to configure */
  modelId: string;
  /** Callback when the configuration is saved */
  onSave?: (modelId: string, configuration: ParameterRecord) => void;
  /** Initial parameter values */
  initialValues?: ParameterRecord;
  /** Whether the form is in loading state */
  isLoading?: boolean;
  /** Whether auto-tuning is enabled */
  autoTuneEnabled?: boolean;
  /** Callback when auto-tune is toggled */
  onAutoTuneToggle?: (enabled: boolean) => void;
  /** Callback when the back button is clicked */
  onBack?: () => void;
}

/**
 * A form for configuring model parameters
 *
 * @component ModelConfigurationForm
 */
export const ModelConfigurationForm: React.FC<ModelConfigurationFormProps> = ({
  modelId,
  onSave,
  initialValues = {},
  isLoading = false,
  autoTuneEnabled = false,
  onAutoTuneToggle,
  onBack,
}) => {
  const [model, setModel] = useState<ModelDefinition | null>(null);
  const [paramValues, setParamValues] = useState<ParameterRecord>(
    initialValues,
  );
  const [error, setError] = useState<string | null>(null);

  // Load model when modelId changes
  useEffect(() => {
    const modelData = getModel(modelId);
    if (modelData) {
      setModel(modelData);

      // Initialize any missing parameters with default values
      const newValues = { ...initialValues };
      modelData.parameters.forEach((param) => {
        if (newValues[param.id] === undefined) {
          newValues[param.id] = param.defaultValue;
        }
      });
      setParamValues(newValues);
      setError(null);
    } else {
      setModel(null);
      setError(`Model with ID "${modelId}" not found`);
    }
  }, [modelId, initialValues]);

  /**
   * Handle parameter value changes
   * @param paramId The parameter ID
   * @param value The new value
   */
  const handleParameterChange = (paramId: string, value: ParameterValue) => {
    setParamValues((prev) => ({
      ...prev,
      [paramId]: value,
    }));
  };

  /**
   * Handle form submission
   * @param e Form event
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (model && onSave) {
      onSave(model.id, paramValues);
    }
  };

  /**
   * Reset parameters to default values
   */
  const handleReset = () => {
    if (model) {
      const defaultValues = model.parameters.reduce<ParameterRecord>(
        (acc, param) => ({
          ...acc,
          [param.id]: param.defaultValue,
        }),
        {},
      );
      setParamValues(defaultValues);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!model) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading model configuration...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{model.name} Configuration</CardTitle>
          </div>
          <div className="flex space-x-2">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onBack}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {onAutoTuneToggle && (
              <Button
                type="button"
                variant={autoTuneEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => onAutoTuneToggle(!autoTuneEnabled)}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                Auto-Tune
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {autoTuneEnabled
            ? (
              <div className="mb-4 rounded-md bg-blue-50 p-4 dark:bg-blue-950">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Auto-tuning is enabled. The system will automatically search
                  for optimal parameters within the specified ranges.
                </p>
              </div>
            )
            : (
              <>
                {model.parameters.length === 0
                  ? (
                    <div className="text-center text-sm text-muted-foreground">
                      This model has no configurable parameters.
                    </div>
                  )
                  : (
                    <div className="space-y-4">
                      {/* Group parameters by common prefixes or create logical sections */}
                      <div>
                        {model.parameters.map((param) => (
                          <ModelParameter
                            key={param.id}
                            parameter={param}
                            value={paramValues[param.id]}
                            onChange={handleParameterChange}
                            disabled={isLoading || autoTuneEnabled}
                          />
                        ))}
                      </div>

                      <Separator />

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleReset}
                          disabled={isLoading}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Reset to Defaults
                        </Button>
                        {onSave && (
                          <Button type="submit" disabled={isLoading}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Configuration
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
              </>
            )}
        </CardContent>
      </Card>
    </form>
  );
};

export default ModelConfigurationForm;
