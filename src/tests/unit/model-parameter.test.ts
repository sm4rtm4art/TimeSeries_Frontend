// Model Parameter Tests - Using TypeScript
console.log("Running Model Parameter Tests...");

import { assert, assertEquals } from "../test-utils.ts";

// Define a simple Parameter type for testing purposes
interface TestParameter {
  id: string;
  name: string;
  type: "number" | "boolean" | "select" | "string" | "slider";
  defaultValue: string | number | boolean | null;
  min?: number;
  max?: number;
  step?: number;
  options?: Array<{ label: string; value: string | number | boolean }>;
}

// Mock parameter creator function to test
function createParameter(
  id: string,
  name: string,
  type: TestParameter["type"],
  overrides: Partial<TestParameter> = {},
): TestParameter {
  let parameterDefaults: Partial<Omit<TestParameter, "id" | "name" | "type">> =
    {};

  switch (type) {
    case "number":
      parameterDefaults = { defaultValue: 0, min: 0, max: 100, step: 1 };
      break;
    case "boolean":
      parameterDefaults = { defaultValue: false };
      break;
    case "select":
      parameterDefaults = { defaultValue: "", options: [] };
      break;
    case "slider":
      parameterDefaults = { defaultValue: 50, min: 0, max: 100, step: 1 };
      break;
    case "string":
      parameterDefaults = { defaultValue: "" };
      break;
    default: {
      const _exhaustiveCheck: never = type;
      throw new Error(`Unknown parameter type: ${_exhaustiveCheck}`);
    }
  }

  const finalParameter: TestParameter = {
    id,
    name,
    type,
    defaultValue: null, // Start with null, will be overwritten
    ...parameterDefaults,
    ...overrides,
  };

  // Ensure defaultValue is set correctly based on defaults/overrides
  if (overrides.defaultValue !== undefined) {
    finalParameter.defaultValue = overrides.defaultValue;
  } else if (parameterDefaults.defaultValue !== undefined) {
    finalParameter.defaultValue = parameterDefaults.defaultValue;
  }

  return finalParameter;
}

// Parameter validation function
function validateParameter(parameter: TestParameter): boolean {
  assert(!!parameter.id, "Parameter must have an ID");
  assert(!!parameter.name, "Parameter must have a name");
  assert(!!parameter.type, "Parameter must have a type");

  switch (parameter.type) {
    case "number":
    case "slider": {
      assert(
        typeof parameter.defaultValue === "number",
        `${parameter.type} parameter must have a number default value`,
      );
      assert(
        parameter.min !== undefined && parameter.max !== undefined,
        `${parameter.type} parameter must have min and max values`,
      );
      const numDefault = parameter.defaultValue as number;
      assert(
        numDefault >= parameter.min! && numDefault <= parameter.max!,
        `Default value must be between min and max values`,
      );
      break;
    }
    case "boolean": {
      assert(
        typeof parameter.defaultValue === "boolean",
        "Boolean parameter must have a boolean default value",
      );
      break;
    }
    case "select": {
      assert(
        Array.isArray(parameter.options),
        "Select parameter must have an options array",
      );
      parameter.options?.forEach((option) => {
        assert(
          typeof option === "object" && option !== null &&
            typeof option.label === "string" && option.value !== undefined,
          "Select options must be objects with label and value properties",
        );
      });
      break;
    }
    case "string": {
      assert(
        typeof parameter.defaultValue === "string",
        "String parameter must have a string default value",
      );
      break;
    }
    default: {
      const _exhaustiveCheck: never = parameter.type;
      throw new Error(`Unknown parameter type: ${_exhaustiveCheck}`);
    }
  }

  return true;
}

// Run the tests
try {
  console.log("Test: Create Number Parameter");
  const numberParam = createParameter(
    "num-param",
    "Number Parameter",
    "number",
  );
  assert(validateParameter(numberParam), "Number parameter should be valid");
  assertEquals(numberParam.type, "number", "Parameter type should be number");
  assertEquals(
    typeof numberParam.defaultValue,
    "number",
    "Default value should be a number",
  );
  console.log("✅ Passed: Number Parameter test");

  console.log("Test: Create Boolean Parameter");
  const boolParam = createParameter(
    "bool-param",
    "Boolean Parameter",
    "boolean",
  );
  assert(validateParameter(boolParam), "Boolean parameter should be valid");
  assertEquals(boolParam.type, "boolean", "Parameter type should be boolean");
  assertEquals(
    typeof boolParam.defaultValue,
    "boolean",
    "Default value should be a boolean",
  );
  console.log("✅ Passed: Boolean Parameter test");

  console.log("Test: Create Select Parameter");
  const selectParam = createParameter(
    "select-param",
    "Select Parameter",
    "select",
    {
      options: [
        { label: "Option 1", value: "option1" },
        { label: "Option 2", value: "option2" },
      ],
      defaultValue: "option1",
    },
  );
  assert(validateParameter(selectParam), "Select parameter should be valid");
  assertEquals(selectParam.type, "select", "Parameter type should be select");
  assertEquals(
    selectParam.options?.length,
    2,
    "Options array should have 2 items",
  );
  console.log("✅ Passed: Select Parameter test");

  console.log("Test: Create Slider Parameter");
  const sliderParam = createParameter(
    "slider-param",
    "Slider Parameter",
    "slider",
    {
      min: 10,
      max: 90,
      defaultValue: 50,
    },
  );
  assert(validateParameter(sliderParam), "Slider parameter should be valid");
  assertEquals(sliderParam.type, "slider", "Parameter type should be slider");
  assertEquals(sliderParam.min, 10, "Min value should be 10");
  assertEquals(sliderParam.max, 90, "Max value should be 90");
  console.log("✅ Passed: Slider Parameter test");

  console.log("Test: Parameter Validation - Default Outside Range");
  let invalidParam = createParameter(
    "invalid-param",
    "Invalid Parameter",
    "number",
    {
      min: 10,
      max: 20,
      defaultValue: 5,
    },
  );
  let validationFailed = false;
  try {
    validateParameter(invalidParam);
  } catch (error: unknown) {
    validationFailed = true;
    assert(
      error instanceof Error &&
        error.message.includes("Default value must be between"),
      "Should fail with range validation message",
    );
  }
  assert(
    validationFailed,
    "Validation should fail for default value outside range",
  );
  console.log("✅ Passed: Default Outside Range test");

  console.log("Test: Parameter Validation - Wrong Type");
  invalidParam = createParameter(
    "invalid-param",
    "Invalid Parameter",
    "boolean",
    {
      defaultValue: "not a boolean",
    },
  );
  validationFailed = false;
  try {
    validateParameter(invalidParam);
  } catch (error: unknown) {
    validationFailed = true;
    assert(
      error instanceof Error && error.message.includes("boolean default value"),
      "Should fail with type validation message",
    );
  }
  assert(
    validationFailed,
    "Validation should fail for wrong default value type",
  );
  console.log("✅ Passed: Wrong Type test");

  console.log("✅ All Model Parameter tests passed!");
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error("❌ Test failed:", error.message);
  } else {
    console.error("❌ Test failed with unknown error:", error);
  }
}
