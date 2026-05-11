"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Upload } from "lucide-react";
import TimeSeriesChart from "@/components/charts/time-series-chart.tsx";
import DataQualityAnalysis from "@/components/data-quality-analysis.tsx";
import DataPreparation from "@/components/data-preparation.tsx";

export default function DataManagement() {
  const [_dataSource, _setDataSource] = useState("builtin");
  const [selectedDataset, setSelectedDataset] = useState("airline");

  const builtinDatasets = [
    { id: "airline", name: "Airline Passengers" },
    { id: "energy", name: "Energy Consumption" },
    { id: "retail", name: "Retail Sales" },
    { id: "stock", name: "Stock Prices" },
  ];

  // Sample data for preview with some outliers and missing values
  const sampleData = {
    dates: Array.from(
      { length: 100 },
      (_, i) => new Date(2020, 0, i + 1).toISOString().split("T")[0],
    ),
    values: Array.from({ length: 100 }, (_, i) => {
      // Add some outliers
      if (i === 25 || i === 75) {
        return Math.random() * 200 + 150;
      }
      // Add some missing values
      if (i === 40 || i === 41 || i === 60) {
        return Number.NaN;
      }
      return Math.random() * 100 + 50;
    }),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Data Management</h2>
      </div>

      <Tabs defaultValue="select" className="w-full">
        <TabsList>
          <TabsTrigger value="select">Select Dataset</TabsTrigger>
          <TabsTrigger value="upload">Upload Data</TabsTrigger>
          <TabsTrigger value="preview">Data Preview</TabsTrigger>
          <TabsTrigger value="quality">Data Quality</TabsTrigger>
          <TabsTrigger value="preparation">Data Preparation</TabsTrigger>
        </TabsList>

        <TabsContent value="select" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Built-in Datasets</CardTitle>
              <CardDescription>
                Select from our collection of time series datasets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedDataset}
                onValueChange={setSelectedDataset}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a dataset" />
                </SelectTrigger>
                <SelectContent>
                  {builtinDatasets.map((dataset) => (
                    <SelectItem key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-6">
                <h4 className="mb-2 font-medium">Dataset Information</h4>
                <div className="rounded-md bg-muted p-4">
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Time Range
                      </dt>
                      <dd>Jan 1950 - Dec 1960</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Frequency
                      </dt>
                      <dd>Monthly</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Data Points
                      </dt>
                      <dd>144</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">
                        Missing Values
                      </dt>
                      <dd>None</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload Your Data</CardTitle>
              <CardDescription>
                Upload a CSV file with your time series data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12">
                <div className="flex flex-col items-center justify-center space-y-2 text-center">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    Drag & drop your CSV file
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files (max 10MB)
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv"
                    id="file-upload"
                  />
                  <Button asChild>
                    <label htmlFor="file-upload">Select File</label>
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 font-medium">CSV Format Requirements</h4>
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  <li>First column must contain date/time values</li>
                  <li>Second column must contain the target variable</li>
                  <li>Additional columns will be treated as features</li>
                  <li>Header row is required</li>
                </ul>

                <div className="mt-4 rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                      Target Column
                    </Badge>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                      Put your prediction target in column 2
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">
                    Example: date,{" "}
                    <span className="rounded bg-blue-200 px-1 py-0.5 font-semibold dark:bg-blue-800">
                      sales_target
                    </span>, feature_1, feature_2
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
              <CardDescription>
                Visual preview of your selected dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <TimeSeriesChart
                  data={sampleData}
                  title="Time Series Preview"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <DataQualityAnalysis data={sampleData} />
        </TabsContent>

        <TabsContent value="preparation" className="space-y-4">
          <DataPreparation />
        </TabsContent>
      </Tabs>
    </div>
  );
}
