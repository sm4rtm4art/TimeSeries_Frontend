"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useTheme } from "next-themes"

export default function TimeSeriesDecomposition() {
  const svgRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef(null)
  const { theme } = useTheme()

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Create/update chart when dimensions change
  useEffect(() => {
    if (dimensions.width === 0) return

    // Generate sample data for decomposition
    const n = 100
    const dates = Array.from({ length: n }, (_, i) => new Date(2020, 0, i + 1))

    // Original series with trend, seasonality, and noise
    const trend = Array.from({ length: n }, (_, i) => 0.1 * i + 40)
    const seasonality = Array.from({ length: n }, (_, i) => 15 * Math.sin((i / 7) * Math.PI))
    const noise = Array.from({ length: n }, () => Math.random() * 10 - 5)
    const original = trend.map((t, i) => t + seasonality[i] + noise[i])

    // Transformed series (e.g., differenced)
    const transformed = original.slice(1).map((val, i) => val - original[i])
    transformed.unshift(0) // Add a placeholder for the first value

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Set up margins and dimensions
    const margin = { top: 10, right: 30, bottom: 20, left: 50 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom
    const componentHeight = height / 2 - 10 // Height for each component

    // Get colors based on theme
    const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"
    const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
    const originalColor = "#2563eb" // blue-600
    const transformedColor = "#16a34a" // green-600

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Create scales
    const xScale = d3.scaleTime().domain(d3.extent(dates)).range([0, width])

    const yScaleOriginal = d3
      .scaleLinear()
      .domain([d3.min(original) * 0.9, d3.max(original) * 1.1])
      .range([componentHeight, 0])

    const yScaleTransformed = d3
      .scaleLinear()
      .domain([d3.min(transformed) * 1.5, d3.max(transformed) * 1.5])
      .range([componentHeight * 2 + 10, componentHeight + 20])

    // Create axes
    const xAxisOriginal = d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat("%b %d"))

    const xAxisTransformed = d3.axisBottom(xScale).ticks(5).tickFormat(d3.timeFormat("%b %d"))

    const yAxisOriginal = d3.axisLeft(yScaleOriginal).ticks(3)
    const yAxisTransformed = d3.axisLeft(yScaleTransformed).ticks(3)

    // Add grid lines for original
    svg
      .append("g")
      .attr("class", "grid")
      .call(yAxisOriginal.tickSize(-width).tickFormat(""))
      .selectAll("line")
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.5)

    // Add grid lines for transformed
    svg
      .append("g")
      .attr("class", "grid")
      .call(yAxisTransformed.tickSize(-width).tickFormat(""))
      .selectAll("line")
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.5)

    // Add X axis for original
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${componentHeight})`)
      .call(xAxisOriginal)
      .selectAll("text")
      .attr("font-size", "8px")
      .attr("fill", textColor)

    // Add X axis for transformed
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${componentHeight * 2 + 10})`)
      .call(xAxisTransformed)
      .selectAll("text")
      .attr("font-size", "8px")
      .attr("fill", textColor)

    // Style X axes
    svg.selectAll(".x-axis path, .x-axis line").attr("stroke", textColor)

    // Add Y axis for original
    svg
      .append("g")
      .attr("class", "y-axis")
      .call(yAxisOriginal)
      .selectAll("text")
      .attr("font-size", "8px")
      .attr("fill", textColor)

    // Add Y axis for transformed
    svg
      .append("g")
      .attr("class", "y-axis")
      .call(yAxisTransformed)
      .selectAll("text")
      .attr("font-size", "8px")
      .attr("fill", textColor)

    // Style Y axes
    svg.selectAll(".y-axis path, .y-axis line").attr("stroke", textColor)

    // Add labels
    svg
      .append("text")
      .attr("x", 10)
      .attr("y", 10)
      .attr("font-size", "10px")
      .attr("fill", textColor)
      .text("Original Series")

    svg
      .append("text")
      .attr("x", 10)
      .attr("y", componentHeight + 30)
      .attr("font-size", "10px")
      .attr("fill", textColor)
      .text("Transformed Series (Differenced)")

    // Create line generators
    const originalLine = d3
      .line()
      .x((d, i) => xScale(dates[i]))
      .y((d) => yScaleOriginal(d))
      .curve(d3.curveMonotoneX)

    const transformedLine = d3
      .line()
      .x((d, i) => xScale(dates[i]))
      .y((d) => yScaleTransformed(d))
      .curve(d3.curveMonotoneX)

    // Add the original line path with animation
    const originalPath = svg
      .append("path")
      .datum(original)
      .attr("fill", "none")
      .attr("stroke", originalColor)
      .attr("stroke-width", 1.5)
      .attr("d", originalLine)

    // Animate the original line
    const originalPathLength = originalPath.node().getTotalLength()
    originalPath
      .attr("stroke-dasharray", originalPathLength)
      .attr("stroke-dashoffset", originalPathLength)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0)

    // Add the transformed line path with animation
    const transformedPath = svg
      .append("path")
      .datum(transformed)
      .attr("fill", "none")
      .attr("stroke", transformedColor)
      .attr("stroke-width", 1.5)
      .attr("d", transformedLine)

    // Animate the transformed line
    const transformedPathLength = transformedPath.node().getTotalLength()
    transformedPath
      .attr("stroke-dasharray", transformedPathLength)
      .attr("stroke-dashoffset", transformedPathLength)
      .transition()
      .delay(1000)
      .duration(1000)
      .attr("stroke-dashoffset", 0)

    // Add zero line for transformed series
    svg
      .append("line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScaleTransformed(0))
      .attr("y2", yScaleTransformed(0))
      .attr("stroke", textColor)
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "3,3")
  }, [dimensions, theme])

  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="w-full h-full">
        <svg ref={svgRef} width="100%" height="100%"></svg>
      </div>
    </div>
  )
}

