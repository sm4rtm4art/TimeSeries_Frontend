/**
 * Model training form component
 */
import { useState } from "react";
import { ModelConfig, ModelDefinition, ModelMetrics } from "@/types/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Play, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import ModelConfigForm from "@/components/model-config-form";
import { ResultsVisualization } from "@/components/results";

// Interface for training result
interface TrainingResult {
  id: string;
  modelId: string;
  modelName: string;
  experimentName: string;
  metrics: ModelMetrics;
  runtime: string;
  timestamp: string;
  parameters: ModelConfig;
}

interface TrainingFormProps {
  model: ModelDefinition;
  initialConfig?: ModelConfig;
  onTrainingComplete?: (resultId: string) => void;
}

/**
 * Simplified training form to avoid complex state management
 */
export default function TrainingForm({
  model,
  initialConfig,
  onTrainingComplete,
}: TrainingFormProps) {
  const [activeTab, setActiveTab] = useState("config");
  const [selectedDataset, setSelectedDataset] = useState("");
  const [experimentName, setExperimentName] = useState("");
  const [configuration, setConfiguration] = useState<ModelConfig>({});

  // Local training state (simplified)
  const [trainingState, setTrainingState] = useState({
    isTraining: false,
    progress: 0,
    isComplete: false,
    result: null as TrainingResult | null,
  });

  // Handle config updates
  const handleConfigUpdate = (config: ModelConfig) => {
    setConfiguration(config);
  };

  // Start training simulation
  const handleStartTraining = () => {
    if (!selectedDataset) return;

    const config = {
      ...configuration,
      experimentName: experimentName || `${model.name} Experiment`,
    };

    console.log("Starting training with:", {
      model,
      config,
      dataset: selectedDataset,
    });

    // Start training simulation
    setTrainingState({
      isTraining: true,
      progress: 0,
      isComplete: false,
      result: null,
    });
    setActiveTab("progress");

    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setTrainingState((prev) => ({
        ...prev,
        progress,
      }));

      if (progress >= 100) {
        clearInterval(interval);

        // Simulate results after completion
        setTimeout(() => {
          const result: TrainingResult = {
            id: `result-${Date.now()}`,
            modelId: model.id,
            modelName: model.name,
            experimentName: experimentName || `${model.name} Experiment`,
            metrics: {
              mape: Math.random() * 10 + 5,
              rmse: Math.random() * 50 + 20,
              mae: Math.random() * 30 + 10,
            },
            runtime: `${Math.floor(Math.random() * 5) + 1}m ${
              Math.floor(Math.random() * 50) + 10
            }s`,
            timestamp: new Date().toISOString(),
            parameters: config,
          };

          setTrainingState({
            isTraining: false,
            progress: 100,
            isComplete: true,
            result,
          });

          if (onTrainingComplete) {
            onTrainingComplete(result.id);
          }
        }, 500);
      }
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="config">
            <Settings className="mr-2 h-4 w-4" />
            Configuration
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            disabled={!trainingState.isTraining && !trainingState.isComplete}
          >
            <Play className="mr-2 h-4 w-4" />
            Training Progress
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!trainingState.isComplete}>
            <ChevronRight className="mr-2 h-4 w-4" />
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Settings</CardTitle>
              <CardDescription>
                Configure the training job for {model.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="experimentName">Experiment Name</Label>
                <Input
                  id="experimentName"
                  placeholder={`${model.name} Experiment`}
                  value={experimentName}
                  onChange={(e) => setExperimentName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataset">Dataset</Label>
                <Select
                  value={selectedDataset}
                  onValueChange={setSelectedDataset}
                >
                  <SelectTrigger id="dataset">
                    <SelectValue placeholder="Select a dataset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Retail Sales</SelectItem>
                    <SelectItem value="energy">Energy Consumption</SelectItem>
                    <SelectItem value="web_traffic">Web Traffic</SelectItem>
                    <SelectItem value="stock">Stock Prices</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ModelConfigForm
                model={model}
                initialConfig={initialConfig}
                onSubmit={handleConfigUpdate}
              />

              <Button
                onClick={handleStartTraining}
                disabled={!selectedDataset || trainingState.isTraining}
                className="w-full"
              >
                <Play className="mr-2 h-4 w-4" />
                Start Training
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Training Progress</CardTitle>
              <CardDescription>
                {model.name} - {trainingState.isComplete
                  ? "Completed"
                  : trainingState.isTraining
                  ? "Running"
                  : "Waiting"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={trainingState.progress} />
              <p className="text-center text-sm text-muted-foreground">
                {trainingState.isTraining
                  ? `Training ${model.name}: ${trainingState.progress}%`
                  : ""}
              </p>

              {trainingState.isComplete && trainingState.result && (
                <div className="rounded-md bg-muted p-4">
                  <h4 className="font-medium">Training Complete</h4>
                  <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <dt>MAPE:</dt>
                    <dd>{trainingState.result.metrics.mape.toFixed(2)}%</dd>
                    <dt>RMSE:</dt>
                    <dd>{trainingState.result.metrics.rmse.toFixed(2)}</dd>
                    <dt>MAE:</dt>
                    <dd>{trainingState.result.metrics.mae.toFixed(2)}</dd>
                    <dt>Runtime:</dt>
                    <dd>{trainingState.result.runtime}</dd>
                  </dl>

                  <Button
                    variant="outline"
                    className="mt-4 w-full"
                    onClick={() => setActiveTab("results")}
                  >
                    View Detailed Results
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {trainingState.isComplete && trainingState.result && (
            <ResultsVisualization result={trainingState.result} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
