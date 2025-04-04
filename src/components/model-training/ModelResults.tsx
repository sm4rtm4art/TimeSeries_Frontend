import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModelMetrics } from "@/types/models";
import { BarChart3, LineChart, PieChart } from "lucide-react";

/**
 * Props for the ModelResults component
 * @interface ModelResultsProps
 */
interface ModelResultsProps {
  /** Array of model IDs that were trained */
  modelIds: string[];
  /** Model names by ID */
  modelNames: Record<string, string>;
  /** Metrics by model ID */
  metrics: Record<string, ModelMetrics>;
  /** Raw forecast data by model ID */
  _forecastData?: Record<
    string,
    { actual: number[]; predicted: number[]; timestamps: string[] }
  >;
  /** Training time by model ID (in seconds) */
  trainingTimes?: Record<string, number>;
}

/**
 * A component for displaying training results and comparisons
 *
 * @component ModelResults
 */
const ModelResults: React.FC<ModelResultsProps> = ({
  modelIds,
  modelNames,
  metrics,
  _forecastData,
  trainingTimes,
}) => {
  // For this implementation, we'll create a placeholder component
  // In a real application, this would include charts, tables, and detailed metrics

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="mr-2 h-4 w-4" />
            Metrics Overview
          </TabsTrigger>
          <TabsTrigger value="forecast">
            <LineChart className="mr-2 h-4 w-4" />
            Forecast Comparison
          </TabsTrigger>
          <TabsTrigger value="breakdown">
            <PieChart className="mr-2 h-4 w-4" />
            Detailed Breakdown
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modelIds.map((modelId) => (
                  <div key={modelId} className="rounded-md border p-4">
                    <div className="mb-2 font-medium">
                      {modelNames[modelId]}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          MAPE
                        </div>
                        <div className="text-lg font-semibold">
                          {metrics[modelId]?.mape?.toFixed(2)}%
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">
                          RMSE
                        </div>
                        <div className="text-lg font-semibold">
                          {metrics[modelId]?.rmse?.toFixed(2)}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-muted-foreground">MAE</div>
                        <div className="text-lg font-semibold">
                          {metrics[modelId]?.mae?.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {trainingTimes && trainingTimes[modelId] && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Training time:{" "}
                        {Math.floor(trainingTimes[modelId] / 60)}m{" "}
                        {Math.floor(trainingTimes[modelId] % 60)}s
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecast" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Forecast Visualization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed p-8">
                <p className="text-center text-muted-foreground">
                  Line chart visualization will be displayed here showing
                  forecast vs actual values.
                  <br />
                  <br />
                  In a complete implementation, this would include:
                  <br />
                  - Interactive line chart comparing predictions
                  <br />
                  - Confidence intervals
                  <br />
                  - Zoom and pan capabilities
                  <br />
                  - Data point inspection
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Metrics Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed p-8">
                <p className="text-center text-muted-foreground">
                  Detailed metrics breakdown will be displayed here.
                  <br />
                  <br />
                  In a complete implementation, this would include:
                  <br />
                  - Error distribution analysis
                  <br />
                  - Residual plots
                  <br />
                  - Seasonality decomposition
                  <br />
                  - Feature importance (for applicable models)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ModelResults;
