"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, RefreshCw } from "lucide-react";
import { SimpleLoadingSpinner } from "@/components/ui/loading-indicators";

export default function SidebarControls() {
  const [testSize, setTestSize] = useState(20);
  const [selectedModel, setSelectedModel] = useState("all");
  const [modelSize, setModelSize] = useState("medium");
  const [isTraining, setIsTraining] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleTrainModel = () => {
    setIsTraining(true);
    // Simulate API call
    setTimeout(() => {
      setIsTraining(false);
    }, 3000);
  };

  const handleGenerateForecast = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Test Set Size: {testSize}%</Label>
              <Slider
                value={[testSize]}
                min={10}
                max={40}
                step={1}
                onValueChange={(value) => setTestSize(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label>Model Selection</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="nbeats">N-BEATS</SelectItem>
                  <SelectItem value="prophet">Prophet</SelectItem>
                  <SelectItem value="tide">TiDE</SelectItem>
                  <SelectItem value="tsmixer">TSMixer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Model Size</Label>
              <RadioGroup value={modelSize} onValueChange={setModelSize}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tiny" id="tiny" />
                  <Label htmlFor="tiny">Tiny</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="small" id="small" />
                  <Label htmlFor="small">Small</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="large" id="large" />
                  <Label htmlFor="large">Large</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <Button
          className="w-full"
          onClick={handleTrainModel}
          disabled={isTraining}
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
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGenerateForecast}
          disabled={isGenerating}
        >
          {isGenerating
            ? (
              <>
                <SimpleLoadingSpinner className="mr-2 h-4 w-4" />
                Generating...
              </>
            )
            : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Forecast
              </>
            )}
        </Button>
      </div>
    </div>
  );
}
