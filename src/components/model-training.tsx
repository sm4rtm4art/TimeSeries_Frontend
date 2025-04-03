"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Cpu,
  Filter,
  Gauge,
  HelpCircle,
  Info,
  LineChart,
  Loader2,
  Play,
  Settings,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import BacktestChart from "@/components/charts/backtest-chart";

export default function ModelTraining() {
  const [activeTab, setActiveTab] = useState("selection");
  const [selectedModels, setSelectedModels] = useState(["nbeats", "prophet"]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [trainingStep, setTrainingStep] = useState("");
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [autoTuneEnabled, setAutoTuneEnabled] = useState(false);
  const [tuningBudget, setTuningBudget] = useState(30);
  const [tuningStrategy, setTuningStrategy] = useState("bayesian");
  const [selectedExperiment, setSelectedExperiment] = useState("exp-3");
  const [compareMode, setCompareMode] = useState(false);

  // Model metadata
  const modelCatalog = [
    {
      id: "nbeats",
      name: "N-BEATS",
      description:
        "Neural Basis Expansion Analysis for Time Series. Deep neural architecture based on backward and forward residual links.",
      tags: ["Deep Learning", "Neural Network"],
      characteristics: {
        accuracy: 4.5,
        speed: 3,
        interpretability: 2.5,
        dataReq: 4,
      },
      bestFor: ["Long sequences", "Multiple seasonality", "Complex patterns"],
      metrics: {
        mape: 4.32,
        rmse: 12.45,
        mae: 9.87,
      },
    },
    {
      id: "prophet",
      name: "Prophet",
      description:
        "Additive model with yearly, weekly, and daily seasonality, plus holiday effects. Robust to missing data and shifts in trend.",
      tags: ["Statistical", "Decomposition"],
      characteristics: {
        accuracy: 3.5,
        speed: 4.5,
        interpretability: 4,
        dataReq: 2.5,
      },
      bestFor: ["Seasonal data", "Missing values", "Trend changes"],
      metrics: {
        mape: 5.67,
        rmse: 15.21,
        mae: 11.34,
      },
    },
    {
      id: "tide",
      name: "TiDE",
      description:
        "Time-series Dense Encoder. A state-of-the-art deep learning model for multivariate time series forecasting.",
      tags: ["Deep Learning", "Multivariate"],
      characteristics: {
        accuracy: 4.8,
        speed: 3.2,
        interpretability: 2,
        dataReq: 4.5,
      },
      bestFor: [
        "Multivariate data",
        "Complex dependencies",
        "Long-term forecasts",
      ],
      metrics: {
        mape: 3.89,
        rmse: 11.76,
        mae: 8.92,
      },
    },
    {
      id: "tsmixer",
      name: "TSMixer",
      description:
        "Time Series Mixer model that uses MLP layers to mix information across both temporal and feature dimensions.",
      tags: ["Deep Learning", "MLP"],
      characteristics: {
        accuracy: 4.2,
        speed: 3.8,
        interpretability: 2.8,
        dataReq: 3.5,
      },
      bestFor: [
        "Feature-rich data",
        "Mixed frequencies",
        "Medium-term forecasts",
      ],
      metrics: {
        mape: 4.12,
        rmse: 12.03,
        mae: 9.45,
      },
    },
  ];

  // Experiment data
  const experiments = [
    {
      id: "exp-1",
      name: "Baseline",
      model: "N-BEATS",
      mape: 4.32,
      rmse: 12.45,
      mae: 9.87,
      runtime: "3m 42s",
      timestamp: "2023-06-15 14:32",
    },
    {
      id: "exp-2",
      name: "Tuned-1",
      model: "N-BEATS",
      mape: 4.18,
      rmse: 11.93,
      mae: 9.45,
      runtime: "5m 21s",
      timestamp: "2023-06-15 15:10",
    },
    {
      id: "exp-3",
      name: "Tuned-2",
      model: "N-BEATS",
      mape: 3.95,
      rmse: 11.42,
      mae: 9.12,
      runtime: "7m 05s",
      timestamp: "2023-06-15 16:25",
    },
    {
      id: "exp-4",
      name: "Baseline",
      model: "Prophet",
      mape: 5.67,
      rmse: 15.21,
      mae: 11.34,
      runtime: "1m 12s",
      timestamp: "2023-06-15 14:35",
    },
    {
      id: "exp-5",
      name: "Tuned",
      model: "Prophet",
      mape: 5.21,
      rmse: 14.76,
      mae: 10.89,
      runtime: "2m 03s",
      timestamp: "2023-06-15 15:15",
    },
  ];

  const toggleModelSelection = (modelId) => {
    if (selectedModels.includes(modelId)) {
      setSelectedModels(selectedModels.filter((id) => id !== modelId));
    } else {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const handleStartTraining = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    setTrainingStep("Preparing data");
    setTrainingComplete(false);

    // Simulate training progress
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTrainingComplete(true);
          return 100;
        }

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
  };

  const getCharacteristicColor = (value) => {
    if (value >= 4) return "text-green-500";
    if (value >= 3) return "text-blue-500";
    if (value >= 2) return "text-yellow-500";
    return "text-red-500";
  };

  const renderCharacteristicBars = (value) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 w-3 rounded-sm ${
              i <= Math.floor(value)
                ? getCharacteristicColor(value)
                : "bg-gray-200 dark:bg-gray-700"
            } ${
              i === Math.ceil(value) && i > Math.floor(value)
                ? "opacity-50"
                : "opacity-100"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Model Training</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled={isTraining}>
            <Settings className="mr-2 h-4 w-4" />
            Training Settings
          </Button>
          <Button
            onClick={handleStartTraining}
            disabled={isTraining || selectedModels.length === 0}
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
                  Start Training
                </>
              )}
          </Button>
        </div>
      </div>

      {isTraining && !trainingComplete && (
        <Card className="border-blue-200 dark:border-blue-900">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex w-full items-center gap-4">
                <div className="w-full">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{trainingStep}</span>
                    <span>{trainingProgress}%</span>
                  </div>
                  <Progress value={trainingProgress} className="h-2" />
                </div>
              </div>
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Cpu className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      CPU Usage
                    </div>
                    <div className="font-medium">78%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Gauge className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">Memory</div>
                    <div className="font-medium">2.4 GB</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Est. Time Remaining
                    </div>
                    <div className="font-medium">
                      {Math.max(0, 5 - Math.floor(trainingProgress / 20))}m{" "}
                      {30 - Math.floor(trainingProgress / 2)}s
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {trainingComplete && (
        <Card className="border-green-200 dark:border-green-900">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-6 w-6" />
                <h3 className="text-lg font-medium">Training Complete</h3>
              </div>
              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Best Model
                    </div>
                    <div className="font-medium">N-BEATS</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Gauge className="h-5 w-5 text-green-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Best MAPE
                    </div>
                    <div className="font-medium">3.95%</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-md border p-3">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Total Training Time
                    </div>
                    <div className="font-medium">7m 05s</div>
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-end">
                <Button onClick={() => setActiveTab("results")}>
                  View Results
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="selection">
            <Filter className="mr-2 h-4 w-4" />
            Model Selection
          </TabsTrigger>
          <TabsTrigger value="tuning">
            <Settings className="mr-2 h-4 w-4" />
            Hyperparameter Tuning
          </TabsTrigger>
          <TabsTrigger value="results">
            <LineChart className="mr-2 h-4 w-4" />
            Results & Experiments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="selection" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">Available Models</h3>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              >
                {selectedModels.length} Selected
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter models" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Models</SelectItem>
                  <SelectItem value="seasonal">Best for Seasonality</SelectItem>
                  <SelectItem value="limited">Best for Limited Data</SelectItem>
                  <SelectItem value="multivariate">
                    Best for Multivariate
                  </SelectItem>
                </SelectContent>
              </Select>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Wand2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Auto-suggest models based on your data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {modelCatalog.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isSelected={selectedModels.includes(model.id)}
                onToggle={() => toggleModelSelection(model.id)}
                renderCharacteristicBars={renderCharacteristicBars}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Model Ensemble</CardTitle>
              <CardDescription>
                Based on your data characteristics, we recommend the following
                model combination
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Recommended
                  </Badge>
                  <span className="font-medium">N-BEATS + TiDE Ensemble</span>
                  <Badge variant="outline">98% Confidence</Badge>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <h4 className="mb-2 font-medium">Recommendation Reasoning</h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                      <span>
                        Your data shows strong seasonal patterns that N-BEATS
                        handles well
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                      <span>
                        TiDE excels with the multivariate features you've
                        engineered
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-green-600" />
                      <span>
                        Ensemble approach reduces forecast error by ~12% in
                        similar datasets
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedModels(["nbeats", "tide"]);
                    }}
                  >
                    Use Recommended Ensemble
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tuning" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Hyperparameter Tuning</CardTitle>
                  <CardDescription>
                    Configure model parameters to optimize performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-tune">Auto-Tuning</Label>
                      <Switch
                        id="auto-tune"
                        checked={autoTuneEnabled}
                        onCheckedChange={setAutoTuneEnabled}
                      />
                    </div>

                    {autoTuneEnabled && (
                      <div className="space-y-4 rounded-md bg-muted p-4">
                        <div className="space-y-2">
                          <Label>Tuning Strategy</Label>
                          <Select
                            value={tuningStrategy}
                            onValueChange={setTuningStrategy}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bayesian">
                                Bayesian Optimization
                              </SelectItem>
                              <SelectItem value="grid">Grid Search</SelectItem>
                              <SelectItem value="random">
                                Random Search
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label>Time Budget: {tuningBudget} minutes</Label>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="max-w-xs">
                                    Maximum time allowed for hyperparameter
                                    optimization
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <Slider
                            value={[tuningBudget]}
                            min={5}
                            max={120}
                            step={5}
                            onValueChange={(value) => setTuningBudget(value[0])}
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>5m</span>
                            <span>1h</span>
                            <span>2h</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Resource Limits</Label>
                          <div className="flex items-center gap-2">
                            <div className="w-full">
                              <div className="mb-1 flex items-center justify-between text-xs">
                                <span>CPU Usage</span>
                                <span>80%</span>
                              </div>
                              <Progress value={80} className="h-1" />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-full">
                              <div className="mb-1 flex items-center justify-between text-xs">
                                <span>Memory Usage</span>
                                <span>60%</span>
                              </div>
                              <Progress value={60} className="h-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Selected Models</h3>

                    {selectedModels.includes("nbeats") && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="nbeats">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Brain className="h-5 w-5 text-blue-600" />
                              <span>N-BEATS Parameters</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>Number of Blocks</Label>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="max-w-xs">
                                          Number of blocks per stack in the
                                          N-BEATS architecture
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min={1}
                                    max={10}
                                    defaultValue={3}
                                    className="w-20"
                                  />
                                  <Slider
                                    defaultValue={[3]}
                                    min={1}
                                    max={10}
                                    step={1}
                                    className="flex-1"
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>Simple (1)</span>
                                  <span>Balanced (3)</span>
                                  <span>Complex (10)</span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Hidden Layer Units</Label>
                                <Input
                                  type="number"
                                  min={16}
                                  max={1024}
                                  step={16}
                                  defaultValue={128}
                                />
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Switch id="trend" defaultChecked />
                                  <Label htmlFor="trend">Trend Stack</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch id="seasonality" defaultChecked />
                                  <Label htmlFor="seasonality">
                                    Seasonality Stack
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch id="generic" defaultChecked />
                                  <Label htmlFor="generic">Generic Stack</Label>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}

                    {selectedModels.includes("prophet") && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="prophet">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-green-600" />
                              <span>Prophet Parameters</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <Label>Changepoint Prior Scale</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min={0.001}
                                    max={0.5}
                                    step={0.001}
                                    defaultValue={0.05}
                                    className="w-24"
                                  />
                                  <Slider
                                    defaultValue={[0.05]}
                                    min={0.001}
                                    max={0.5}
                                    step={0.001}
                                    className="flex-1"
                                  />
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Controls flexibility of the trend. Larger
                                  values allow more flexibility.
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label>Seasonality Prior Scale</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min={0.01}
                                    max={10}
                                    step={0.01}
                                    defaultValue={10}
                                    className="w-24"
                                  />
                                  <Slider
                                    defaultValue={[10]}
                                    min={0.01}
                                    max={10}
                                    step={0.01}
                                    className="flex-1"
                                  />
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Controls strength of seasonality. Larger
                                  values allow stronger seasonal effects.
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Switch id="yearly" defaultChecked />
                                  <Label htmlFor="yearly">
                                    Yearly Seasonality
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch id="weekly" defaultChecked />
                                  <Label htmlFor="weekly">
                                    Weekly Seasonality
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch id="daily" defaultChecked />
                                  <Label htmlFor="daily">
                                    Daily Seasonality
                                  </Label>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}

                    {selectedModels.includes("tide") && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="tide">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Zap className="h-5 w-5 text-orange-600" />
                              <span>TiDE Parameters</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <Label>Encoder Layers</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  max={10}
                                  defaultValue={3}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Hidden Dimension</Label>
                                <Input
                                  type="number"
                                  min={16}
                                  max={512}
                                  step={16}
                                  defaultValue={128}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Dropout Rate</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min={0}
                                    max={0.5}
                                    step={0.01}
                                    defaultValue={0.1}
                                    className="w-20"
                                  />
                                  <Slider
                                    defaultValue={[0.1]}
                                    min={0}
                                    max={0.5}
                                    step={0.01}
                                    className="flex-1"
                                  />
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Controls regularization strength. Higher
                                  values help prevent overfitting.
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label htmlFor="residual">
                                    Use Residual Connections
                                  </Label>
                                  <Switch id="residual" defaultChecked />
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}

                    {selectedModels.includes("tsmixer") && (
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="tsmixer">
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-purple-600" />
                              <span>TSMixer Parameters</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-4 pt-2">
                              <div className="space-y-2">
                                <Label>Feature Projection Dimension</Label>
                                <Input
                                  type="number"
                                  min={16}
                                  max={512}
                                  step={16}
                                  defaultValue={128}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Temporal Projection Dimension</Label>
                                <Input
                                  type="number"
                                  min={16}
                                  max={512}
                                  step={16}
                                  defaultValue={128}
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Number of Mixer Layers</Label>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    min={1}
                                    max={10}
                                    defaultValue={4}
                                    className="w-20"
                                  />
                                  <Slider
                                    defaultValue={[4]}
                                    min={1}
                                    max={10}
                                    step={1}
                                    className="flex-1"
                                  />
                                </div>
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
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Reset to Defaults
                  </Button>
                  <Button>Apply Changes</Button>
                </CardFooter>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Parameter Impact Visualization</CardTitle>
                  <CardDescription>
                    See how parameter changes affect model performance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="h-[400px] w-full rounded-md border p-4">
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <LineChart className="mx-auto mb-2 h-12 w-12" />
                        <p>Parameter impact visualization will appear here</p>
                        <p className="text-sm">
                          Adjust parameters to see their effect on model
                          performance
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">
                        Parameter Sensitivity
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span>Number of Blocks</span>
                            <span className="text-blue-600 dark:text-blue-400">
                              High Impact
                            </span>
                          </div>
                          <Progress value={85} className="h-1.5" />
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span>Hidden Layer Units</span>
                            <span className="text-blue-600 dark:text-blue-400">
                              Medium Impact
                            </span>
                          </div>
                          <Progress value={60} className="h-1.5" />
                        </div>
                        <div>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span>Stack Types</span>
                            <span className="text-blue-600 dark:text-blue-400">
                              High Impact
                            </span>
                          </div>
                          <Progress value={90} className="h-1.5" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">Recommended Ranges</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span>Number of Blocks:</span>
                          <span className="font-medium">2-4</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Hidden Layer Units:</span>
                          <span className="font-medium">64-256</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Stacks:</span>
                          <span className="font-medium">
                            Trend + Seasonality
                          </span>
                        </div>
                        <div className="mt-2 rounded-md bg-blue-50 p-2 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          <div className="flex items-start gap-1">
                            <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>
                              Based on your data characteristics, we recommend
                              using 3 blocks with 128 hidden units
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">Training Experiments</h3>
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
              >
                {experiments.length} Runs
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCompareMode(!compareMode)}
              >
                {compareMode ? "Single View" : "Compare View"}
              </Button>
              <Select
                defaultValue={selectedExperiment}
                onValueChange={setSelectedExperiment}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select experiment" />
                </SelectTrigger>
                <SelectContent>
                  {experiments.map((exp) => (
                    <SelectItem key={exp.id} value={exp.id}>
                      {exp.model} - {exp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!compareMode
            ? (
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>
                          Experiment Results:{" "}
                          {experiments.find((e) => e.id === selectedExperiment)
                            ?.model} -{" "}
                          {experiments.find((e) => e.id === selectedExperiment)
                            ?.name}
                        </CardTitle>
                        <CardDescription>
                          Run on{" "}
                          {experiments.find((e) => e.id === selectedExperiment)
                            ?.timestamp}
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        Best Run
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      <div className="rounded-md border p-4">
                        <div className="mb-1 text-sm text-muted-foreground">
                          MAPE
                        </div>
                        <div className="text-2xl font-bold">
                          {experiments.find((e) => e.id === selectedExperiment)
                            ?.mape}%
                        </div>
                        <div className="mt-1 text-xs text-green-600">
                          12% better than baseline
                        </div>
                      </div>
                      <div className="rounded-md border p-4">
                        <div className="mb-1 text-sm text-muted-foreground">
                          RMSE
                        </div>
                        <div className="text-2xl font-bold">
                          {experiments.find((e) => e.id === selectedExperiment)
                            ?.rmse}
                        </div>
                        <div className="mt-1 text-xs text-green-600">
                          8% better than baseline
                        </div>
                      </div>
                      <div className="rounded-md border p-4">
                        <div className="mb-1 text-sm text-muted-foreground">
                          MAE
                        </div>
                        <div className="text-2xl font-bold">
                          {experiments.find((e) => e.id === selectedExperiment)
                            ?.mae}
                        </div>
                        <div className="mt-1 text-xs text-green-600">
                          7% better than baseline
                        </div>
                      </div>
                    </div>

                    <div className="h-[400px] w-full">
                      <BacktestChart />
                    </div>

                    <div className="rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">Hyperparameters</h4>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm md:grid-cols-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Number of Blocks:
                          </span>
                          <span>3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Hidden Units:
                          </span>
                          <span>128</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Stacks:</span>
                          <span>Trend, Seasonal</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Learning Rate:
                          </span>
                          <span>0.001</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">
                            Batch Size:
                          </span>
                          <span>32</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Epochs:</span>
                          <span>100</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" className="mr-2">
                      Export Results
                    </Button>
                    <Button>Use This Model</Button>
                  </CardFooter>
                </Card>
              </div>
            )
            : (
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Model Comparison</CardTitle>
                    <CardDescription>
                      Compare performance across different models and
                      configurations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="pb-2 text-left font-medium">
                              Model
                            </th>
                            <th className="pb-2 text-left font-medium">
                              Configuration
                            </th>
                            <th className="pb-2 text-right font-medium">
                              MAPE
                            </th>
                            <th className="pb-2 text-right font-medium">
                              RMSE
                            </th>
                            <th className="pb-2 text-right font-medium">MAE</th>
                            <th className="pb-2 text-right font-medium">
                              Runtime
                            </th>
                            <th className="pb-2 text-right font-medium"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {experiments.map((exp) => (
                            <tr
                              key={exp.id}
                              className={`border-b ${
                                exp.id === "exp-3"
                                  ? "bg-green-50 dark:bg-green-900/20"
                                  : ""
                              }`}
                            >
                              <td className="py-2">{exp.model}</td>
                              <td className="py-2">{exp.name}</td>
                              <td className="py-2 text-right">{exp.mape}%</td>
                              <td className="py-2 text-right">{exp.rmse}</td>
                              <td className="py-2 text-right">{exp.mae}</td>
                              <td className="py-2 text-right">{exp.runtime}</td>
                              <td className="py-2 text-right">
                                {exp.id === "exp-3" && (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                    Best
                                  </Badge>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="mt-6 h-[400px] w-full">
                      <div className="flex h-full w-full items-center justify-center">
                        <div className="text-center text-muted-foreground">
                          <LineChart className="mx-auto mb-2 h-12 w-12" />
                          <p>Model comparison chart will appear here</p>
                          <p className="text-sm">
                            Showing forecast results from all selected models
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="rounded-md bg-muted p-4">
                        <h4 className="mb-2 font-medium">
                          Parameter Differences
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>Number of Blocks:</span>
                            <div>
                              <span className="mr-2 text-muted-foreground">
                                Baseline: 2
                              </span>
                              <span className="font-medium text-green-600">
                                Tuned-2: 3
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Hidden Layer Units:</span>
                            <div>
                              <span className="mr-2 text-muted-foreground">
                                Baseline: 64
                              </span>
                              <span className="font-medium text-green-600">
                                Tuned-2: 128
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Learning Rate:</span>
                            <div>
                              <span className="mr-2 text-muted-foreground">
                                Baseline: 0.01
                              </span>
                              <span className="font-medium text-green-600">
                                Tuned-2: 0.001
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-md bg-muted p-4">
                        <h4 className="mb-2 font-medium">
                          Improvement Analysis
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span>MAPE Improvement:</span>
                            <span className="font-medium text-green-600">
                              -8.6%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>RMSE Improvement:</span>
                            <span className="font-medium text-green-600">
                              -8.3%
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>MAE Improvement:</span>
                            <span className="font-medium text-green-600">
                              -7.6%
                            </span>
                          </div>
                          <div className="mt-2 rounded-md bg-blue-50 p-2 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            <div className="flex items-start gap-1">
                              <Info className="mt-0.5 h-4 w-4 flex-shrink-0" />
                              <span>
                                The most significant improvement came from
                                increasing the number of blocks and reducing the
                                learning rate
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" className="mr-2">
                      Export Comparison
                    </Button>
                    <Button>Use Best Model</Button>
                  </CardFooter>
                </Card>
              </div>
            )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ModelCard({ model, isSelected, onToggle, renderCharacteristicBars }) {
  return (
    <Card
      className={`cursor-pointer transition-all ${
        isSelected ? "border-primary ring-2 ring-primary ring-opacity-50" : ""
      }`}
      onClick={onToggle}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {model.name}
            {model.id === "tide" && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                Recommended
              </Badge>
            )}
          </CardTitle>
          {isSelected && <CheckCircle className="h-5 w-5 text-primary" />}
        </div>
        <div className="flex flex-wrap gap-2">
          {model.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="mb-4 text-sm text-muted-foreground">
          {model.description}
        </p>

        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Accuracy</span>
            {renderCharacteristicBars(model.characteristics.accuracy)}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Training Speed</span>
            {renderCharacteristicBars(model.characteristics.speed)}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Interpretability</span>
            {renderCharacteristicBars(model.characteristics.interpretability)}
          </div>
          <div className="flex items-center justify-between text-sm">
            <span>Data Requirements</span>
            {renderCharacteristicBars(model.characteristics.dataReq)}
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-medium">Best For:</h4>
          <ul className="space-y-1">
            {model.bestFor.map((item, i) => (
              <li key={i} className="flex items-center gap-1 text-xs">
                <CheckCircle className="h-3 w-3 text-green-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          {isSelected ? "Configure" : "Select"}
        </Button>
      </CardFooter>
    </Card>
  );
}
