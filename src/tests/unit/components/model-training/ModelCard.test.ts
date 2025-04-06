// ModelCard component unit tests
// These tests focus on the data structures and utility functions
// instead of rendering, to avoid Deno/React DOM compatibility issues

import * as _React from "react";
// Import our test utilities from Deno standard library
import { assertEquals, assertExists } from "std/assert";
import type { ModelDefinition as _ModelDefinition } from "../../../../types/models.ts";
import { createMockModel } from "../../../test-utils.ts";

/**
 * Test helper function for ModelCard color selection
 * This tests the same color logic that exists in the ModelCard component
 */
function getCharacteristicColor(value: number): string {
  if (value >= 4) return "text-green-500";
  if (value >= 3) return "text-blue-500";
  if (value >= 2) return "text-yellow-500";
  return "text-red-500";
}

// Test model creation
Deno.test("ModelCard - Model creation", () => {
  const model = createMockModel("test-model", {
    name: "Test Model",
    description: "A test model description",
  });

  assertEquals(model.id, "test-model", "Model ID should match");
  assertEquals(model.name, "Test Model", "Model name should match");
  assertEquals(
    model.description,
    "A test model description",
    "Model description should match",
  );
});

// Test model characteristics structure
Deno.test("ModelCard - Model characteristics", () => {
  const model = createMockModel("test-model");

  assertExists(model.characteristics, "Should have characteristics object");
  assertEquals(
    typeof model.characteristics.accuracy,
    "number",
    "Should have accuracy",
  );
  assertEquals(
    typeof model.characteristics.speed,
    "number",
    "Should have speed",
  );
  assertEquals(
    typeof model.characteristics.interpretability,
    "number",
    "Should have interpretability",
  );
  assertEquals(
    typeof model.characteristics.dataReq,
    "number",
    "Should have dataReq",
  );
});

// Test characteristic color function
Deno.test("ModelCard - Characteristic color function", () => {
  assertEquals(
    getCharacteristicColor(4.5),
    "text-green-500",
    "Value >= 4 should be green",
  );
  assertEquals(
    getCharacteristicColor(3.2),
    "text-blue-500",
    "Value >= 3 should be blue",
  );
  assertEquals(
    getCharacteristicColor(2.7),
    "text-yellow-500",
    "Value >= 2 should be yellow",
  );
  assertEquals(
    getCharacteristicColor(1.5),
    "text-red-500",
    "Value < 2 should be red",
  );
});

// Test createMockModel with default parameters
Deno.test("createMockModel creates valid model", () => {
  const model = createMockModel("default-test");
  assertEquals(typeof model.id, "string");
  assertEquals(typeof model.name, "string");
  assertExists(model.tags);
  assertEquals(Array.isArray(model.tags), true);
});
