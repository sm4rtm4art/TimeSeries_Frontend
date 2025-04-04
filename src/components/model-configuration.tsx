"use client";

import { useState } from "react";
import { ModelDefinition } from "@/types/models";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { SimpleLoadingSpinner } from "@/components/ui/loading-indicators";
import { ModelSelection } from "@/components/model-selection";
import ModelConfigForm from "@/components/model-config-form";
import TrainingForm from "@/components/model-training/training-form";
import { useModels } from "@/contexts/model-context";

/**
 * Main model configuration component that manages model selection,
 * configuration, and training
 */
export default function ModelConfiguration() {
  const [activeTab, setActiveTab] = useState("select");
  const { selectedModel, selectModelById } = useModels();
  const [isTraining, setIsTraining] = useState(false);

  const handleModelSelect = (model: ModelDefinition) => {
    selectModelById(model.id);
    setActiveTab("configure");
  };

  const handleStartTraining = () => {
    setActiveTab("train");
  };

  const handleTrainingComplete = (resultId: string) => {
    console.log("Training complete:", resultId);
    setIsTraining(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Model Configuration
        </h2>
        {selectedModel && !isTraining && (
          <Button
            onClick={handleStartTraining}
            disabled={!selectedModel || isTraining}
          >
            {isTraining
              ? (
                <>
                  <SimpleLoadingSpinner className="mr-2 h-4 w-4" />
                  Training...
                </>
              )
              : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Train Model
                </>
              )}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="select">Select Model</TabsTrigger>
          <TabsTrigger value="configure" disabled={!selectedModel}>
            Configure Parameters
          </TabsTrigger>
          <TabsTrigger value="train" disabled={!selectedModel}>
            Training
          </TabsTrigger>
        </TabsList>

        <TabsContent value="select" className="space-y-4">
          <ModelSelection onModelSelect={handleModelSelect} />
        </TabsContent>

        <TabsContent value="configure" className="space-y-4">
          {selectedModel && (
            <ModelConfigForm
              model={selectedModel}
              onSubmit={() => setActiveTab("train")}
            />
          )}
        </TabsContent>

        <TabsContent value="train" className="space-y-4">
          {selectedModel && (
            <TrainingForm
              model={selectedModel}
              onTrainingComplete={handleTrainingComplete}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
