"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { useTheme } from "next-themes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { useIsMounted } from "@/hooks/use-client-only";

interface DataQualityProps {
  data: {
    dates: string[];
    values: number[];
  };
}

export default function DataQualityAnalysis({ data }: DataQualityProps) {
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const { theme } = useTheme();
  const [dataQuality, setDataQuality] = useState({
    total: 0,
    missing: 0,
    outliers: 0,
    duplicates: 0,
    quality_score: 0,
  });

  const isMounted = useIsMounted();

  // Handle resize
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    handleResize();
    globalThis.addEventListener("resize", handleResize);
    return () => globalThis.removeEventListener("resize", handleResize);
  }, [isMounted]);

  // Create a memoized function for data analysis
  const analyzeData = useCallback(() => {
    if (!data || !data.dates || !data.values || data.dates.length === 0) return;

    // Convert string dates to Date objects and handle missing values
    const parsedData = data.dates.map((date, i) => ({
      date: new Date(date),
      value: data.values[i],
      isNaN: isNaN(data.values[i]),
    }));

    // Find duplicates
    const dateStrings = parsedData.map((d) => d.date.toISOString());
    const uniqueDates = new Set(dateStrings);
    const duplicates = dateStrings.length - uniqueDates.size;

    // Count missing values
    const missing = parsedData.filter((d) =>
      d.isNaN || d.value === null || d.value === undefined
    ).length;

    // Detect outliers using IQR method
    const values = parsedData.filter((d) =>
      !d.isNaN
    ).map((d) => d.value);
    const q1 = d3.quantile(values, 0.25);
    const q3 = d3.quantile(values, 0.75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    // Mark outliers
    const dataWithOutliers = parsedData.map((d) => ({
      ...d,
      isOutlier: !d.isNaN && (d.value < lowerBound || d.value > upperBound),
    }));

    const outliers = dataWithOutliers.filter((d) => d.isOutlier).length;

    // Calculate quality score (0-100)
    const total = parsedData.length;
    const quality_score = Math.round(
      100 * (1 - (missing + outliers + duplicates) / (total * 2)),
    );

    return {
      total,
      missing,
      outliers,
      duplicates,
      quality_score: Math.max(0, Math.min(100, quality_score)),
      dataWithOutliers,
    };
  }, [data]);

  // Analyze data quality
  useEffect(() => {
    if (!isMounted) return;

    const result = analyzeData();
    if (result) {
      setDataQuality({
        total: result.total,
        missing: result.missing,
        outliers: result.outliers,
        duplicates: result.duplicates,
        quality_score: result.quality_score,
      });
    }
  }, [data, analyzeData, isMounted]);

  // Render visualization only on client
  useEffect(() => {
    if (!isMounted || !data || !svgRef.current || dimensions.width === 0) {
      return;
    }

    const result = analyzeData();
    if (!result) return;

    const dataWithOutliers = result.dataWithOutliers;

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove();

    // Set up margins and dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = dimensions.width - margin.left - margin.right;
    const height = dimensions.height - margin.top - margin.bottom;

    // Get colors based on theme
    const gridColor = theme === "dark" ? "#374151" : "#e5e7eb";
    const textColor = theme === "dark" ? "#e5e7eb" : "#374151";
    const lineColor = "#2563eb"; // blue-600
    const outlierColor = "#ef4444"; // red-500
    const missingColor = "#f59e0b"; // amber-500
    const backgroundColor = theme === "dark" ? "#1f2937" : "#ffffff";

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(dataWithOutliers, (d) => d.date))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(
          dataWithOutliers.filter((d) => !d.isNaN),
          (d) => d.value,
        ) * 0.9,
        d3.max(
          dataWithOutliers.filter((d) => !d.isNaN),
          (d) => d.value,
        ) * 1.1,
      ])
      .range([height, 0]);

    // Create axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.min(dataWithOutliers.length, width > 600 ? 10 : 5))
      .tickFormat(d3.timeFormat("%b %d"));

    const yAxis = d3.axisLeft(yScale).ticks(5);

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis.tickSize(-height).tickFormat(""))
      .selectAll("line")
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.5);

    svg
      .append("g")
      .attr("class", "grid")
      .call(yAxis.tickSize(-width).tickFormat(""))
      .selectAll("line")
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.5);

    // Add X axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)")
      .attr("font-size", "10px")
      .attr("fill", textColor);

    // Style X axis
    svg.selectAll(".x-axis path, .x-axis line").attr("stroke", textColor);

    // Add Y axis
    svg
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .attr("font-size", "10px")
      .attr("fill", textColor);

    // Style Y axis
    svg.selectAll(".y-axis path, .y-axis line").attr("stroke", textColor);

    // Add axis labels
    svg
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .attr("font-size", "12px")
      .attr("fill", textColor)
      .text("Date");

    svg
      .append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("font-size", "12px")
      .attr("fill", textColor)
      .text("Value");

    // Create line generator for valid data points
    const line = d3
      .line()
      .defined((d) => !d.isNaN)
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // Add the line path with animation
    const path = svg
      .append("path")
      .datum(dataWithOutliers.filter((d) => !d.isNaN && !d.isOutlier))
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)
      .attr("d", line);

    // Animate the line
    const pathLength = path.node().getTotalLength();
    path
      .attr("stroke-dasharray", pathLength)
      .attr("stroke-dashoffset", pathLength)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0);

    // Add regular data points
    svg
      .selectAll(".dot")
      .data(dataWithOutliers.filter((d) => !d.isNaN && !d.isOutlier))
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 3)
      .attr("fill", lineColor)
      .attr("opacity", 0)
      .transition()
      .delay((_d, i) => i * (1000 / dataWithOutliers.length))
      .duration(300)
      .attr("opacity", 1);

    // Add outlier points with pulsing animation
    const _outlierPoints = svg
      .selectAll(".outlier")
      .data(dataWithOutliers.filter((d) => d.isOutlier))
      .enter()
      .append("circle")
      .attr("class", "outlier")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 5)
      .attr("fill", outlierColor)
      .attr("stroke", backgroundColor)
      .attr("stroke-width", 1)
      .attr("opacity", 0)
      .transition()
      .delay((_d, i) => 1000 + i * 100)
      .duration(300)
      .attr("opacity", 1);

    // Add missing value markers
    svg
      .selectAll(".missing")
      .data(dataWithOutliers.filter((d) => d.isNaN))
      .enter()
      .append("rect")
      .attr("class", "missing")
      .attr("x", (d) => xScale(d.date) - 5)
      .attr("y", height / 2 - 5)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", missingColor)
      .attr("transform", (d) => `rotate(45, ${xScale(d.date)}, ${height / 2})`)
      .attr("opacity", 0)
      .transition()
      .delay((_d, i) => 1000 + i * 100)
      .duration(300)
      .attr("opacity", 1);

    // Create tooltip
    const tooltip = d3
      .select(tooltipRef.current)
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", backgroundColor)
      .style("border", `1px solid ${gridColor}`)
      .style("border-radius", "4px")
      .style("padding", "8px")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
      .style("font-size", "12px")
      .style("color", textColor)
      .style("pointer-events", "none")
      .style("z-index", "10");

    // Add hover interaction for all points
    svg
      .selectAll(".dot, .outlier, .missing")
      .on("mouseover", function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", d.isOutlier ? 8 : 6);

        let content = "";
        if (d.isNaN) {
          content = `
            <div>
              <strong>Date:</strong> ${d.date.toLocaleDateString()}
              <br />
              <strong>Value:</strong> Missing data
              <br />
              <span class="text-amber-500">This point has no value</span>
            </div>
          `;
        } else if (d.isOutlier) {
          content = `
            <div>
              <strong>Date:</strong> ${d.date.toLocaleDateString()}
              <br />
              <strong>Value:</strong> ${d.value.toFixed(2)}
              <br />
              <span class="text-red-500">Detected as an outlier</span>
            </div>
          `;
        } else {
          content = `
            <div>
              <strong>Date:</strong> ${d.date.toLocaleDateString()}
              <br />
              <strong>Value:</strong> ${d.value.toFixed(2)}
            </div>
          `;
        }

        tooltip
          .style("visibility", "visible")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`)
          .html(content);
      })
      .on("mouseout", function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("r", (d) => (d.isOutlier ? 5 : 3));

        tooltip.style("visibility", "hidden");
      });

    // Add a legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width - 120}, 10)`);

    // Regular data point
    legend.append("circle").attr("cx", 0).attr("cy", 0).attr("r", 3).attr(
      "fill",
      lineColor,
    );

    legend
      .append("text")
      .attr("x", 10)
      .attr("y", 3)
      .attr("font-size", "10px")
      .attr("fill", textColor)
      .text("Normal data");

    // Outlier
    legend.append("circle").attr("cx", 0).attr("cy", 20).attr("r", 5).attr(
      "fill",
      outlierColor,
    );

    legend.append("text").attr("x", 10).attr("y", 23).attr("font-size", "10px")
      .attr("fill", textColor).text("Outlier");

    // Missing value
    legend
      .append("rect")
      .attr("x", -5)
      .attr("y", 35)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", missingColor)
      .attr("transform", "rotate(45, 0, 40)");

    legend
      .append("text")
      .attr("x", 10)
      .attr("y", 43)
      .attr("font-size", "10px")
      .attr("fill", textColor)
      .text("Missing data");
  }, [data, dimensions, theme, isMounted, analyzeData]);

  // Determine quality score color
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

  // Determine quality score icon
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Data Quality Analysis</CardTitle>
            <CardDescription>
              Analyze your data for outliers and missing values
            </CardDescription>
          </div>
          <Badge className={getQualityColor(dataQuality.quality_score)}>
            {getQualityIcon(dataQuality.quality_score)}
            <span className="ml-1">Quality: {dataQuality.quality_score}%</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="visualization">
          <TabsList className="mb-4">
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="summary">Quality Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="visualization">
            <div ref={containerRef} className="w-full h-[350px]">
              <svg ref={svgRef} width="100%" height="100%"></svg>
              <div ref={tooltipRef}></div>
            </div>
          </TabsContent>

          <TabsContent value="summary">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Data Points</p>
                    <p className="text-2xl font-bold">{dataQuality.total}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
                    <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Outliers Detected</p>
                    <p className="text-2xl font-bold">{dataQuality.outliers}</p>
                    <p className="text-xs text-muted-foreground">
                      {((dataQuality.outliers / dataQuality.total) * 100)
                        .toFixed(1)}% of data
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                    <XCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Missing Values</p>
                    <p className="text-2xl font-bold">{dataQuality.missing}</p>
                    <p className="text-xs text-muted-foreground">
                      {((dataQuality.missing / dataQuality.total) * 100)
                        .toFixed(1)}% of data
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900">
                    <Info className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Duplicate Timestamps</p>
                    <p className="text-2xl font-bold">
                      {dataQuality.duplicates}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {((dataQuality.duplicates / dataQuality.total) * 100)
                        .toFixed(1)}% of data
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4 md:col-span-2">
                <h3 className="mb-2 font-medium">Recommendations</h3>
                <ul className="space-y-2 text-sm">
                  {dataQuality.outliers > 0 && (
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                      <span>
                        Consider investigating or removing{" "}
                        {dataQuality.outliers}{" "}
                        outliers that may affect model performance
                      </span>
                    </li>
                  )}
                  {dataQuality.missing > 0 && (
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                      <span>
                        Fill {dataQuality.missing}{" "}
                        missing values using interpolation or other imputation
                        methods
                      </span>
                    </li>
                  )}
                  {dataQuality.duplicates > 0 && (
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                      <span>
                        Remove or aggregate {dataQuality.duplicates}{" "}
                        duplicate timestamps to ensure data consistency
                      </span>
                    </li>
                  )}
                  {dataQuality.quality_score < 70 && (
                    <li className="flex items-start gap-2">
                      <XCircle className="mt-0.5 h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <span>
                        Overall data quality is low. Consider collecting more
                        reliable data or performing extensive preprocessing
                      </span>
                    </li>
                  )}
                  {dataQuality.quality_score >= 90 && (
                    <li className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                      <span>
                        Data quality is excellent! You can proceed with model
                        training
                      </span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
