"use client";

import _React from "react";
import ModelTraining from "./model-training/index.tsx";

/**
 * Main model training component that wraps the refactored components
 * This wrapper maintains backward compatibility while using the new modular implementation
 */
export default function ModelTrainingWrapper() {
  return <ModelTraining />;
}
