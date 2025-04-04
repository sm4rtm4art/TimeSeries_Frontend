"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Settings } from "lucide-react";
import { TrainingConfig, TrainingStatus } from "@/types/models";
import ModelSelector from "./ModelSelector";
import ModelConfigurationForm from "./ModelConfigurationForm";
import TrainingProgress from "./TrainingProgress";
import ModelResults from "./ModelResults";
import { trainModel } from "@/lib/api-client";

/**
 * Main component for model training workflow
 *
 * @component ModelTraining
 */
const ModelTraining: React.FC = () => {
  // State for tracking active tab
  const [activeTab, setActiveTab] = useState<string>("selection");

  // State for selected models and their configurations
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [modelConfigurations, setModelConfigurations] = useState<
    Record<string, Record<string, any>>
  >({});

  // State for training workflow
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus>(
    "queued",
  );
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [trainingStep, setTrainingStep] = useState<string>("");

  // State for auto-tuning
  const [autoTuneEnabled, setAutoTuneEnabled] = useState<boolean>(false);
  const [trainingConfig, setTrainingConfig] = useState<TrainingConfig>({
    epochs: 10,
    validationSplit: 0.2,
    autoTune: false,
    tuningBudget: 30,
    tuningStrategy: "bayesian",
  });

  // Mock resources for demo purposes
  const [cpuUsage, setCpuUsage] = useState<number>(0);
  const [memoryUsage, setMemoryUsage] = useState<number>(0);
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number>(
    0,
  );

  // State for training results
  const [trainingResults, setTrainingResults] = useState<Record<string, any>>(
    {},
  );

  /**
   * Handle model selection changes
   * @param modelIds Array of selected model IDs
   */
  const handleSelectionChange = (modelIds: string[]) => {
    setSelectedModels(modelIds);
  };

  /**
   * Handle configuration save for a model
   * @param modelId Model ID
   * @param configuration Parameter values
   */
  const handleConfigurationSave = (
    modelId: string,
    configuration: Record<string, any>,
  ) => {
    setModelConfigurations((prev) => ({
      ...prev,
      [modelId]: configuration,
    }));

    // Navigate to next model or back to selection if all configured
    const currentIndex = selectedModels.indexOf(modelId);
    if (currentIndex < selectedModels.length - 1) {
      setActiveModelId(selectedModels[currentIndex + 1]);
    } else {
      setActiveModelId(null);
      setActiveTab("training");
    }
  };

  /**
   * Start the configuration workflow
   */
  const handleStartConfiguration = () => {
    if (selectedModels.length > 0) {
      setActiveModelId(selectedModels[0]);
      setActiveTab("configuration");
    }
  };

  /**
   * Handle auto-tune toggle
   * @param enabled Whether auto-tune is enabled
   */
  const handleAutoTuneToggle = (enabled: boolean) => {
    setAutoTuneEnabled(enabled);
    setTrainingConfig((prev) => ({
      ...prev,
      autoTune: enabled,
    }));
  };

  /**
   * Start the training process
   */
  const handleStartTraining = async () => {
    setIsTraining(true);
    setTrainingStatus("running");
    setTrainingProgress(0);
    setTrainingStep("Preparing data");

    setCpuUsage(42);
    setMemoryUsage(1.5);
    setEstimatedTimeRemaining(300);

    // Simulate API call to start training
    try {
      // In a real app, this would be an API call
      // const response = await trainModel(modelId, parameters, datasetId, trainingConfig);

      // Simulate training progress
      const interval = setInterval(() => {
        setTrainingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTrainingStatus("completed");
            return 100;
          }

          // Update simulated resources
          setCpuUsage(Math.floor(40 + Math.random() * 40));
          setMemoryUsage(1.5 + Math.random());
          setEstimatedTimeRemaining(Math.max(0, 300 - (prev * 3)));

          // Update training step based on progress
          if (prev === 0) setTrainingStep("Preparing data");
          else if (prev === 20) setTrainingStep("Initializing model");
          else if (prev === 40) setTrainingStep("Training epoch 1/10");
          else if (prev === 60) setTrainingStep("Training epoch 5/10");
          else if (prev === 80) setTrainingStep("Training epoch 9/10");
          else if (prev === 95) setTrainingStep("Finalizing model");

          return prev + 5;
        });
      }, 500);

      // Simulate results
      setTimeout(() => {
        setTrainingResults({
          bestModel: "N-BEATS",
          metrics: {
            mape: 3.95,
            rmse: 11.42,
            mae: 9.12,
          },
          runtime: 425, // seconds
        });
      }, 10000);
    } catch (error) {
      console.error("Training error:", error);
      setTrainingStatus("failed");
    }
  };

  /**
   * Navigate to results tab
   */
  const handleViewResults = () => {
    setActiveTab("results");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Model Training</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={isTraining}
            onClick={() => setActiveTab("configuration")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Training Settings
          </Button>
          {activeTab !== "results" && (
            <Button
              onClick={activeTab === "selection"
                ? handleStartConfiguration
                : activeTab === "configuration"
                ? handleStartTraining
                : handleViewResults}
              disabled={(activeTab === "selection" &&
                selectedModels.length === 0) ||
                (activeTab === "training" && trainingStatus !== "completed") ||
                isTraining}
            >
              {isTraining
                ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Training...
                  </>
                )
                : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    {activeTab === "selection"
                      ? "Configure Models"
                      : activeTab === "configuration"
                      ? "Start Training"
                      : "View Results"}
                  </>
                )}
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="selection">Model Selection</TabsTrigger>
          <TabsTrigger
            value="configuration"
            disabled={selectedModels.length === 0}
          >
            Configuration
          </TabsTrigger>
          <TabsTrigger
            value="training"
            disabled={selectedModels.length === 0}
          >
            Training
          </TabsTrigger>
          <TabsTrigger
            value="results"
            disabled={trainingStatus !== "completed"}
          >
            Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="selection" className="mt-6">
          <ModelSelector
            selectedModels={selectedModels}
            onSelectionChange={handleSelectionChange}
          />
        </TabsContent>

        <TabsContent value="configuration" className="mt-6">
          {activeModelId
            ? (
              <ModelConfigurationForm
                modelId={activeModelId}
                onSave={handleConfigurationSave}
                initialValues={modelConfigurations[activeModelId] || {}}
                isLoading={isTraining}
                autoTuneEnabled={autoTuneEnabled}
                onAutoTuneToggle={handleAutoTuneToggle}
                onBack={() => {
                  setActiveModelId(null);
                  setActiveTab("selection");
                }}
              />
            )
            : (
              <div className="text-center">
                <p className="mb-4">Please select a model to configure.</p>
                <Button onClick={() => setActiveTab("selection")}>
                  Go to Model Selection
                </Button>
              </div>
            )}
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <TrainingProgress
            progress={trainingProgress}
            step={trainingStep}
            status={trainingStatus}
            cpuUsage={cpuUsage}
            memoryUsage={memoryUsage}
            estimatedTimeRemaining={estimatedTimeRemaining}
            bestModel={trainingResults.bestModel}
            bestMetric={trainingResults.metrics
              ? { name: "MAPE", value: trainingResults.metrics.mape }
              : undefined}
            totalTrainingTime={trainingResults.runtime}
            onViewResults={handleViewResults}
          />
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          {/* ModelResults component would go here */}
          <div className="rounded-md border p-6">
            <h3 className="mb-4 text-lg font-medium">Training Results</h3>
            <p className="text-muted-foreground">
              Results component would display metrics, charts, and model
              comparison.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelTraining;
