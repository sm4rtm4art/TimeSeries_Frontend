"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Play, RefreshCw } from "lucide-react";
import TimeSeriesChart from "@/components/charts/time-series-chart";
import ForecastChart from "@/components/charts/forecast-chart";
import ModelComparisonChart from "@/components/charts/model-comparison-chart";
import {
  ForecastLoadingIndicator,
  SimpleLoadingSpinner,
} from "@/components/ui/loading-indicators";

export default function ForecastingWorkspace() {
  const [forecastHorizon, setForecastHorizon] = useState(30);
  const [confidenceInterval, setConfidenceInterval] = useState(95);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeModels, setActiveModels] = useState([
    "N-BEATS",
    "Prophet",
    "TiDE",
    "TSMixer",
  ]);

  // Sample data for visualization
  const historicalData = {
    dates: Array.from(
      { length: 100 },
      (_, i) => new Date(2020, 0, i + 1).toISOString().split("T")[0],
    ),
    values: Array.from(
      { length: 100 },
      (_, i) => Math.sin(i / 10) * 20 + 50 + Math.random() * 5,
    ),
  };

  const forecastData = {
    dates: Array.from(
      { length: forecastHorizon },
      (_, i) => new Date(2020, 0, 101 + i).toISOString().split("T")[0],
    ),
    values: Array.from(
      { length: forecastHorizon },
      (_, i) => Math.sin((100 + i) / 10) * 20 + 50 + Math.random() * 10,
    ),
    upper: Array.from(
      { length: forecastHorizon },
      (_, i) => Math.sin((100 + i) / 10) * 20 + 50 + 15,
    ),
    lower: Array.from(
      { length: forecastHorizon },
      (_, i) => Math.sin((100 + i) / 10) * 20 + 50 - 15,
    ),
  };

  // Sample model comparison data
  const modelComparisonData = {
    dates: [...historicalData.dates, ...forecastData.dates],
    models: [
      {
        name: "N-BEATS",
        color: "#2563eb", // blue-600
        values: [
          ...historicalData.values,
          ...Array.from(
            { length: forecastHorizon },
            (_, i) => Math.sin((100 + i) / 10) * 20 + 50 + Math.random() * 8,
          ),
        ],
      },
      {
        name: "Prophet",
        color: "#16a34a", // green-600
        values: [
          ...historicalData.values,
          ...Array.from(
            { length: forecastHorizon },
            (_, i) => Math.sin((100 + i) / 10) * 20 + 52 + Math.random() * 8,
          ),
        ],
      },
      {
        name: "TiDE",
        color: "#ea580c", // orange-600
        values: [
          ...historicalData.values,
          ...Array.from(
            { length: forecastHorizon },
            (_, i) => Math.sin((100 + i) / 10) * 20 + 48 + Math.random() * 8,
          ),
        ],
      },
      {
        name: "TSMixer",
        color: "#9333ea", // purple-600
        values: [
          ...historicalData.values,
          ...Array.from(
            { length: forecastHorizon },
            (_, i) => Math.sin((100 + i) / 10) * 20 + 46 + Math.random() * 8,
          ),
        ],
      },
    ],
  };

  const handleGenerateForecast = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
    }, 3000);
  };

  const toggleModel = (modelName) => {
    setActiveModels((prev) =>
      prev.includes(modelName)
        ? prev.filter((m) => m !== modelName)
        : [...prev, modelName]
    );
  };

  const getModelBadgeClass = (modelName) => {
    const isActive = activeModels.includes(modelName);

    switch (modelName) {
      case "N-BEATS":
        return isActive
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-700"
          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 opacity-50";
      case "Prophet":
        return isActive
          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 border-green-300 dark:border-green-700"
          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 opacity-50";
      case "TiDE":
        return isActive
          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 border-orange-300 dark:border-orange-700"
          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 opacity-50";
      case "TSMixer":
        return isActive
          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 border-purple-300 dark:border-purple-700"
          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 opacity-50";
      default:
        return isActive
          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 opacity-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Forecasting Workspace
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Forecast Settings</CardTitle>
            <CardDescription>
              Configure your forecast parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Forecast Horizon: {forecastHorizon} periods</Label>
              <Slider
                value={[forecastHorizon]}
                min={1}
                max={100}
                step={1}
                onValueChange={(value) => setForecastHorizon(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label>Confidence Interval: {confidenceInterval}%</Label>
              <Slider
                value={[confidenceInterval]}
                min={50}
                max={99}
                step={1}
                onValueChange={(value) => setConfidenceInterval(value[0])}
              />
            </div>

            <div className="space-y-2">
              <Label>Forecast Type</Label>
              <Select defaultValue="point">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="point">Point Forecast</SelectItem>
                  <SelectItem value="probabilistic">
                    Probabilistic Forecast
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Forecast Frequency</Label>
              <Select defaultValue="auto">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
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
                    <Play className="mr-2 h-4 w-4" />
                    Generate Forecast
                  </>
                )}
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Forecast Visualization</CardTitle>
            <CardDescription>
              Historical data and forecast with{" "}
              {confidenceInterval}% confidence interval
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              {isGenerating
                ? (
                  <div className="flex h-full items-center justify-center">
                    <ForecastLoadingIndicator />
                  </div>
                )
                : (
                  <ForecastChart
                    historicalData={historicalData}
                    forecastData={forecastData}
                    confidenceInterval={confidenceInterval}
                  />
                )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="models" className="w-full">
        <TabsList>
          <TabsTrigger value="models">Model Comparison</TabsTrigger>
          <TabsTrigger value="scenarios">What-If Scenarios</TabsTrigger>
          <TabsTrigger value="export">Export Options</TabsTrigger>
        </TabsList>

        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Comparison</CardTitle>
              <CardDescription>
                Compare forecasts from different models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap gap-2">
                {modelComparisonData.models.map((model) => (
                  <Badge
                    key={model.name}
                    variant="outline"
                    className={`cursor-pointer ${
                      getModelBadgeClass(model.name)
                    }`}
                    onClick={() => toggleModel(model.name)}
                  >
                    <span
                      className="mr-1.5 inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: model.color }}
                    >
                    </span>
                    {model.name}
                  </Badge>
                ))}
              </div>
              <div className="h-[300px] w-full">
                <ModelComparisonChart
                  dates={modelComparisonData.dates}
                  models={modelComparisonData.models}
                  activeModels={activeModels}
                  onToggleModel={toggleModel}
                />
              </div>

              <div className="mt-6 rounded-md border p-4">
                <h4 className="mb-3 font-medium">Model Performance Metrics</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2 text-left font-medium">Model</th>
                        <th className="pb-2 text-right font-medium">MAPE</th>
                        <th className="pb-2 text-right font-medium">RMSE</th>
                        <th className="pb-2 text-right font-medium">MAE</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        className={`border-b ${
                          !activeModels.includes("N-BEATS") ? "opacity-50" : ""
                        }`}
                      >
                        <td className="py-2">
                          <div className="flex items-center">
                            <span className="mr-2 h-2 w-2 rounded-full bg-blue-600">
                            </span>
                            N-BEATS
                          </div>
                        </td>
                        <td className="py-2 text-right">4.32%</td>
                        <td className="py-2 text-right">12.45</td>
                        <td className="py-2 text-right">9.87</td>
                      </tr>
                      <tr
                        className={`border-b ${
                          !activeModels.includes("Prophet") ? "opacity-50" : ""
                        }`}
                      >
                        <td className="py-2">
                          <div className="flex items-center">
                            <span className="mr-2 h-2 w-2 rounded-full bg-green-600">
                            </span>
                            Prophet
                          </div>
                        </td>
                        <td className="py-2 text-right">5.67%</td>
                        <td className="py-2 text-right">15.21</td>
                        <td className="py-2 text-right">11.34</td>
                      </tr>
                      <tr
                        className={`border-b ${
                          !activeModels.includes("TiDE") ? "opacity-50" : ""
                        }`}
                      >
                        <td className="py-2">
                          <div className="flex items-center">
                            <span className="mr-2 h-2 w-2 rounded-full bg-orange-600">
                            </span>
                            TiDE
                          </div>
                        </td>
                        <td className="py-2 text-right">3.89%</td>
                        <td className="py-2 text-right">11.76</td>
                        <td className="py-2 text-right">8.92</td>
                      </tr>
                      <tr
                        className={`${
                          !activeModels.includes("TSMixer") ? "opacity-50" : ""
                        }`}
                      >
                        <td className="py-2">
                          <div className="flex items-center">
                            <span className="mr-2 h-2 w-2 rounded-full bg-purple-600">
                            </span>
                            TSMixer
                          </div>
                        </td>
                        <td className="py-2 text-right">4.12%</td>
                        <td className="py-2 text-right">12.03</td>
                        <td className="py-2 text-right">9.45</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>What-If Scenarios</CardTitle>
              <CardDescription>
                Explore different forecast scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Scenario Name</Label>
                    <Input placeholder="Base Scenario" />
                  </div>

                  <div className="space-y-2">
                    <Label>Growth Factor</Label>
                    <Slider defaultValue={[1]} min={0.5} max={2} step={0.1} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0.5x</span>
                      <span>1.0x</span>
                      <span>2.0x</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Seasonality Strength</Label>
                    <Slider defaultValue={[1]} min={0} max={2} step={0.1} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>None</span>
                      <span>Normal</span>
                      <span>Strong</span>
                    </div>
                  </div>

                  <Button variant="outline">Add Scenario</Button>
                </div>

                <div className="h-[250px] w-full">
                  <TimeSeriesChart
                    data={{
                      dates: historicalData.dates.concat(forecastData.dates),
                      values: historicalData.values.concat(forecastData.values),
                    }}
                    title="Scenario Comparison"
                    showLegend
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>Export your forecast results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-24 flex-col">
                  <svg
                    className="h-6 w-6 mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  CSV
                </Button>

                <Button variant="outline" className="h-24 flex-col">
                  <svg
                    className="h-6 w-6 mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                  Excel
                </Button>

                <Button variant="outline" className="h-24 flex-col">
                  <svg
                    className="h-6 w-6 mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  PNG
                </Button>

                <Button variant="outline" className="h-24 flex-col">
                  <svg
                    className="h-6 w-6 mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  PDF
                </Button>

                <Button variant="outline" className="h-24 flex-col">
                  <svg
                    className="h-6 w-6 mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                  JSON
                </Button>

                <Button variant="outline" className="h-24 flex-col">
                  <svg
                    className="h-6 w-6 mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
