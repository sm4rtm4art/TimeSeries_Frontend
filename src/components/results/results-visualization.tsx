"use client";

import { useState } from "react";
import { ModelMetrics as _ModelMetrics, TrainingResult } from "@/types/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ResultsVisualizationProps {
  result?: TrainingResult;
  isLoading?: boolean;
}

/**
 * Component for visualizing model training results
 * @param props Component props
 * @returns ResultsVisualization component
 */
export default function ResultsVisualization({
  result,
  isLoading = false,
}: ResultsVisualizationProps) {
  const [activeTab, setActiveTab] = useState("metrics");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Results...</CardTitle>
          <CardDescription>
            Please wait while we load the forecasting results
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="h-4 w-32 bg-muted rounded mb-4 mx-auto"></div>
            <div className="h-32 w-full bg-muted rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Results Available</CardTitle>
          <CardDescription>
            Train a model to see forecasting results
          </CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-muted-foreground">
            No forecasting data to display
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sample forecast data - in a real app, this would come from the result
  const forecastData = [
    { date: "2023-01", actual: 245, forecast: 240 },
    { date: "2023-02", actual: 288, forecast: 290 },
    { date: "2023-03", actual: 266, forecast: 268 },
    { date: "2023-04", actual: 296, forecast: 280 },
    { date: "2023-05", actual: 310, forecast: 295 },
    { date: "2023-06", actual: 265, forecast: 270 },
    { date: "2023-07", actual: null, forecast: 285 },
    { date: "2023-08", actual: null, forecast: 305 },
    { date: "2023-09", actual: null, forecast: 315 },
  ];

  // Transform metrics to chart data
  const metricsData = Object.entries(result.metrics).map(([key, value]) => ({
    name: key.toUpperCase(),
    value: Number(value.toFixed(2)),
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{result.experimentName}</CardTitle>
            <CardDescription>
              Model: {result.modelName} | Trained:{" "}
              {new Date(result.timestamp).toLocaleString()}
            </CardDescription>
          </div>
          <Badge variant="outline">{result.runtime}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="metrics"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metricsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="forecast" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={forecastData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="#8884d8"
                  name="Actual"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="#82ca9d"
                  name="Forecast"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="comparison" className="h-80">
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                Train multiple models to enable comparison
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
