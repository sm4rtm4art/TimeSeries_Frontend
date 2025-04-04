// Simple Model Registry Tests
console.log("Running Model Registry Tests...");

import { ModelDefinition } from "../../types/models.ts";
// Import necessary assertions from test-utils
import { assert, assertEquals, assertThrows } from "../test-utils.ts";

// Implement a simple version of the model registry for testing
class MockModelRegistry {
  private models: Map<string, ModelDefinition>;
  private static instance: MockModelRegistry | null = null;

  constructor() {
    this.models = new Map<string, ModelDefinition>();
  }

  static getInstance(): MockModelRegistry {
    if (!MockModelRegistry.instance) {
      MockModelRegistry.instance = new MockModelRegistry();
    }
    return MockModelRegistry.instance;
  }

  registerModel(model: ModelDefinition): void {
    if (this.models.has(model.id)) {
      throw new Error(
        `Model with ID ${model.id} already exists in the registry`,
      );
    }
    this.models.set(model.id, model);
  }

  getModel(id: string): ModelDefinition | undefined {
    return this.models.get(id);
  }

  getAllModels(): ModelDefinition[] {
    return Array.from(this.models.values());
  }

  getModelsByTag(tag: string): ModelDefinition[] {
    return this.getAllModels().filter((model) => model.tags.includes(tag));
  }

  hasModel(id: string): boolean {
    return this.models.has(id);
  }
}

// Helper to create test models
function createTestModel(
  id: string,
  tags: string[] = ["test"],
): ModelDefinition {
  return {
    id,
    name: `Test Model ${id}`,
    description: "A test model",
    tags,
    characteristics: {
      accuracy: 3,
      speed: 3,
      interpretability: 3,
      dataReq: 3,
    },
    bestFor: ["testing"],
    parameters: [], // Keep parameters simple for this test file
  };
}

// Run tests
try {
  console.log("Test: MockModelRegistry Singleton Pattern");
  const registry1 = MockModelRegistry.getInstance();
  const registry2 = MockModelRegistry.getInstance();
  assert(registry1 === registry2, "Registry should be a singleton");
  console.log("✅ Passed: Singleton test");

  console.log("Test: Register and Get Model");
  const registry = MockModelRegistry.getInstance();
  const testModel = createTestModel("standalone-test-model");
  registry.registerModel(testModel);
  const retrievedModel = registry.getModel("standalone-test-model");
  assert(
    retrievedModel !== undefined,
    "Retrieved model should not be undefined",
  );
  assertEquals(retrievedModel?.id, testModel.id, "Model IDs should match");
  assertEquals(
    retrievedModel?.name,
    testModel.name,
    "Model names should match",
  );
  console.log("✅ Passed: Register and Get Model test");

  console.log("Test: Register Duplicate Model");
  assertThrows(
    () => registry.registerModel(testModel), // Use the same testModel
    undefined, // No specific error type check needed here for simplicity
    "Model with ID standalone-test-model already exists",
  );
  console.log("✅ Passed: Register Duplicate Model test");

  console.log("Test: Get All Models");
  const initialCount = registry.getAllModels().length;
  const testModel2 = createTestModel("standalone-test-model-2");
  registry.registerModel(testModel2);
  const allModels = registry.getAllModels();
  assertEquals(
    allModels.length,
    initialCount + 1,
    "Model count should increase by 1",
  );
  const modelFound = allModels.some((model) =>
    model.id === "standalone-test-model-2"
  );
  assert(modelFound, "Newly added model should be in the list");
  console.log("✅ Passed: Get All Models test");

  console.log("Test: Get Models By Tag");
  const tagModel1 = createTestModel("standalone-tag-test-1", [
    "special-tag",
    "common-tag",
  ]);
  const tagModel2 = createTestModel("standalone-tag-test-2", ["common-tag"]);
  registry.registerModel(tagModel1);
  registry.registerModel(tagModel2);

  const specialTagModels = registry.getModelsByTag("special-tag");
  const commonTagModels = registry.getModelsByTag("common-tag");

  assertEquals(
    specialTagModels.length,
    1,
    "Special tag should return one model",
  );
  assertEquals(
    specialTagModels[0]?.id,
    "standalone-tag-test-1",
    "Special tag should return first model",
  );

  assert(
    commonTagModels.length >= 2,
    "Common tag should return at least 2 models",
  );
  const hasModel1 = commonTagModels.some((model) =>
    model.id === "standalone-tag-test-1"
  );
  const hasModel2 = commonTagModels.some((model) =>
    model.id === "standalone-tag-test-2"
  );
  assert(hasModel1 && hasModel2, "Common tag should return both models");
  console.log("✅ Passed: Get Models By Tag test");

  console.log("✅ All Mock Model Registry tests passed!");
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error("❌ Test failed:", error.message);
  } else {
    console.error("❌ Test failed with unknown error:", error);
  }
}
