"use client";

import _React from "react";
// Import from the copied file to avoid circular dependencies
import ModelTrainingComponent from "./training-module";

/**
 * Main model training component that wraps the refactored components
 * This wrapper maintains backward compatibility while using the new modular implementation
 */
export default function ModelTraining() {
  // Rename the component usage to avoid name conflicts
  return <ModelTrainingComponent />;
}
