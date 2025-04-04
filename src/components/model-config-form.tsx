/**
 * Dynamic model configuration form that renders parameters based on model definition
 */
import React from "react";
import { ModelDefinition } from "@/types/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ModelParameterComponent from "@/components/model-parameter";
import { ModelConfig, useModelConfig } from "@/hooks/use-model-config";
import { AlertCircle, RotateCcw, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ModelConfigFormProps {
  /** The model to configure */
  model: ModelDefinition;
  /** Handler for when configuration is submitted */
  onSubmit?: (config: ModelConfig) => void;
  /** Initial configuration (optional) */
  initialConfig?: ModelConfig;
}

/**
 * Dynamic form component for configuring model parameters
 * @param props Component props
 * @returns ModelConfigForm component
 */
export default function ModelConfigForm({
  model,
  onSubmit,
  initialConfig,
}: ModelConfigFormProps) {
  const {
    config,
    updateParameter,
    resetToDefaults,
    validateConfiguration,
  } = useModelConfig(model);

  // Load initial config if provided
  React.useEffect(() => {
    if (initialConfig) {
      Object.entries(initialConfig).forEach(([paramId, value]) => {
        updateParameter(paramId, value);
      });
    }
  }, [initialConfig, updateParameter]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const validation = validateConfiguration();
    if (validation.isValid && onSubmit) {
      onSubmit(config);
    }
  };

  const validation = validateConfiguration();

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Configure {model.name}</CardTitle>
          <CardDescription>
            Adjust parameters to optimize model performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {model.parameters.map((parameter) => (
              <ModelParameterComponent
                key={parameter.id}
                parameter={parameter}
                value={config[parameter.id]}
                onChange={(value) => updateParameter(parameter.id, value)}
              />
            ))}

            {!validation.isValid && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc pl-5">
                    {validation.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={resetToDefaults}
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>

              <Button type="submit" disabled={!validation.isValid}>
                <Save className="mr-2 h-4 w-4" />
                Apply Configuration
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
