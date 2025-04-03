"use client"

import { useEffect, useRef } from "react"
import * as Plot from "@observablehq/plot"

export default function ResidualAnalysisChart() {
  const containerRef = useRef()

  useEffect(() => {
    // Generate sample data for residual analysis
    const n = 200

    // Generate fitted values (predictions)
    const fittedValues = Array.from({ length: n }, () => Math.random() * 100 + 50)

    // Generate residuals with some correlation to fitted values
    const residuals = fittedValues.map((val) => Math.random() * 20 - 10 + (val - 75) * 0.05)

    // Create data points for plotting
    const dataPoints = fittedValues.map((fitted, i) => ({
      fitted,
      residual: residuals[i],
    }))

    // Create the plot
    const chart = Plot.plot({
      style: {
        background: "transparent",
        fontSize: "12px",
      },
      marginLeft: 50,
      marginRight: 30,
      marginBottom: 30,
      marginTop: 30,
      grid: true,
      x: {
        label: "Fitted Values",
      },
      y: {
        label: "Residuals",
      },
      marks: [
        // Zero line
        Plot.ruleY([0], {
          stroke: "#94a3b8",
          strokeWidth: 1,
        }),

        // Scatter plot of residuals
        Plot.dot(dataPoints, {
          x: "fitted",
          y: "residual",
          fill: "#2563eb",
          fillOpacity: 0.6,
          r: 3,
        }),

        // Trend line for residuals
        Plot.linearRegressionY(dataPoints, {
          x: "fitted",
          y: "residual",
          stroke: "#f97316",
          strokeWidth: 2,
        }),
      ],
    })

    if (containerRef.current) {
      // Clear previous chart if any
      containerRef.current.innerHTML = ""
      containerRef.current.append(chart)
    }

    return () => chart.remove()
  }, [])

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">Residuals vs Fitted Values</div>
      </div>
      <div ref={containerRef} className="w-full h-full"></div>
      <div className="mt-4 text-sm text-muted-foreground">
        <p>A good forecast model should have residuals that:</p>
        <ul className="list-disc pl-5 mt-1">
          <li>Are randomly distributed around zero</li>
          <li>Show no pattern or trend</li>
          <li>Have constant variance across fitted values</li>
        </ul>
      </div>
    </div>
  )
}

