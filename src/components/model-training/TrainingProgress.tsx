import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Cpu, Gauge, Loader2 } from "lucide-react";
import { TrainingStatus } from "@/types/models";

/**
 * Props for the TrainingProgress component
 * @interface TrainingProgressProps
 */
interface TrainingProgressProps {
  /** Current training progress (0-100) */
  progress: number;
  /** Current training step description */
  step: string;
  /** Current status of training */
  status: TrainingStatus;
  /** CPU usage percentage */
  cpuUsage?: number;
  /** Memory usage in GB */
  memoryUsage?: number;
  /** Estimated time remaining in seconds */
  estimatedTimeRemaining?: number;
  /** Best model so far (for completed training) */
  bestModel?: string;
  /** Best metric value so far (for completed training) */
  bestMetric?: { name: string; value: number };
  /** Total training time in seconds (for completed training) */
  totalTrainingTime?: number;
  /** Callback when the view results button is clicked */
  onViewResults?: () => void;
}

/**
 * A component that displays the training progress
 *
 * @component TrainingProgress
 */
export const TrainingProgress: React.FC<TrainingProgressProps> = ({
  progress,
  step,
  status,
  cpuUsage,
  memoryUsage,
  estimatedTimeRemaining,
  bestModel,
  bestMetric,
  totalTrainingTime,
  onViewResults,
}) => {
  /**
   * Format seconds to minutes and seconds string
   * @param seconds Time in seconds
   * @returns Formatted time string (e.g., "5m 30s")
   */
  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return "0s";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes > 0 ? minutes + "m " : ""}${remainingSeconds}s`;
  };

  return (
    <Card
      className={`border-${
        status === "completed" ? "green" : "blue"
      }-200 dark:border-${status === "completed" ? "green" : "blue"}-900`}
    >
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center gap-4">
          {status === "completed"
            ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-6 w-6" />
                <h3 className="text-lg font-medium">Training Complete</h3>
              </div>
            )
            : status === "failed"
            ? (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <CheckCircle className="h-6 w-6" />
                <h3 className="text-lg font-medium">Training Failed</h3>
              </div>
            )
            : (
              <div className="flex w-full items-center gap-4">
                <div className="w-full">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span>{step}</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            )}

          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {status === "completed"
              ? (
                <>
                  {bestModel && (
                    <div className="flex items-center gap-2 rounded-md border p-3">
                      <Cpu className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Best Model
                        </div>
                        <div className="font-medium">{bestModel}</div>
                      </div>
                    </div>
                  )}
                  {bestMetric && (
                    <div className="flex items-center gap-2 rounded-md border p-3">
                      <Gauge className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Best {bestMetric.name}
                        </div>
                        <div className="font-medium">
                          {bestMetric.name === "mape"
                            ? `${bestMetric.value}%`
                            : bestMetric.value}
                        </div>
                      </div>
                    </div>
                  )}
                  {totalTrainingTime !== undefined && (
                    <div className="flex items-center gap-2 rounded-md border p-3">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Total Training Time
                        </div>
                        <div className="font-medium">
                          {formatTime(totalTrainingTime)}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )
              : (
                <>
                  {cpuUsage !== undefined && (
                    <div className="flex items-center gap-2 rounded-md border p-3">
                      <Cpu className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="text-xs text-muted-foreground">
                          CPU Usage
                        </div>
                        <div className="font-medium">{cpuUsage}%</div>
                      </div>
                    </div>
                  )}
                  {memoryUsage !== undefined && (
                    <div className="flex items-center gap-2 rounded-md border p-3">
                      <Gauge className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Memory
                        </div>
                        <div className="font-medium">
                          {memoryUsage.toFixed(1)} GB
                        </div>
                      </div>
                    </div>
                  )}
                  {estimatedTimeRemaining !== undefined && (
                    <div className="flex items-center gap-2 rounded-md border p-3">
                      <Clock className="h-5 w-5 text-orange-500" />
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Est. Time Remaining
                        </div>
                        <div className="font-medium">
                          {formatTime(estimatedTimeRemaining)}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
          </div>

          {status === "running" && (
            <div className="flex items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing... Please wait
            </div>
          )}

          {status === "completed" && onViewResults && (
            <div className="flex w-full justify-end">
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-700 dark:hover:bg-blue-600"
                onClick={onViewResults}
                type="button"
              >
                View Results
              </button>
            </div>
          )}

          {status === "failed" && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
              Training failed. Please check your parameters and try again.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingProgress;
