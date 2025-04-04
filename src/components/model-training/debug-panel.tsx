/**
 * Debug panel for training context
 */
import { useEffect } from "react";
import { useTraining } from "@/contexts/training-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Debug panel that shows the current state of training
 * @returns DebugPanel component
 */
export default function DebugPanel() {
  const {
    trainingJobs,
    activeJobId,
  } = useTraining();

  // Don't call getActiveJob directly to avoid circular dependencies
  const activeJob = activeJobId
    ? trainingJobs.find((job) => job.jobId === activeJobId)
    : undefined;

  useEffect(() => {
    console.log("Debug panel - Training jobs:", trainingJobs);
    console.log("Debug panel - Active job ID:", activeJobId);
    console.log("Debug panel - Active job:", activeJob);
  }, [trainingJobs, activeJobId, activeJob]);

  return (
    <Card className="mt-4 border-dashed border-yellow-500">
      <CardHeader>
        <CardTitle className="text-yellow-500">Debug: Training State</CardTitle>
      </CardHeader>
      <CardContent className="text-xs">
        <div>
          <p>
            <strong>Active Job ID:</strong> {activeJobId || "none"}
          </p>
          <p>
            <strong>Jobs Count:</strong> {trainingJobs.length}
          </p>
          {activeJob && (
            <div className="mt-2">
              <p>
                <strong>Active Job:</strong>
              </p>
              <pre className="bg-muted p-2 rounded-md overflow-auto max-h-40 text-xs">
                {JSON.stringify(activeJob, null, 2)}
              </pre>
            </div>
          )}
          {trainingJobs.length > 0 && (
            <div className="mt-2">
              <p>
                <strong>All Jobs:</strong>
              </p>
              <pre className="bg-muted p-2 rounded-md overflow-auto max-h-40 text-xs">
                {JSON.stringify(trainingJobs, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
