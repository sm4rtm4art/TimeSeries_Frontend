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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  Database,
  FileSpreadsheet,
  Info,
  LineChart,
  Loader2,
  Scissors,
  Sparkles,
  Wand2,
  XCircle,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import TimeSeriesChart from "@/components/charts/time-series-chart";
import DataQualityAnalysis from "@/components/data-quality-analysis";
import TimeSeriesDecomposition from "@/components/time-series-decomposition";

export default function DataPreparation() {
  const [activeTab, setActiveTab] = useState("quality");
  const [selectedTransformation, setSelectedTransformation] = useState(
    "differencing",
  );
  const [selectedImputation, setSelectedImputation] = useState("linear");
  const [outlierThreshold, setOutlierThreshold] = useState(2.5);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataQualityScore, setDataQualityScore] = useState(78);
  const [completenessScore, setCompletenessScore] = useState(85);
  const [consistencyScore, setConsistencyScore] = useState(92);
  const [validityScore, setValidityScore] = useState(72);
  const [timelinessScore, setTimelinessScore] = useState(95);

  // Sample data with issues for visualization
  const originalData = {
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
      return Math.sin(i / 10) * 20 + 50 + Math.random() * 5;
    }),
  };

  // Processed data (simulating cleaned data)
  const processedData = {
    dates: originalData.dates,
    values: originalData.values.map((value, i) => {
      // Fix outliers
      if (i === 25 || i === 75) {
        return Math.sin(i / 10) * 20 + 50 + Math.random() * 10;
      }
      // Fix missing values
      if (i === 40 || i === 41 || i === 60) {
        return Math.sin(i / 10) * 20 + 50 + Math.random() * 5;
      }
      return value;
    }),
  };

  const handleProcessData = () => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false);
      // Simulate improved data quality score
      setDataQualityScore(94);
      setCompletenessScore(100);
      setValidityScore(92);
    }, 2000);
  };

  const getQualityColor = (score) => {
    if (score >= 90) {
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    }
    if (score >= 70) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    }
    if (score >= 50) {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
    }
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
  };

  const getQualityIcon = (score) => {
    if (score >= 90) {
      return (
        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
      );
    }
    if (score >= 70) {
      return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
    }
    if (score >= 50) {
      return (
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
      );
    }
    return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Data Preparation</h2>
        <Button onClick={handleProcessData} disabled={isProcessing}>
          {isProcessing
            ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            )
            : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Process Data
              </>
            )}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <QualityScoreCard
          title="Overall Quality"
          score={dataQualityScore}
          icon={getQualityIcon(dataQualityScore)}
          colorClass={getQualityColor(dataQualityScore)}
        />
        <QualityScoreCard
          title="Completeness"
          score={completenessScore}
          icon={getQualityIcon(completenessScore)}
          colorClass={getQualityColor(completenessScore)}
        />
        <QualityScoreCard
          title="Consistency"
          score={consistencyScore}
          icon={getQualityIcon(consistencyScore)}
          colorClass={getQualityColor(consistencyScore)}
        />
        <QualityScoreCard
          title="Validity"
          score={validityScore}
          icon={getQualityIcon(validityScore)}
          colorClass={getQualityColor(validityScore)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quality">
            <Info className="mr-2 h-4 w-4" />
            Quality Assessment
          </TabsTrigger>
          <TabsTrigger value="cleaning">
            <Scissors className="mr-2 h-4 w-4" />
            Data Cleaning
          </TabsTrigger>
          <TabsTrigger value="transformation">
            <Sparkles className="mr-2 h-4 w-4" />
            Transformations
          </TabsTrigger>
          <TabsTrigger value="features">
            <Calendar className="mr-2 h-4 w-4" />
            Feature Engineering
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quality" className="space-y-4 pt-4">
          <DataQualityAnalysis data={originalData} />
        </TabsContent>

        <TabsContent value="cleaning" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Cleaning</CardTitle>
              <CardDescription>
                Clean your time series data by handling missing values and
                outliers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Missing Value Imputation
                    </h3>
                    <Select
                      value={selectedImputation}
                      onValueChange={setSelectedImputation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select imputation method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">
                          Linear Interpolation
                        </SelectItem>
                        <SelectItem value="ffill">Forward Fill</SelectItem>
                        <SelectItem value="bfill">Backward Fill</SelectItem>
                        <SelectItem value="mean">Mean Value</SelectItem>
                        <SelectItem value="median">Median Value</SelectItem>
                        <SelectItem value="seasonal">
                          Seasonal Interpolation
                        </SelectItem>
                        <SelectItem value="knn">KNN Imputation</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">Method Description</h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedImputation === "linear" &&
                          "Fills missing values using linear interpolation between existing values."}
                        {selectedImputation === "ffill" &&
                          "Fills missing values with the last known value (carry forward)."}
                        {selectedImputation === "bfill" &&
                          "Fills missing values with the next known value (carry backward)."}
                        {selectedImputation === "mean" &&
                          "Fills missing values with the mean of the entire series."}
                        {selectedImputation === "median" &&
                          "Fills missing values with the median of the entire series."}
                        {selectedImputation === "seasonal" &&
                          "Fills missing values using seasonal patterns from similar periods."}
                        {selectedImputation === "knn" &&
                          "Fills missing values using K-Nearest Neighbors algorithm."}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Outlier Treatment</h3>
                    <div className="space-y-2">
                      <Label>
                        Detection Threshold (Z-score): {outlierThreshold}
                      </Label>
                      <Slider
                        value={[outlierThreshold]}
                        min={1}
                        max={5}
                        step={0.1}
                        onValueChange={(value) => setOutlierThreshold(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Aggressive (1.0)</span>
                        <span>Balanced (3.0)</span>
                        <span>Conservative (5.0)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Treatment Method</Label>
                      <Select defaultValue="cap">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cap">Cap at Threshold</SelectItem>
                          <SelectItem value="remove">
                            Remove Outliers
                          </SelectItem>
                          <SelectItem value="mean">
                            Replace with Mean
                          </SelectItem>
                          <SelectItem value="median">
                            Replace with Median
                          </SelectItem>
                          <SelectItem value="interpolate">
                            Interpolate
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Time Series Specific
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="frequency-conversion">
                          Frequency Conversion
                        </Label>
                        <Switch id="frequency-conversion" />
                      </div>
                      <Select disabled defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="handle-duplicates">
                          Handle Duplicate Timestamps
                        </Label>
                        <Switch id="handle-duplicates" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Preview</h3>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                      Original
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    >
                      Cleaned
                    </Badge>
                  </div>
                  <div className="h-[400px] w-full rounded-md border">
                    <div className="h-1/2 border-b">
                      <TimeSeriesChart
                        data={originalData}
                        title="Original Data"
                      />
                    </div>
                    <div className="h-1/2">
                      <TimeSeriesChart
                        data={processedData}
                        title="Cleaned Data"
                      />
                    </div>
                  </div>

                  <div className="rounded-md bg-muted p-4">
                    <h4 className="mb-2 font-medium">Cleaning Summary</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>
                          3 missing values imputed using {selectedImputation}
                          {" "}
                          method
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>
                          2 outliers detected and treated (Z-score &gt;{" "}
                          {outlierThreshold})
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>No duplicate timestamps found</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transformation" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Series Transformations</CardTitle>
              <CardDescription>
                Apply transformations to make your time series more suitable for
                forecasting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Stationarity Transformations
                    </h3>
                    <Select
                      value={selectedTransformation}
                      onValueChange={setSelectedTransformation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transformation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="differencing">
                          Differencing
                        </SelectItem>
                        <SelectItem value="log">Log Transformation</SelectItem>
                        <SelectItem value="boxcox">
                          Box-Cox Transformation
                        </SelectItem>
                        <SelectItem value="ma">Moving Average</SelectItem>
                        <SelectItem value="detrend">Detrending</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="rounded-md bg-muted p-4">
                      <h4 className="mb-2 font-medium">
                        Transformation Description
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {selectedTransformation === "differencing" &&
                          "Computes the difference between consecutive observations to remove trend and make the series stationary."}
                        {selectedTransformation === "log" &&
                          "Applies logarithmic transformation to stabilize variance and handle exponential trends."}
                        {selectedTransformation === "boxcox" &&
                          "Applies Box-Cox power transformation to normalize data and stabilize variance."}
                        {selectedTransformation === "ma" &&
                          "Smooths the series using moving average to reduce noise and highlight trends."}
                        {selectedTransformation === "detrend" &&
                          "Removes the trend component from the time series."}
                      </p>
                    </div>

                    {selectedTransformation === "differencing" && (
                      <div className="space-y-2">
                        <Label>Differencing Order</Label>
                        <Select defaultValue="1">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">First Order</SelectItem>
                            <SelectItem value="2">Second Order</SelectItem>
                            <SelectItem value="seasonal">Seasonal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {selectedTransformation === "ma" && (
                      <div className="space-y-2">
                        <Label>Window Size: 7</Label>
                        <Slider defaultValue={[7]} min={2} max={30} step={1} />
                      </div>
                    )}

                    {selectedTransformation === "boxcox" && (
                      <div className="space-y-2">
                        <Label>Lambda: 0.5</Label>
                        <Slider
                          defaultValue={[0.5]}
                          min={-2}
                          max={2}
                          step={0.1}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>-2.0</span>
                          <span>0.0 (Log)</span>
                          <span>1.0 (No change)</span>
                          <span>2.0</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                      Normalization & Scaling
                    </h3>
                    <Select defaultValue="standard">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="minmax">Min-Max Scaling</SelectItem>
                        <SelectItem value="standard">
                          Standard Scaling
                        </SelectItem>
                        <SelectItem value="robust">Robust Scaling</SelectItem>
                        <SelectItem value="none">No Scaling</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex items-center space-x-2">
                      <Switch id="auto-scale" defaultChecked />
                      <Label htmlFor="auto-scale">
                        Auto-scale before forecasting
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Transformation Preview
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                      Original
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    >
                      Transformed
                    </Badge>
                  </div>
                  <div className="h-[300px] w-full">
                    <TimeSeriesDecomposition />
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Stationarity Test Results</h4>
                    <div className="rounded-md bg-muted p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Augmented Dickey-Fuller Test
                        </span>
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                        >
                          Stationary
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            ADF Statistic:
                          </span>
                          <span>-3.89</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            p-value:
                          </span>
                          <span>0.002</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Critical Value (1%):
                          </span>
                          <span>-3.45</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Reset</Button>
                    <Button>Apply Transformation</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Feature Engineering</CardTitle>
              <CardDescription>
                Create and manage features to improve forecasting performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="calendar">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span>Calendar Features</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pt-2">
                          <div className="flex items-center space-x-2">
                            <Switch id="day-of-week" defaultChecked />
                            <Label htmlFor="day-of-week">Day of Week</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="month" defaultChecked />
                            <Label htmlFor="month">Month</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="quarter" defaultChecked />
                            <Label htmlFor="quarter">Quarter</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="year" defaultChecked />
                            <Label htmlFor="year">Year</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="is-weekend" defaultChecked />
                            <Label htmlFor="is-weekend">Is Weekend</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="is-holiday" defaultChecked />
                            <Label htmlFor="is-holiday">Is Holiday</Label>
                            <Select defaultValue="us">
                              <SelectTrigger className="h-8 w-[100px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="us">US</SelectItem>
                                <SelectItem value="uk">UK</SelectItem>
                                <SelectItem value="eu">EU</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="lags">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-purple-600" />
                          <span>Lag Features</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label>Auto-generate lag features</Label>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                Add Lag 1
                              </Button>
                              <Button variant="outline" size="sm">
                                Add Lag 7
                              </Button>
                              <Button variant="outline" size="sm">
                                Add Lag 30
                              </Button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Custom lag periods</Label>
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                placeholder="Lag period"
                                className="w-32"
                              />
                              <Button variant="outline" size="sm">
                                Add
                              </Button>
                            </div>
                          </div>

                          <div className="rounded-md bg-muted p-3">
                            <h4 className="mb-1 text-sm font-medium">
                              Selected Lags
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                Lag 1
                                <XCircle className="h-3 w-3 cursor-pointer" />
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                Lag 7
                                <XCircle className="h-3 w-3 cursor-pointer" />
                              </Badge>
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                Lag 14
                                <XCircle className="h-3 w-3 cursor-pointer" />
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="windows">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <LineChart className="h-5 w-5 text-green-600" />
                          <span>Window Features</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label>Window Size</Label>
                            <Select defaultValue="7">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="3">3 periods</SelectItem>
                                <SelectItem value="7">7 periods</SelectItem>
                                <SelectItem value="14">14 periods</SelectItem>
                                <SelectItem value="30">30 periods</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Window Functions</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center space-x-2">
                                <Switch id="window-mean" defaultChecked />
                                <Label htmlFor="window-mean">Mean</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="window-std" defaultChecked />
                                <Label htmlFor="window-std">Std Dev</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="window-min" />
                                <Label htmlFor="window-min">Min</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="window-max" />
                                <Label htmlFor="window-max">Max</Label>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="expanding-window">
                                Use Expanding Window
                              </Label>
                              <Switch id="expanding-window" />
                            </div>

                            <div className="text-xs text-muted-foreground">
                              Expanding window uses all previous data points
                              rather than a fixed window size
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="custom">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Code className="h-5 w-5 text-amber-600" />
                          <span>Custom Features</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label>Feature Name</Label>
                            <Input placeholder="e.g., price_to_moving_avg_ratio" />
                          </div>

                          <div className="space-y-2">
                            <Label>Formula</Label>
                            <Input placeholder="e.g., value / value.shift(7)" />
                          </div>

                          <div className="rounded-md bg-muted p-3">
                            <h4 className="mb-1 text-sm font-medium">
                              Available Variables
                            </h4>
                            <div className="text-xs text-muted-foreground">
                              <code>value</code> - Current value
                              <br />
                              <code>value.shift(n)</code>{" "}
                              - Value from n periods ago
                              <br />
                              <code>value.rolling(n).mean()</code>{" "}
                              - Rolling mean of n periods
                              <br />
                              <code>np.log(value)</code> - Natural logarithm
                              <br />
                              <code>date.month</code>,{" "}
                              <code>date.day_of_week</code> - Date components
                            </div>
                          </div>

                          <Button variant="outline" size="sm">
                            Add Custom Feature
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="external">
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-red-600" />
                          <span>External Data</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div className="space-y-2">
                            <Label>Data Source</Label>
                            <Select defaultValue="weather">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="weather">
                                  Weather Data
                                </SelectItem>
                                <SelectItem value="economic">
                                  Economic Indicators
                                </SelectItem>
                                <SelectItem value="custom">
                                  Custom CSV Upload
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label>Location</Label>
                            <Input placeholder="e.g., New York, US" />
                          </div>

                          <div className="space-y-2">
                            <Label>Variables</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center space-x-2">
                                <Switch id="temperature" defaultChecked />
                                <Label htmlFor="temperature">Temperature</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="precipitation" defaultChecked />
                                <Label htmlFor="precipitation">
                                  Precipitation
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="humidity" />
                                <Label htmlFor="humidity">Humidity</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="wind-speed" />
                                <Label htmlFor="wind-speed">Wind Speed</Label>
                              </div>
                            </div>
                          </div>

                          <Button variant="outline" size="sm">
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Import External Data
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Feature Preview</h3>
                  <div className="rounded-md border p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h4 className="font-medium">Generated Features</h4>
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                      >
                        12 Features
                      </Badge>
                    </div>

                    <div className="max-h-[300px] overflow-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="pb-2 text-left font-medium">
                              Feature Name
                            </th>
                            <th className="pb-2 text-left font-medium">Type</th>
                            <th className="pb-2 text-right font-medium">
                              Importance
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2">day_of_week</td>
                            <td className="py-2">Calendar</td>
                            <td className="py-2 text-right">0.85</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">is_weekend</td>
                            <td className="py-2">Calendar</td>
                            <td className="py-2 text-right">0.72</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">month</td>
                            <td className="py-2">Calendar</td>
                            <td className="py-2 text-right">0.68</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">lag_1</td>
                            <td className="py-2">Lag</td>
                            <td className="py-2 text-right">0.95</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">lag_7</td>
                            <td className="py-2">Lag</td>
                            <td className="py-2 text-right">0.89</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">rolling_mean_7</td>
                            <td className="py-2">Window</td>
                            <td className="py-2 text-right">0.91</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">rolling_std_7</td>
                            <td className="py-2">Window</td>
                            <td className="py-2 text-right">0.65</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">temperature</td>
                            <td className="py-2">External</td>
                            <td className="py-2 text-right">0.58</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2">precipitation</td>
                            <td className="py-2">External</td>
                            <td className="py-2 text-right">0.42</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted p-4">
                    <h4 className="mb-2 font-medium">Feature Correlation</h4>
                    <div className="h-[200px] w-full bg-card p-2 text-center text-sm text-muted-foreground">
                      [Feature correlation heatmap visualization]
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button variant="outline">Reset</Button>
                    <Button>Generate Features</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QualityScoreCard({ title, score, icon, colorClass }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          <Badge className={colorClass}>
            {icon}
            <span className="ml-1">{score}%</span>
          </Badge>
        </div>
        <div className="mt-2">
          <Progress value={score} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
