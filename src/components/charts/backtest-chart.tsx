"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useTheme } from "next-themes"

export default function BacktestChart() {
  const svgRef = useRef(null)
  const tooltipRef = useRef(null)
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

  // Create/update chart when dimensions or theme change
  useEffect(() => {
    if (dimensions.width === 0) return

    // Generate sample data for backtest visualization
    const dates = Array.from({ length: 100 }, (_, i) => new Date(2020, 0, i + 1))

    // Actual values (historical data)
    const actualValues = Array.from({ length: 100 }, (_, i) => Math.sin(i / 10) * 20 + 50 + Math.random() * 5)

    // Predicted values (slightly off from actual to show prediction errors)
    const predictedValues = actualValues.map((val) => val + (Math.random() * 10 - 5))

    // Create data points for plotting
    const actualPoints = dates.map((date, i) => ({
      date,
      value: actualValues[i],
      type: "actual",
    }))

    const predictedPoints = dates.map((date, i) => ({
      date,
      value: predictedValues[i],
      type: "predicted",
    }))

    // Combine all points for easier hover detection
    const allPoints = [
      ...actualPoints.map((d) => ({ ...d, originalIndex: d.date.getTime() })),
      ...predictedPoints.map((d) => ({ ...d, originalIndex: d.date.getTime() })),
    ]

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Set up margins and dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 50 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    // Get colors based on theme
    const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"
    const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
    const actualColor = "#2563eb" // blue-600
    const predictedColor = "#f97316" // orange-500
    const backgroundColor = theme === "dark" ? "#1f2937" : "#ffffff"

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Create scales
    const xScale = d3.scaleTime().domain(d3.extent(dates)).range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min([...actualValues, ...predictedValues]) * 0.9,
        d3.max([...actualValues, ...predictedValues]) * 1.1,
      ])
      .range([height, 0])

    // Create axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.min(dates.length, width > 600 ? 10 : 5))
      .tickFormat(d3.timeFormat("%b %d"))

    const yAxis = d3.axisLeft(yScale).ticks(5)

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis.tickSize(-height).tickFormat(""))
      .selectAll("line")
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.5)

    svg
      .append("g")
      .attr("class", "grid")
      .call(yAxis.tickSize(-width).tickFormat(""))
      .selectAll("line")
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.5)

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
      .attr("fill", textColor)

    // Style X axis
    svg.selectAll(".x-axis path, .x-axis line").attr("stroke", textColor)

    // Add Y axis
    svg
      .append("g")
      .attr("class", "y-axis")
      .call(yAxis)
      .selectAll("text")
      .attr("font-size", "10px")
      .attr("fill", textColor)

    // Style Y axis
    svg.selectAll(".y-axis path, .y-axis line").attr("stroke", textColor)

    // Add axis labels
    svg
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .attr("font-size", "12px")
      .attr("fill", textColor)
      .text("Date")

    svg
      .append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 15)
      .attr("font-size", "12px")
      .attr("fill", textColor)
      .text("Value")

    // Create line generators
    const actualLine = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX)

    const predictedLine = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX)

    // Add the actual line path with animation
    const actualPath = svg
      .append("path")
      .datum(actualPoints)
      .attr("fill", "none")
      .attr("stroke", actualColor)
      .attr("stroke-width", 2)
      .attr("d", actualLine)

    // Animate the actual line
    const actualPathLength = actualPath.node().getTotalLength()
    actualPath
      .attr("stroke-dasharray", actualPathLength)
      .attr("stroke-dashoffset", actualPathLength)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0)

    // Add the predicted line path with animation
    const predictedPath = svg
      .append("path")
      .datum(predictedPoints)
      .attr("fill", "none")
      .attr("stroke", predictedColor)
      .attr("stroke-width", 2)
      .attr("d", predictedLine)

    // Animate the predicted line
    const predictedPathLength = predictedPath.node().getTotalLength()
    predictedPath
      .attr("stroke-dasharray", predictedPathLength)
      .attr("stroke-dashoffset", predictedPathLength)
      .transition()
      .delay(1000)
      .duration(1000)
      .attr("stroke-dashoffset", 0)

    // Add actual data points
    svg
      .selectAll(".actual-dot")
      .data(actualPoints)
      .enter()
      .append("circle")
      .attr("class", "actual-dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 0)
      .attr("fill", actualColor)
      .transition()
      .delay((d, i) => i * (1000 / actualPoints.length))
      .duration(300)
      .attr("r", 3)

    // Add predicted data points
    svg
      .selectAll(".predicted-dot")
      .data(predictedPoints)
      .enter()
      .append("circle")
      .attr("class", "predicted-dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 0)
      .attr("fill", predictedColor)
      .transition()
      .delay((d, i) => 1000 + i * (1000 / predictedPoints.length))
      .duration(300)
      .attr("r", 3)

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
      .style("z-index", "10")

    // Add hover interaction
    const hoverLine = svg
      .append("line")
      .attr("class", "hover-line")
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", textColor)
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0)

    const hoverCircleActual = svg
      .append("circle")
      .attr("class", "hover-circle-actual")
      .attr("r", 5)
      .style("fill", actualColor)
      .style("stroke", backgroundColor)
      .style("stroke-width", 2)
      .style("opacity", 0)

    const hoverCirclePredicted = svg
      .append("circle")
      .attr("class", "hover-circle-predicted")
      .attr("r", 5)
      .style("fill", predictedColor)
      .style("stroke", backgroundColor)
      .style("stroke-width", 2)
      .style("opacity", 0)

    // Create Delaunay for better hover detection
    const delaunay = d3.Delaunay.from(
      allPoints,
      (d) => xScale(d.date),
      (d) => yScale(d.value),
    )

    // Add invisible rect for mouse tracking
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", (event) => {
        const [mx, my] = d3.pointer(event)

        // Find the closest point using Delaunay triangulation
        const index = delaunay.find(mx, my)
        const d = allPoints[index]

        if (d) {
          // Find the corresponding actual and predicted points
          const date = d.date
          const actualPoint = actualPoints.find((p) => p.date.getTime() === date.getTime())
          const predictedPoint = predictedPoints.find((p) => p.date.getTime() === date.getTime())

          hoverLine.attr("x1", xScale(date)).attr("x2", xScale(date)).style("opacity", 1)

          if (actualPoint) {
            hoverCircleActual
              .attr("cx", xScale(actualPoint.date))
              .attr("cy", yScale(actualPoint.value))
              .style("opacity", 1)
          }

          if (predictedPoint) {
            hoverCirclePredicted
              .attr("cx", xScale(predictedPoint.date))
              .attr("cy", yScale(predictedPoint.value))
              .style("opacity", 1)
          }

          const error = Math.abs(actualPoint.value - predictedPoint.value).toFixed(2)
          const errorPercent = ((Math.abs(actualPoint.value - predictedPoint.value) / actualPoint.value) * 100).toFixed(
            2,
          )

          tooltip
            .style("visibility", "visible")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .html(`
              <div>
                <strong>Date:</strong> ${date.toLocaleDateString()}
                <br />
                <strong>Actual:</strong> ${actualPoint.value.toFixed(2)}
                <br />
                <strong>Predicted:</strong> ${predictedPoint.value.toFixed(2)}
                <br />
                <strong>Error:</strong> ${error} (${errorPercent}%)
              </div>
            `)
        }
      })
      .on("mouseleave", () => {
        hoverLine.style("opacity", 0)
        hoverCircleActual.style("opacity", 0)
        hoverCirclePredicted.style("opacity", 0)
        tooltip.style("visibility", "hidden")
      })
  }, [dimensions, theme])

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Actual</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Predicted</span>
          </div>
        </div>
      </div>
      <div ref={containerRef} className="w-full h-[calc(100%-30px)]" style={{ minHeight: "300px" }}>
        <svg ref={svgRef} width="100%" height="100%"></svg>
        <div ref={tooltipRef}></div>
      </div>
    </div>
  )
}

