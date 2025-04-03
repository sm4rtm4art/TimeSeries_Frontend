"use client";

import { useTheme } from "next-themes";
import { Brain, Loader2, TrendingUp } from "lucide-react";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export function TrainingLoadingIndicator(
  { size = "md", text = "Training model..." }: LoadingProps,
) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sizeClasses = {
    sm: "h-16 w-16 text-sm",
    md: "h-24 w-24 text-base",
    lg: "h-32 w-32 text-lg",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="h-1/2 w-1/2 text-blue-600 dark:text-blue-400" />
        </div>
        <svg className="animate-spin h-full w-full" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isDark ? "#1e40af" : "#dbeafe"}
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isDark ? "#3b82f6" : "#2563eb"}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset="100"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="font-medium">{text}</p>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse">
          </div>
          <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse delay-150">
          </div>
          <div className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse delay-300">
          </div>
        </div>
      </div>
    </div>
  );
}

export function ForecastLoadingIndicator(
  { size = "md", text = "Generating forecast..." }: LoadingProps,
) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sizeClasses = {
    sm: "h-16 w-16 text-sm",
    md: "h-24 w-24 text-base",
    lg: "h-32 w-32 text-lg",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <TrendingUp className="h-1/2 w-1/2 text-orange-600 dark:text-orange-400" />
        </div>
        <svg className="animate-spin h-full w-full" viewBox="0 0 100 100">
          <path
            d="M 50,50 m -45,0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"
            fill="none"
            stroke={isDark ? "#7c2d12" : "#ffedd5"}
            strokeWidth="8"
          />
          <path
            d="M 50,50 m -45,0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0"
            fill="none"
            stroke={isDark ? "#f97316" : "#ea580c"}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset="100"
            className="animate-dash"
          />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-1">
        <p className="font-medium">{text}</p>
        <div className="flex items-center gap-1">
          <span className="inline-block h-1 w-2 bg-orange-600 dark:bg-orange-400 animate-pulse">
          </span>
          <span className="inline-block h-2 w-2 bg-orange-600 dark:bg-orange-400 animate-pulse delay-75">
          </span>
          <span className="inline-block h-3 w-2 bg-orange-600 dark:bg-orange-400 animate-pulse delay-150">
          </span>
          <span className="inline-block h-4 w-2 bg-orange-600 dark:bg-orange-400 animate-pulse delay-225">
          </span>
          <span className="inline-block h-5 w-2 bg-orange-600 dark:bg-orange-400 animate-pulse delay-300">
          </span>
          <span className="inline-block h-4 w-2 bg-orange-600 dark:bg-orange-400 animate-pulse delay-375">
          </span>
          <span className="inline-block h-3 w-2 bg-orange-600 dark:bg-orange-400 animate-pulse delay-450">
          </span>
          <span className="inline-block h-2 w-2 bg-orange-600 dark:bg-orange-400 animate-pulse delay-525">
          </span>
          <span className="inline-block h-1 w-2 bg-orange-600 dark:bg-orange-400 animate-pulse delay-600">
          </span>
        </div>
      </div>
    </div>
  );
}

export function SimpleLoadingSpinner({ className = "" }) {
  return <Loader2 className={`animate-spin ${className}`} />;
}
