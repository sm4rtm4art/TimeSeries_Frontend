/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

// Import and run the DOM setup first
// import { setupDOM } from "../../../test_setup.ts";
// setupDOM(); // Keep this commented out for now

import _React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
// Mock the CSS import if needed, or configure the test runner to handle it
// import "@testing-library/jest-dom"; // Or equivalent Deno/Vitest matchers

import { ModelCard } from "../../../../components/model-training/ModelCard.tsx";
import { ModelDefinition } from "../../../../types/models.ts";
import { createMockModel } from "../../../test-utils.ts"; // Assuming test-utils is usable here

// Mock function for the callback
let lastToggledId: string | null = null;
const mockOnToggleSelection = (modelId: string) => {
  lastToggledId = modelId;
};

Deno.test("ModelCard - Renders correctly", () => {
  const testModel: ModelDefinition = createMockModel("test-render", {
    name: "Render Test Model",
    description: "Checks basic rendering",
  });

  render(
    <ModelCard
      model={testModel}
      isSelected={false}
      onToggleSelection={mockOnToggleSelection}
    />,
    { container: document.body, baseElement: document.body },
  );

  // Check if model name and description are rendered
  assertExists(screen.getByText("Render Test Model"));
  assertExists(screen.getByText("Checks basic rendering"));

  // TODO: Add checks for characteristics, tags, etc.
});

Deno.test("ModelCard - Handles selection state", () => {
  const testModel: ModelDefinition = createMockModel("test-select");

  // Render not selected
  const { rerender } = render(
    <ModelCard
      model={testModel}
      isSelected={false}
      onToggleSelection={mockOnToggleSelection}
    />,
    { container: document.body, baseElement: document.body },
  );
  const _cardElement = screen.getByRole("button"); // Prefix unused var
  // TODO: Check for absence of selection class (e.g., 'border-blue-400')
  // This might require setting up DOM testing library matchers
  // Example (conceptual):
  // expect(cardElement).not.toHaveClass('border-blue-400');

  // Rerender as selected
  rerender(
    <ModelCard
      model={testModel}
      isSelected
      onToggleSelection={mockOnToggleSelection}
    />,
    { container: document.body, baseElement: document.body },
  );
  // TODO: Check for presence of selection class (e.g., 'border-blue-400')
  // Example (conceptual):
  // expect(cardElement).toHaveClass('border-blue-400');
});

Deno.test("ModelCard - Fires toggle callback on click", () => {
  const testModel: ModelDefinition = createMockModel("test-click", {
    name: "Click Test Model",
  });
  lastToggledId = null; // Reset mock state

  render(
    <ModelCard
      model={testModel}
      isSelected={false}
      onToggleSelection={mockOnToggleSelection}
    />,
    { container: document.body, baseElement: document.body },
  );

  const cardElement =
    screen.getByText("Click Test Model").closest("div[role='button']") ||
    screen.getByRole("button"); // Find clickable element
  assertExists(cardElement, "Card element should be found");

  if (cardElement) {
    fireEvent.click(cardElement);
    assertEquals(
      lastToggledId,
      "test-click",
      "onToggleSelection should be called with correct ID",
    );
  } else {
    throw new Error("Could not find clickable card element");
  }
});

// Helper to check if testing libraries are available
// This won't run in production, just a meta-check for setup
// try {
//     require.resolve("@testing-library/react");
//     console.log("@testing-library/react seems available.");
// } catch (e) {
//     console.warn(
//         "Warning: @testing-library/react might not be installed or configured correctly for Deno.",
//         "Please ensure it's in your import map or dependencies."
//     );
// }
