"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MetricsTable from "@/components/metrics-table";
import BacktestChart from "@/components/charts/backtest-chart";
import FeatureImportanceChart from "@/components/charts/feature-importance-chart";
import ResidualAnalysisChart from "@/components/charts/residual-analysis-chart";

export default function ResultsAnalysis() {
  // Sample metrics data
  const metricsData = [
    { model: "N-BEATS", mape: 4.32, rmse: 12.45, mae: 9.87 },
    { model: "Prophet", mape: 5.67, rmse: 15.21, mae: 11.34 },
    { model: "TiDE", mape: 3.89, rmse: 11.76, mae: 8.92 },
    { model: "TSMixer", mape: 4.12, rmse: 12.03, mae: 9.45 },
  ];

  // Sample feature importance data
  const featureImportanceData = [
    { feature: "Previous Day", importance: 0.35 },
    { feature: "Day of Week", importance: 0.25 },
    { feature: "Month", importance: 0.18 },
    { feature: "Holiday", importance: 0.12 },
    { feature: "Temperature", importance: 0.1 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Results & Analysis
        </h2>
        <Select defaultValue="nbeats">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nbeats">N-BEATS</SelectItem>
            <SelectItem value="prophet">Prophet</SelectItem>
            <SelectItem value="tide">TiDE</SelectItem>
            <SelectItem value="tsmixer">TSMixer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard
          title="MAPE"
          value="3.89%"
          description="Mean Absolute Percentage Error"
          trend="down"
        />
        <MetricCard
          title="RMSE"
          value="11.76"
          description="Root Mean Square Error"
          trend="down"
        />
        <MetricCard
          title="MAE"
          value="8.92"
          description="Mean Absolute Error"
          trend="down"
        />
      </div>

      <Tabs defaultValue="backtest" className="w-full">
        <TabsList>
          <TabsTrigger value="backtest">Backtest Results</TabsTrigger>
          <TabsTrigger value="metrics">Metrics Comparison</TabsTrigger>
          <TabsTrigger value="features">Feature Importance</TabsTrigger>
          <TabsTrigger value="residuals">Residual Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="backtest" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backtest Results</CardTitle>
              <CardDescription>
                Comparison of predicted vs actual values
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <BacktestChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Model Metrics Comparison</CardTitle>
              <CardDescription>
                Performance metrics across all models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MetricsTable data={metricsData} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Importance</CardTitle>
              <CardDescription>
                Relative importance of features in the model
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <FeatureImportanceChart data={featureImportanceData} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="residuals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Residual Analysis</CardTitle>
              <CardDescription>Analysis of forecast errors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResidualAnalysisChart />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ title, value, description, trend }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{value}</div>
          <Badge variant={trend === "down" ? "success" : "destructive"}>
            {trend === "down" ? "↓ Better" : "↑ Worse"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
