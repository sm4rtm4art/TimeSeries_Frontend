"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  ModelConfig,
  ModelDefinition,
  TrainingResult,
  TrainingStatus,
} from "@/types/models";

interface TrainingJob {
  jobId: string;
  modelId: string;
  modelName: string;
  status: TrainingStatus;
  progress: number;
  parameters: ModelConfig;
  result?: TrainingResult;
  error?: string;
  startTime: Date;
  endTime?: Date;
}

interface TrainingContextType {
  trainingJobs: TrainingJob[];
  activeJobId: string | null;
  setActiveJobId: (jobId: string | null) => void;
  startTraining: (
    model: ModelDefinition,
    parameters: ModelConfig,
    datasetId: string,
  ) => TrainingJob;
  updateJobStatus: (jobId: string, status: TrainingStatus) => void;
  completeTrainingJob: (jobId: string) => void;
  failTrainingJob: (jobId: string, error: string) => void;
  getJob: (jobId: string) => TrainingJob | undefined;
  getActiveJob: () => TrainingJob | undefined;
}

const TrainingContext = createContext<TrainingContextType | undefined>(
  undefined,
);

export function TrainingProvider({ children }: { children: ReactNode }) {
  const [trainingJobs, setTrainingJobs] = useState<TrainingJob[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  /**
   * Start a new training job
   * @param model The model to train
   * @param parameters The configuration parameters
   * @param datasetId The dataset to use for training
   * @returns The created job
   */
  const startTraining = useCallback((
    model: ModelDefinition,
    parameters: ModelConfig,
    datasetId: string,
  ) => {
    console.log("Starting training job:", {
      model: model.id,
      parameters,
      datasetId,
    });

    // In a real app, this would make an API call to the backend
    const newJob: TrainingJob = {
      jobId: `job-${Date.now()}`,
      modelId: model.id,
      modelName: model.name,
      status: "queued",
      progress: 0,
      parameters,
      startTime: new Date(),
    };

    console.log("Created new job:", newJob);
    setTrainingJobs((prev) => [...prev, newJob]);
    setActiveJobId(newJob.jobId);

    // Mock the training process (would be an API call in real app)
    setTimeout(() => {
      console.log("Updating job status to running:", newJob.jobId);

      // Update job status directly rather than calling updateJobStatus
      setTrainingJobs((prev) => {
        const jobIndex = prev.findIndex((job) => job.jobId === newJob.jobId);
        if (jobIndex === -1) {
          console.warn(`Job not found for status update: ${newJob.jobId}`);
          return prev;
        }

        console.log(
          `Found job at index ${jobIndex}, updating status to running`,
        );

        const updatedJobs = [...prev];
        updatedJobs[jobIndex] = {
          ...updatedJobs[jobIndex],
          status: "running",
        };

        return updatedJobs;
      });

      // Mock progress updates
      const interval = setInterval(() => {
        setTrainingJobs((prev) => {
          const jobIndex = prev.findIndex((job) => job.jobId === newJob.jobId);
          if (jobIndex === -1) {
            console.warn("Job not found in progress update:", newJob.jobId);
            return prev;
          }

          const job = prev[jobIndex];
          if (job.progress >= 100) {
            console.log("Progress reached 100%, clearing interval");
            clearInterval(interval);
            return prev;
          }

          const newProgress = Math.min(job.progress + 10, 100);
          console.log(
            `Updating progress for job ${newJob.jobId}: ${newProgress}%`,
          );

          const updatedJobs = [...prev];
          updatedJobs[jobIndex] = {
            ...job,
            progress: newProgress,
          };

          // Complete the job when progress reaches 100%
          if (newProgress === 100) {
            console.log("Progress at 100%, completing job shortly");
            setTimeout(() => {
              console.log("Completing job:", newJob.jobId);

              // Complete the job directly instead of calling completeTrainingJob
              setTrainingJobs((prevJobs) => {
                const completedJobIndex = prevJobs.findIndex((j) =>
                  j.jobId === newJob.jobId
                );
                if (completedJobIndex === -1) return prevJobs;

                // Create a mock result (would come from the API in real app)
                const mockResult: TrainingResult = {
                  id: `result-${Date.now()}`,
                  modelId: prevJobs[completedJobIndex].modelId,
                  modelName: prevJobs[completedJobIndex].modelName,
                  experimentName: `Experiment ${new Date().toLocaleString()}`,
                  metrics: {
                    mape: Math.random() * 10 + 5,
                    rmse: Math.random() * 50 + 20,
                    mae: Math.random() * 30 + 10,
                  },
                  runtime: `${Math.floor(Math.random() * 5) + 1}m ${
                    Math.floor(Math.random() * 50) + 10
                  }s`,
                  timestamp: new Date().toISOString(),
                  parameters: prevJobs[completedJobIndex].parameters,
                };

                const finalUpdatedJobs = [...prevJobs];
                finalUpdatedJobs[completedJobIndex] = {
                  ...finalUpdatedJobs[completedJobIndex],
                  status: "completed",
                  progress: 100,
                  result: mockResult,
                  endTime: new Date(),
                };

                return finalUpdatedJobs;
              });
            }, 500);
          }

          return updatedJobs;
        });
      }, 1000);
    }, 500);

    return newJob;
  }, []);

  /**
   * Update the status of a training job
   * @param jobId The job ID to update
   * @param status The new status
   */
  const updateJobStatus = useCallback(
    (jobId: string, status: TrainingStatus) => {
      console.log(`Updating job status: ${jobId} -> ${status}`);

      setTrainingJobs((prev) => {
        const jobIndex = prev.findIndex((job) => job.jobId === jobId);
        if (jobIndex === -1) {
          console.warn(`Job not found for status update: ${jobId}`);
          return prev;
        }

        console.log(
          `Found job at index ${jobIndex}, updating status to ${status}`,
        );

        const updatedJobs = [...prev];
        updatedJobs[jobIndex] = {
          ...updatedJobs[jobIndex],
          status,
        };

        return updatedJobs;
      });
    },
    [],
  );

  /**
   * Mark a training job as completed
   * @param jobId The job ID to complete
   */
  const completeTrainingJob = useCallback((jobId: string) => {
    setTrainingJobs((prev) => {
      const jobIndex = prev.findIndex((job) => job.jobId === jobId);
      if (jobIndex === -1) return prev;

      // Create a mock result (would come from the API in real app)
      const mockResult: TrainingResult = {
        id: `result-${Date.now()}`,
        modelId: prev[jobIndex].modelId,
        modelName: prev[jobIndex].modelName,
        experimentName: `Experiment ${new Date().toLocaleString()}`,
        metrics: {
          mape: Math.random() * 10 + 5,
          rmse: Math.random() * 50 + 20,
          mae: Math.random() * 30 + 10,
        },
        runtime: `${Math.floor(Math.random() * 5) + 1}m ${
          Math.floor(Math.random() * 50) + 10
        }s`,
        timestamp: new Date().toISOString(),
        parameters: prev[jobIndex].parameters,
      };

      const updatedJobs = [...prev];
      updatedJobs[jobIndex] = {
        ...updatedJobs[jobIndex],
        status: "completed",
        progress: 100,
        result: mockResult,
        endTime: new Date(),
      };

      return updatedJobs;
    });
  }, []);

  /**
   * Mark a training job as failed
   * @param jobId The job ID that failed
   * @param error The error message
   */
  const failTrainingJob = useCallback((jobId: string, error: string) => {
    setTrainingJobs((prev) => {
      const jobIndex = prev.findIndex((job) => job.jobId === jobId);
      if (jobIndex === -1) return prev;

      const updatedJobs = [...prev];
      updatedJobs[jobIndex] = {
        ...updatedJobs[jobIndex],
        status: "failed",
        error,
        endTime: new Date(),
      };

      return updatedJobs;
    });
  }, []);

  /**
   * Get a specific training job
   * @param jobId The job ID to retrieve
   * @returns The training job or undefined if not found
   */
  const getJob = useCallback((jobId: string) => {
    return trainingJobs.find((job) => job.jobId === jobId);
  }, [trainingJobs]);

  /**
   * Get the currently active job
   * @returns The active job or undefined if none
   */
  const getActiveJob = useCallback(() => {
    console.log(`Getting active job. activeJobId: ${activeJobId}`);

    if (!activeJobId) {
      console.log("No active job ID set");
      return undefined;
    }

    const job = trainingJobs.find((job) => job.jobId === activeJobId);
    console.log("Active job:", job);
    return job;
  }, [activeJobId, trainingJobs]);

  const value = {
    trainingJobs,
    activeJobId,
    setActiveJobId,
    startTraining,
    updateJobStatus,
    completeTrainingJob,
    failTrainingJob,
    getJob,
    getActiveJob,
  };

  return (
    <TrainingContext.Provider value={value}>
      {children}
    </TrainingContext.Provider>
  );
}

export function useTraining() {
  const context = useContext(TrainingContext);
  if (context === undefined) {
    throw new Error("useTraining must be used within a TrainingProvider");
  }
  return context;
}
