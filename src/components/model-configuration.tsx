"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Info, Play } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { TrainingLoadingIndicator, SimpleLoadingSpinner } from "@/components/ui/loading-indicators"

export default function ModelConfiguration() {
  const [selectedModel, setSelectedModel] = useState("nbeats")
  const [isTraining, setIsTraining] = useState(false)

  const handleTrainModel = () => {
    setIsTraining(true)
    // Simulate API call
    setTimeout(() => {
      setIsTraining(false)
    }, 5000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Model Configuration</h2>
        <Button onClick={handleTrainModel} disabled={isTraining}>
          {isTraining ? (
            <>
              <SimpleLoadingSpinner className="mr-2 h-4 w-4" />
              Training...
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Train Model
            </>
          )}
        </Button>
      </div>

      {isTraining ? (
        <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
          <TrainingLoadingIndicator text={`Training ${getModelName(selectedModel)}...`} />
        </div>
      ) : (
        <Tabs defaultValue="select" className="w-full">
          <TabsList>
            <TabsTrigger value="select">Select Model</TabsTrigger>
            <TabsTrigger value="configure">Configure Parameters</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="select" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <ModelCard
                id="nbeats"
                name="N-BEATS"
                description="Neural Basis Expansion Analysis for Time Series. Deep neural architecture based on backward and forward residual links and a deep stack of fully-connected layers."
                tags={["Deep Learning", "Neural Network"]}
                selected={selectedModel === "nbeats"}
                onSelect={() => setSelectedModel("nbeats")}
              />

              <ModelCard
                id="prophet"
                name="Prophet"
                description="Additive model where non-linear trends are fit with yearly, weekly, and daily seasonality, plus holiday effects. Robust to missing data and shifts in the trend."
                tags={["Statistical", "Decomposition"]}
                selected={selectedModel === "prophet"}
                onSelect={() => setSelectedModel("prophet")}
              />

              <ModelCard
                id="tide"
                name="TiDE"
                description="Time-series Dense Encoder. A state-of-the-art deep learning model for multivariate time series forecasting with strong performance on complex datasets."
                tags={["Deep Learning", "Multivariate"]}
                selected={selectedModel === "tide"}
                onSelect={() => setSelectedModel("tide")}
              />

              <ModelCard
                id="tsmixer"
                name="TSMixer"
                description="Time Series Mixer model that uses MLP layers to mix information across both the temporal and feature dimensions for effective forecasting."
                tags={["Deep Learning", "MLP"]}
                selected={selectedModel === "tsmixer"}
                onSelect={() => setSelectedModel("tsmixer")}
              />
            </div>
          </TabsContent>

          <TabsContent value="configure" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Model Parameters</CardTitle>
                <CardDescription>Configure the parameters for {getModelName(selectedModel)}</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedModel === "nbeats" && <NBEATSParameters />}
                {selectedModel === "prophet" && <ProphetParameters />}
                {selectedModel === "tide" && <TiDEParameters />}
                {selectedModel === "tsmixer" && <TSMixerParameters />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Fine-tune training and inference settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Training Epochs</Label>
                      <Input type="number" min={1} max={1000} defaultValue={100} />
                    </div>

                    <div className="space-y-2">
                      <Label>Batch Size</Label>
                      <Select defaultValue="32">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="16">16</SelectItem>
                          <SelectItem value="32">32</SelectItem>
                          <SelectItem value="64">64</SelectItem>
                          <SelectItem value="128">128</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Learning Rate</Label>
                      <Input type="number" step="0.0001" min="0.0001" max="0.1" defaultValue="0.001" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Early Stopping</Label>
                        <p className="text-sm text-muted-foreground">
                          Stop training when validation loss stops improving
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Use GPU Acceleration</Label>
                        <p className="text-sm text-muted-foreground">Use GPU for faster training if available</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Save Checkpoints</Label>
                        <p className="text-sm text-muted-foreground">Save model checkpoints during training</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

function ModelCard({ id, name, description, tags, selected, onSelect }) {
  return (
    <Card
      className={`cursor-pointer transition-all ${selected ? "border-primary ring-2 ring-primary ring-opacity-50" : ""}`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{name}</CardTitle>
          {selected && <Badge className="bg-primary">Selected</Badge>}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Button variant="outline" className="mt-4 w-full">
          {selected ? "Configure" : "Select"}
        </Button>
      </CardContent>
    </Card>
  )
}

function NBEATSParameters() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Stack Types</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  N-BEATS uses stacks of blocks to model different components of the time series
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch id="trend" defaultChecked />
            <Label htmlFor="trend">Trend Stack</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="seasonality" defaultChecked />
            <Label htmlFor="seasonality">Seasonality Stack</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="generic" defaultChecked />
            <Label htmlFor="generic">Generic Stack</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Number of Blocks per Stack</Label>
        <Input type="number" min={1} max={10} defaultValue={3} />
      </div>

      <div className="space-y-2">
        <Label>Hidden Layer Units</Label>
        <Input type="number" min={16} max={1024} step={16} defaultValue={128} />
      </div>

      <div className="space-y-2">
        <Label>Lookback Window Size</Label>
        <Slider defaultValue={[24]} min={1} max={100} step={1} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>1</span>
          <span>24</span>
          <span>100</span>
        </div>
      </div>
    </div>
  )
}

function ProphetParameters() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch id="yearly" defaultChecked />
          <Label htmlFor="yearly">Yearly Seasonality</Label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch id="weekly" defaultChecked />
          <Label htmlFor="weekly">Weekly Seasonality</Label>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch id="daily" defaultChecked />
          <Label htmlFor="daily">Daily Seasonality</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Changepoint Prior Scale</Label>
        <Input type="number" min={0.001} max={0.5} step={0.001} defaultValue={0.05} />
        <p className="text-xs text-muted-foreground">Flexibility of the trend. Larger values allow more flexibility.</p>
      </div>

      <div className="space-y-2">
        <Label>Seasonality Prior Scale</Label>
        <Input type="number" min={0.01} max={10} step={0.01} defaultValue={10} />
        <p className="text-xs text-muted-foreground">
          Strength of the seasonality. Larger values allow stronger seasonal effects.
        </p>
      </div>
    </div>
  )
}

function TiDEParameters() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Encoder Layers</Label>
        <Input type="number" min={1} max={10} defaultValue={3} />
      </div>

      <div className="space-y-2">
        <Label>Hidden Dimension</Label>
        <Input type="number" min={16} max={512} step={16} defaultValue={128} />
      </div>

      <div className="space-y-2">
        <Label>Temporal Fusion Heads</Label>
        <Input type="number" min={1} max={8} defaultValue={4} />
      </div>

      <div className="space-y-2">
        <Label>Dropout Rate</Label>
        <Slider defaultValue={[0.1]} min={0} max={0.5} step={0.01} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>0.1</span>
          <span>0.5</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Switch id="residual" defaultChecked />
          <Label htmlFor="residual">Use Residual Connections</Label>
        </div>
      </div>
    </div>
  )
}

function TSMixerParameters() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Feature Projection Dimension</Label>
        <Input type="number" min={16} max={512} step={16} defaultValue={128} />
      </div>

      <div className="space-y-2">
        <Label>Temporal Projection Dimension</Label>
        <Input type="number" min={16} max={512} step={16} defaultValue={128} />
      </div>

      <div className="space-y-2">
        <Label>Number of Mixer Layers</Label>
        <Input type="number" min={1} max={10} defaultValue={4} />
      </div>

      <div className="space-y-2">
        <Label>Activation Function</Label>
        <Select defaultValue="gelu">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relu">ReLU</SelectItem>
            <SelectItem value="gelu">GELU</SelectItem>
            <SelectItem value="silu">SiLU</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Dropout Rate</Label>
        <Slider defaultValue={[0.2]} min={0} max={0.5} step={0.01} />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>0.2</span>
          <span>0.5</span>
        </div>
      </div>
    </div>
  )
}

function getModelName(modelId) {
  const models = {
    nbeats: "N-BEATS",
    prophet: "Prophet",
    tide: "TiDE",
    tsmixer: "TSMixer",
  }
  return models[modelId] || modelId
}

