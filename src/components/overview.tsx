"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Database,
  Settings,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Overview() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Models
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">
              N-BEATS, Prophet, TiDE, TSMixer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Datasets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              4 built-in, 2 custom
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Best Model
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">TiDE</div>
            <p className="text-xs text-muted-foreground">MAPE: 3.89%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Forecast Horizon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30 days</div>
            <p className="text-xs text-muted-foreground">
              Last updated: 2 hours ago
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <ActionCard
                icon={<Database className="h-5 w-5" />}
                title="Upload New Data"
                description="Import a new time series dataset"
                href="#data"
              />

              <ActionCard
                icon={<Settings className="h-5 w-5" />}
                title="Configure Model"
                description="Set up and train a forecasting model"
                href="#models"
              />

              <ActionCard
                icon={<TrendingUp className="h-5 w-5" />}
                title="Generate Forecast"
                description="Create a new time series forecast"
                href="#forecasting"
              />

              <ActionCard
                icon={<BarChart3 className="h-5 w-5" />}
                title="View Results"
                description="Analyze forecast performance"
                href="#results"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                title="TiDE Model Trained"
                description="Model trained on Airline Passengers dataset"
                time="2 hours ago"
                badge="Model"
              />

              <ActivityItem
                title="Forecast Generated"
                description="30-day forecast with 95% confidence interval"
                time="2 hours ago"
                badge="Forecast"
              />

              <ActivityItem
                title="Dataset Uploaded"
                description="Retail Sales data uploaded"
                time="Yesterday"
                badge="Data"
              />

              <ActivityItem
                title="N-BEATS Model Trained"
                description="Model trained on Energy Consumption dataset"
                time="2 days ago"
                badge="Model"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, description, href }) {
  return (
    <Button variant="outline" className="h-auto justify-start p-4" asChild>
      <a href={href} className="flex flex-col items-start space-y-1">
        <div className="rounded-full bg-primary/10 p-1.5 text-primary">
          {icon}
        </div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
        <div className="mt-1 flex items-center text-xs text-primary">
          Get started <ArrowRight className="ml-1 h-3 w-3" />
        </div>
      </a>
    </Button>
  );
}

function ActivityItem({ title, description, time, badge }) {
  const getBadgeColor = (type) => {
    switch (type) {
      case "Model":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Forecast":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Data":
        return "bg-orange-100 text-orange-800 hover:bg-orange-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <Badge variant="outline" className={`${getBadgeColor(badge)} mt-0.5`}>
        {badge}
      </Badge>
      <div className="space-y-1">
        <p className="font-medium leading-none">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}
