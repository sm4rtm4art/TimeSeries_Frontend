/**
 * Test utilities for the time series forecasting platform.
 * This file contains helper functions and utilities for testing components,
 * hooks, and other parts of the application.
 */

// Importing types for assertions - we'll implement these ourselves for browser compatibility
import { ModelDefinition, ModelParameter } from "../types/models.ts";

// Simple assertion utilities that work in both Deno and browser environments
export const assert = (condition: boolean, message?: string): void => {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
};

export const assertEquals = <T>(
  actual: T,
  expected: T,
  message?: string,
): void => {
  // Use JSON stringify for a basic deep comparison for objects/arrays
  if (
    typeof actual === "object" && actual !== null &&
    typeof expected === "object" && expected !== null
  ) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(
        message ||
          `Expected ${JSON.stringify(expected)} but got ${
            JSON.stringify(actual)
          }`,
      );
    }
  } else if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
};

export const assertNotEquals = <T>(
  actual: T,
  expected: T,
  message?: string,
): void => {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    throw new Error(
      message ||
        `Expected ${JSON.stringify(actual)} not to equal ${
          JSON.stringify(expected)
        }`,
    );
  }
};

export const assertThrows = (
  fn: () => void,
  errorType?: ErrorConstructor, // Make errorType optional for simple message checks
  messageIncludes?: string,
): void => {
  let error: Error | null = null;
  let thrownValue: unknown = null;
  try {
    fn();
  } catch (e) {
    thrownValue = e;
    if (e instanceof Error) {
      error = e;
    }
  }
  if (!error) {
    throw new Error("Expected function to throw an error, but it did not");
  }
  if (errorType && !(error instanceof errorType)) {
    // Improved error reporting for non-Error types thrown
    let thrownTypeName = typeof thrownValue;
    // Safely check for constructor and name property before accessing
    // Use Object.prototype.hasOwnProperty.call for safety
    if (
      thrownValue !== null &&
      typeof thrownValue === "object" &&
      Object.prototype.hasOwnProperty.call(thrownValue, "constructor") && // Use safe hasOwnProperty check
      typeof (thrownValue as { constructor: unknown }).constructor ===
        "function" && // Check if constructor is a function
      typeof (thrownValue as { constructor: { name?: string } }).constructor
          .name === "string"
    ) {
      thrownTypeName =
        (thrownValue as { constructor: { name: string } }).constructor.name;
    }
    throw new Error(
      `Expected error to be of type ${errorType.name}, but got ${thrownTypeName}`,
    );
  }
  if (messageIncludes && !error.message.includes(messageIncludes)) {
    throw new Error(
      `Expected error message to include "${messageIncludes}", but got "${error.message}"`,
    );
  }
};

export const assertExists = <T>(
  value: T | null | undefined,
  message?: string,
): T => {
  if (value === null || value === undefined) {
    throw new Error(
      message || "Expected value to exist, but got null or undefined",
    );
  }
  return value;
};

/**
 * Creates a mock model definition for testing
 * @param id - The model ID
 * @param overrides - Optional overrides for the model definition
 * @returns A mock model definition with default values
 */
export function createMockModel(
  id: string,
  overrides: Partial<ModelDefinition> = {},
): ModelDefinition {
  return {
    id,
    name: `Test Model ${id}`,
    description: "A test model for testing purposes",
    tags: ["test", "mock"],
    characteristics: {
      accuracy: 3,
      speed: 3,
      interpretability: 3,
      dataReq: 3,
    },
    bestFor: ["Testing", "Mocking"],
    parameters: [
      createMockParameter("param1", "Parameter 1", "number"),
      createMockParameter("param2", "Parameter 2", "boolean"),
    ],
    ...overrides,
  };
}

/**
 * Creates a mock parameter for testing
 * @param id - The parameter ID
 * @param name - The parameter name
 * @param type - The parameter type
 * @param overrides - Optional overrides for the parameter
 * @returns A mock parameter with default values
 */
export function createMockParameter(
  id: string,
  name: string,
  type: ModelParameter["type"],
  overrides: Partial<Omit<ModelParameter, "id" | "name" | "type">> = {},
): ModelParameter {
  switch (type) {
    case "number":
      return {
        id,
        name,
        type,
        defaultValue: 0,
        min: 0,
        max: 100,
        step: 1,
        ...overrides,
      };
    case "boolean":
      return {
        id,
        name,
        type,
        defaultValue: false,
        ...overrides,
      };
    case "select":
      return {
        id,
        name,
        type,
        defaultValue: "option1",
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
          { label: "Option 3", value: "option3" },
        ],
        ...overrides,
      };
    case "slider":
      return {
        id,
        name,
        type,
        defaultValue: 50,
        min: 0,
        max: 100,
        step: 1,
        ...overrides,
      };
    case "string":
      return {
        id,
        name,
        type,
        defaultValue: "",
        ...overrides,
      };
  }
}

/**
 * Custom assertions for testing our application
 */
export const customAssert = {
  /**
   * Assert that a model definition has all required properties
   * @param model - The model to check
   */
  isValidModelDefinition(model: ModelDefinition): void {
    assertExists(model.id, "Model should have an ID");
    assertExists(model.name, "Model should have a name");
    assertExists(model.description, "Model should have a description");
    assert(Array.isArray(model.tags), "Model tags should be an array");
    assert(Array.isArray(model.bestFor), "Model bestFor should be an array");
    assert(
      Array.isArray(model.parameters),
      "Model parameters should be an array",
    );

    // Check characteristics
    assertExists(model.characteristics, "Model should have characteristics");
    assertExists(
      model.characteristics.accuracy,
      "Model should have accuracy characteristic",
    );
    assertExists(
      model.characteristics.speed,
      "Model should have speed characteristic",
    );
    assertExists(
      model.characteristics.interpretability,
      "Model should have interpretability characteristic",
    );
    assertExists(
      model.characteristics.dataReq,
      "Model should have dataReq characteristic",
    );
  },

  /**
   * Assert that all properties in a model match expected values
   * @param actual - The actual model
   * @param expected - The expected model values
   */
  modelEquals(actual: ModelDefinition, expected: ModelDefinition): void {
    assertEquals(actual.id, expected.id, "Model IDs should match");
    assertEquals(actual.name, expected.name, "Model names should match");
    assertEquals(
      actual.description,
      expected.description,
      "Model descriptions should match",
    );
    // Use assertEquals with JSON stringify for deep comparison of arrays/objects
    assertEquals(actual.tags, expected.tags, "Model tags should match");
    assertEquals(
      actual.bestFor,
      expected.bestFor,
      "Model bestFor should match",
    );
    assertEquals(
      actual.characteristics,
      expected.characteristics,
      "Model characteristics should match",
    );

    // Parameters may have additional properties, so check the length and IDs
    assertEquals(
      actual.parameters.length,
      expected.parameters.length,
      "Model parameters length should match",
    );

    for (let i = 0; i < actual.parameters.length; i++) {
      assertEquals(
        actual.parameters[i].id,
        expected.parameters[i].id,
        `Parameter ${i} IDs should match`,
      );
    }
  },
};

/**
 * Mocks a component's props for testing
 * @param baseProps - The base props to use
 * @param overrides - Optional overrides for specific props
 * @returns The merged props
 */
export function mockProps<T extends Record<string, unknown>>(
  baseProps: T,
  overrides: Partial<T> = {},
): T {
  return {
    ...baseProps,
    ...overrides,
  };
}
