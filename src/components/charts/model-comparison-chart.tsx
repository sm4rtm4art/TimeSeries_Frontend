"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useTheme } from "next-themes"

interface ModelData {
  name: string
  color: string
  values: number[]
}

interface ModelComparisonChartProps {
  dates: string[]
  models: ModelData[]
  activeModels: string[]
  onToggleModel?: (modelName: string) => void
}

export default function ModelComparisonChart({
  dates,
  models,
  activeModels,
  onToggleModel,
}: ModelComparisonChartProps) {
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
    if (!dates || !models || dates.length === 0 || models.length === 0 || dimensions.width === 0) return

    // Filter active models
    const filteredModels = models.filter((model) => activeModels.includes(model.name))

    if (filteredModels.length === 0) return

    // Convert string dates to Date objects
    const parsedDates = dates.map((date) => new Date(date))

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Set up margins and dimensions
    const margin = { top: 20, right: 80, bottom: 50, left: 50 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    // Get colors based on theme
    const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"
    const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
    const backgroundColor = theme === "dark" ? "#1f2937" : "#ffffff"

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Find min and max values across all models
    const allValues = filteredModels.flatMap((model) => model.values)
    const minValue = d3.min(allValues) * 0.9
    const maxValue = d3.max(allValues) * 1.1

    // Create scales
    const xScale = d3.scaleTime().domain(d3.extent(parsedDates)).range([0, width])

    const yScale = d3.scaleLinear().domain([minValue, maxValue]).range([height, 0])

    // Create axes
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(Math.min(parsedDates.length, width > 600 ? 10 : 5))
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

    // Create line generator
    const line = d3
      .line()
      .x((d, i) => xScale(parsedDates[i]))
      .y((d) => yScale(d))
      .curve(d3.curveMonotoneX)

    // Add lines for each model
    filteredModels.forEach((model, modelIndex) => {
      // Add the line path with animation
      const path = svg
        .append("path")
        .datum(model.values)
        .attr("fill", "none")
        .attr("stroke", model.color)
        .attr("stroke-width", 2)
        .attr("d", line)

      // Animate the line
      const pathLength = path.node().getTotalLength()
      path
        .attr("stroke-dasharray", pathLength)
        .attr("stroke-dashoffset", pathLength)
        .transition()
        .duration(1000)
        .delay(modelIndex * 300)
        .attr("stroke-dashoffset", 0)

      // Add dots
      svg
        .selectAll(`.dot-${modelIndex}`)
        .data(model.values)
        .enter()
        .append("circle")
        .attr("class", `dot-${modelIndex}`)
        .attr("cx", (d, i) => xScale(parsedDates[i]))
        .attr("cy", (d) => yScale(d))
        .attr("r", 0)
        .attr("fill", model.color)
        .transition()
        .delay((d, i) => modelIndex * 300 + i * (1000 / model.values.length))
        .duration(300)
        .attr("r", 3)
    })

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

    // Add hover interaction with vertical line
    const hoverLine = svg
      .append("line")
      .attr("class", "hover-line")
      .attr("y1", 0)
      .attr("y2", height)
      .style("stroke", textColor)
      .style("stroke-width", 1)
      .style("stroke-dasharray", "3,3")
      .style("opacity", 0)

    const hoverCircles = filteredModels.map((model, i) => {
      return svg
        .append("circle")
        .attr("class", `hover-circle-${i}`)
        .attr("r", 5)
        .style("fill", model.color)
        .style("stroke", backgroundColor)
        .style("stroke-width", 2)
        .style("opacity", 0)
    })

    // Add invisible rect for mouse tracking
    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .on("mousemove", (event) => {
        const [mx] = d3.pointer(event)

        // Find the closest date index
        const xPos = xScale.invert(mx)
        const bisect = d3.bisector((d) => d).left
        const dateIndex = bisect(parsedDates, xPos) - 1

        if (dateIndex >= 0 && dateIndex < parsedDates.length) {
          const date = parsedDates[dateIndex]

          // Update hover line
          hoverLine.attr("x1", xScale(date)).attr("x2", xScale(date)).style("opacity", 1)

          // Update hover circles
          filteredModels.forEach((model, i) => {
            const value = model.values[dateIndex]
            hoverCircles[i].attr("cx", xScale(date)).attr("cy", yScale(value)).style("opacity", 1)
          })

          // Update tooltip
          let tooltipContent = `<div><strong>Date:</strong> ${date.toLocaleDateString()}<br/>`
          filteredModels.forEach((model) => {
            const value = model.values[dateIndex]
            tooltipContent += `<div style="display: flex; align-items: center; margin-top: 4px;">
              <div style="width: 10px; height: 10px; background-color: ${model.color}; margin-right: 5px; border-radius: 50%;"></div>
              <strong>${model.name}:</strong> ${value.toFixed(2)}
            </div>`
          })
          tooltipContent += `</div>`

          tooltip
            .style("visibility", "visible")
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`)
            .html(tooltipContent)
        }
      })
      .on("mouseleave", () => {
        hoverLine.style("opacity", 0)
        hoverCircles.forEach((circle) => circle.style("opacity", 0))
        tooltip.style("visibility", "hidden")
      })

    // Add legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(${width + 10}, 0)`)

    filteredModels.forEach((model, i) => {
      const legendItem = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 25})`)
        .style("cursor", "pointer")
        .on("click", () => {
          if (onToggleModel) {
            onToggleModel(model.name)
          }
        })

      legendItem.append("rect").attr("width", 15).attr("height", 15).attr("rx", 2).attr("fill", model.color)

      legendItem
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("font-size", "12px")
        .attr("fill", textColor)
        .text(model.name)
    })
  }, [dates, models, activeModels, dimensions, theme])

  return (
    <div className="w-full h-full">
      <div ref={containerRef} className="w-full h-[calc(100%-30px)]" style={{ minHeight: "300px" }}>
        <svg ref={svgRef} width="100%" height="100%"></svg>
        <div ref={tooltipRef}></div>
      </div>
    </div>
  )
}

