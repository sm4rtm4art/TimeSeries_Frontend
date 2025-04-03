import type { Metadata } from "next"
import Dashboard from "@/components/dashboard"

export const metadata: Metadata = {
  title: "Time Series Forecasting Platform",
  description: "Advanced time series forecasting with multiple models and interactive visualizations",
}

export default function Home() {
  return <Dashboard />
}

