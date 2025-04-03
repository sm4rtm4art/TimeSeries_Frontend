"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useTheme } from "next-themes"

export default function ForecastChart({ historicalData, forecastData, confidenceInterval = 95 }) {
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

  // Create/update chart when data or dimensions change
  useEffect(() => {
    if (!historicalData || !forecastData || dimensions.width === 0) return

    // Convert string dates to Date objects
    const parsedHistorical = historicalData.dates.map((date, i) => ({
      date: new Date(date),
      value: historicalData.values[i],
      type: "historical",
    }))

    const parsedForecast = forecastData.dates.map((date, i) => ({
      date: new Date(date),
      value: forecastData.values[i],
      upper: forecastData.upper[i],
      lower: forecastData.lower[i],
      type: "forecast",
    }))

    const allData = [...parsedHistorical, ...parsedForecast]

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Set up margins and dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 50 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    // Get colors based on theme
    const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"
    const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
    const lineColor = "#2563eb" // blue-600
    const confidenceColor = theme === "dark" ? "#1e40af" : "#93c5fd" // dark: blue-800, light: blue-200
    const backgroundColor = theme === "dark" ? "#1f2937" : "#ffffff"

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Create scales
    const xScale = d3
      .scaleTime()
      .domain(d3.extent(allData, (d) => d.date))
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(allData, (d) => (d.lower !== undefined ? d.lower : d.value)) * 0.9,
        d3.max(allData, (d) => (d.upper !== undefined ? d.upper : d.value)) * 1.1,
      ])
      .range([height, 0])

    // Create axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.min(allData.length, width > 600 ? 10 : 5))
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

    // Add confidence interval area
    if (parsedForecast.length > 0 && parsedForecast[0].upper !== undefined) {
      const areaGenerator = d3
        .area()
        .x((d) => xScale(d.date))
        .y0((d) => yScale(d.lower))
        .y1((d) => yScale(d.upper))
        .curve(d3.curveMonotoneX)

      svg
        .append("path")
        .datum(parsedForecast)
        .attr("fill", confidenceColor)
        .attr("fill-opacity", 0.3)
        .attr("d", areaGenerator)
        .attr("clip-path", "url(#clip)")
    }

    // Create line generators
    const historicalLine = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX)

    const forecastLine = d3
      .line()
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX)

    // Add the historical line path with animation
    const historicalPath = svg
      .append("path")
      .datum(parsedHistorical)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)
      .attr("d", historicalLine)

    // Animate the historical line
    const historicalPathLength = historicalPath.node().getTotalLength()
    historicalPath
      .attr("stroke-dasharray", historicalPathLength)
      .attr("stroke-dashoffset", historicalPathLength)
      .transition()
      .duration(1000)
      .attr("stroke-dashoffset", 0)

    // Add the forecast line path with animation
    const forecastPath = svg
      .append("path")
      .datum(parsedForecast)
      .attr("fill", "none")
      .attr("stroke", lineColor)
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5,5")
      .attr("d", forecastLine)

    // Animate the forecast line
    const forecastPathLength = forecastPath.node()?.getTotalLength() || 0
    forecastPath
      .attr("stroke-dasharray", `5,5`)
      .attr("stroke-dashoffset", forecastPathLength)
      .transition()
      .delay(1000)
      .duration(1000)
      .attr("stroke-dashoffset", 0)

    // Add vertical line separating historical and forecast
    if (parsedForecast.length > 0) {
      const separationDate = parsedForecast[0].date
      svg
        .append("line")
        .attr("x1", xScale(separationDate))
        .attr("x2", xScale(separationDate))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", textColor)
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", "5,5")
    }

    // Add historical dots
    svg
      .selectAll(".historical-dot")
      .data(parsedHistorical)
      .enter()
      .append("circle")
      .attr("class", "historical-dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 0)
      .attr("fill", lineColor)
      .transition()
      .delay((d, i) => i * (1000 / parsedHistorical.length))
      .duration(300)
      .attr("r", 3)

    // Add forecast dots
    svg
      .selectAll(".forecast-dot")
      .data(parsedForecast)
      .enter()
      .append("circle")
      .attr("class", "forecast-dot")
      .attr("cx", (d) => xScale(d.date))
      .attr("cy", (d) => yScale(d.value))
      .attr("r", 0)
      .attr("fill", lineColor)
      .attr("stroke", backgroundColor)
      .attr("stroke-width", 1)
      .transition()
      .delay((d, i) => 1000 + i * (1000 / parsedForecast.length))
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

    const hoverCircle = svg
      .append("circle")
      .attr("class", "hover-circle")
      .attr("r", 5)
      .style("fill", lineColor)
      .style("stroke", backgroundColor)
      .style("stroke-width", 2)
      .style("opacity", 0)

    // Create Delaunay for better hover detection
    const delaunay = d3.Delaunay.from(
      allData,
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
        const d = allData[index]

        if (d) {
          hoverLine.attr("x1", xScale(d.date)).attr("x2", xScale(d.date)).style("opacity", 1)

          hoverCircle.attr("cx", xScale(d.date)).attr("cy", yScale(d.value)).style("opacity", 1)

          let tooltipContent = `
            <div>
              <strong>Date:</strong> ${d.date.toLocaleDateString()}
              <br />
              <strong>Value:</strong> ${d.value.toFixed(2)}
            </div>
          `

          if (d.type === "forecast" && d.upper !== undefined) {
            tooltipContent = `
              <div>
                <strong>Date:</strong> ${d.date.toLocaleDateString()}
                <br />
                <strong>Forecast:</strong> ${d.value.toFixed(2)}
                <br />
                <strong>Upper (${confidenceInterval}%):</strong> ${d.upper.toFixed(2)}
                <br />
                <strong>Lower (${confidenceInterval}%):</strong> ${d.lower.toFixed(2)}
              </div>
            `
          }

          tooltip
            .style("visibility", "visible")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .html(tooltipContent)
        }
      })
      .on("mouseleave", () => {
        hoverLine.style("opacity", 0)
        hoverCircle.style("opacity", 0)
        tooltip.style("visibility", "hidden")
      })
  }, [historicalData, forecastData, dimensions, confidenceInterval, theme])

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Historical</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-blue-600 border-dashed border-t-2 border-blue-600"></div>
            <span>Forecast</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-100 dark:bg-blue-800 rounded-sm"></div>
            <span>{confidenceInterval}% Confidence</span>
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

