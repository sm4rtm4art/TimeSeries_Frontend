/**
 * React hook for managing model training processes
 */
import { useCallback, useState } from "react";
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

/**
 * Custom hook for managing model training state
 * @returns Object containing training state and methods
 */
export function useTraining() {
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

    setTrainingJobs((prev) => [...prev, newJob]);
    setActiveJobId(newJob.jobId);

    // Mock the training process (would be an API call in real app)
    setTimeout(() => {
      updateJobStatus(newJob.jobId, "running");

      // Mock progress updates
      const interval = setInterval(() => {
        setTrainingJobs((prev) => {
          const jobIndex = prev.findIndex((job) => job.jobId === newJob.jobId);
          if (jobIndex === -1) return prev;

          const job = prev[jobIndex];
          if (job.progress >= 100) {
            clearInterval(interval);
            return prev;
          }

          const newProgress = Math.min(job.progress + 10, 100);
          const updatedJobs = [...prev];
          updatedJobs[jobIndex] = {
            ...job,
            progress: newProgress,
          };

          // Complete the job when progress reaches 100%
          if (newProgress === 100) {
            setTimeout(() => {
              completeTrainingJob(newJob.jobId);
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
      setTrainingJobs((prev) => {
        const jobIndex = prev.findIndex((job) => job.jobId === jobId);
        if (jobIndex === -1) return prev;

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
    if (!activeJobId) return undefined;
    return getJob(activeJobId);
  }, [activeJobId, getJob]);

  return {
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
}
