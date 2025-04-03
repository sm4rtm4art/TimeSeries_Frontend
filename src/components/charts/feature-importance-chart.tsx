"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { useTheme } from "next-themes"

export default function FeatureImportanceChart({ data }) {
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
    if (!data || data.length === 0 || dimensions.width === 0) return

    // Sort data by importance in descending order
    const sortedData = [...data].sort((a, b) => b.importance - a.importance)

    // Clear previous chart
    d3.select(svgRef.current).selectAll("*").remove()

    // Set up margins and dimensions
    const margin = { top: 20, right: 80, bottom: 30, left: 120 }
    const width = dimensions.width - margin.left - margin.right
    const height = Math.max(sortedData.length * 40, dimensions.height - margin.top - margin.bottom)

    // Get colors based on theme
    const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"
    const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
    const barColor = theme === "dark" ? "#3b82f6" : "#2563eb" // blue-500 for dark, blue-600 for light
    const barHoverColor = theme === "dark" ? "#60a5fa" : "#3b82f6" // blue-400 for dark, blue-500 for light
    const backgroundColor = theme === "dark" ? "#1f2937" : "#ffffff"

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(sortedData, (d) => d.importance) * 1.1])
      .range([0, width])

    const yScale = d3
      .scaleBand()
      .domain(sortedData.map((d) => d.feature))
      .range([0, height])
      .padding(0.3)

    // Create axes
    const xAxis = d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".2f"))
    const yAxis = d3.axisLeft(yScale)

    // Add X axis
    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
      .selectAll("text")
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
      .attr("font-size", "12px")
      .attr("fill", textColor)
      .style("font-weight", "500")

    // Style Y axis
    svg.selectAll(".y-axis path, .y-axis line").attr("stroke", textColor)

    // Add grid lines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis.tickSize(-height).tickFormat(""))
      .selectAll("line")
      .attr("stroke", gridColor)
      .attr("stroke-opacity", 0.5)

    // Add bars with animation
    const bars = svg
      .selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", (d) => yScale(d.feature))
      .attr("height", yScale.bandwidth())
      .attr("x", 0)
      .attr("width", 0) // Start with width 0 for animation
      .attr("fill", barColor)
      .attr("rx", 4) // Rounded corners
      .attr("ry", 4)

    // Animate bars
    bars
      .transition()
      .duration(800)
      .delay((d, i) => i * 100)
      .attr("width", (d) => xScale(d.importance))

    // Add value labels
    const labels = svg
      .selectAll(".label")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", (d) => xScale(d.importance) + 5)
      .attr("y", (d) => yScale(d.feature) + yScale.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("fill", textColor)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .text((d) => d.importance.toFixed(2))
      .attr("opacity", 0) // Start invisible for animation

    // Animate labels
    labels
      .transition()
      .duration(800)
      .delay((d, i) => i * 100 + 300)
      .attr("opacity", 1)

    // Add hover effects
    bars
      .on("mouseover", function (event, d) {
        d3.select(this).transition().duration(200).attr("fill", barHoverColor)

        const tooltip = d3
          .select(tooltipRef.current)
          .style("position", "absolute")
          .style("visibility", "visible")
          .style("background-color", backgroundColor)
          .style("border", `1px solid ${gridColor}`)
          .style("border-radius", "4px")
          .style("padding", "8px")
          .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
          .style("font-size", "12px")
          .style("color", textColor)
          .style("pointer-events", "none")
          .style("z-index", "10")
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`)
          .html(`
            <div>
              <strong>${d.feature}</strong>
              <br />
              <span>Importance: ${d.importance.toFixed(3)}</span>
              <br />
              <span>Relative: ${((d.importance / sortedData[0].importance) * 100).toFixed(1)}%</span>
            </div>
          `)
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("fill", barColor)

        d3.select(tooltipRef.current).style("visibility", "hidden")
      })

    // Add title
    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .attr("fill", textColor)
      .text("Feature Importance")

    // Add x-axis label
    svg
      .append("text")
      .attr("class", "x-label")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", textColor)
      .text("Importance Score")
  }, [data, dimensions, theme])

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Feature Importance Scores</div>
      </div>
      <div ref={containerRef} className="w-full h-[calc(100%-30px)] overflow-auto" style={{ minHeight: "300px" }}>
        <svg ref={svgRef} width="100%" height="100%"></svg>
        <div ref={tooltipRef}></div>
      </div>
    </div>
  )
}

