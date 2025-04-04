"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Database,
  LineChart,
  Settings,
  TrendingUp,
} from "lucide-react";
import DataManagement from "@/components/data-management";
import ModelConfiguration from "@/components/model-configuration";
import ModelTraining from "@/components/model-training-wrapper";
import ForecastingWorkspace from "@/components/forecasting-workspace";
import ResultsAnalysis from "@/components/results-analysis";
import Overview from "@/components/overview";
import SidebarControls from "@/components/sidebar-controls";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="flex h-14 items-center border-b px-4">
            <h1 className="text-lg font-semibold">Forecast Platform</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarControls />
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <Button variant="outline" className="w-full">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center border-b px-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="overview">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="data">
                  <Database className="mr-2 h-4 w-4" />
                  Data
                </TabsTrigger>
                <TabsTrigger value="models">
                  <Settings className="mr-2 h-4 w-4" />
                  Models
                </TabsTrigger>
                <TabsTrigger value="training">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Training
                </TabsTrigger>
                <TabsTrigger value="forecasting">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Forecasting
                </TabsTrigger>
                <TabsTrigger value="results">
                  <LineChart className="mr-2 h-4 w-4" />
                  Results
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-auto p-6">
            {activeTab === "overview" && <Overview />}
            {activeTab === "data" && <DataManagement />}
            {activeTab === "models" && <ModelConfiguration />}
            {activeTab === "training" && <ModelTraining />}
            {activeTab === "forecasting" && <ForecastingWorkspace />}
            {activeTab === "results" && <ResultsAnalysis />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
