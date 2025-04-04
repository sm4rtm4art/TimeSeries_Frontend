/// <reference lib="deno.ns" />

import {
  assertEquals,
  assertExists,
  assertThrows,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { ModelRegistry } from "../../lib/model-registry.ts";
import { createMockModel, customAssert } from "../test-utils.ts";
import { ModelDefinition } from "../../types/models.ts";

Deno.test("ModelRegistry - Singleton Pattern", () => {
  const registry1 = ModelRegistry.getInstance();
  const registry2 = ModelRegistry.getInstance();
  assertEquals(registry1, registry2, "Registry should be a singleton");
});

Deno.test("ModelRegistry - Register and Get Model", () => {
  const registry = ModelRegistry.getInstance();
  const testModel = createMockModel("test-model-new"); // Use a unique ID
  registry.registerModel(testModel);
  const retrievedModel = registry.getModel("test-model-new");

  // Use Deno's assertExists first
  assertExists(retrievedModel, "Model should exist after registration");

  // Now that assertExists passed, retrievedModel is known to be ModelDefinition
  customAssert.isValidModelDefinition(retrievedModel);
  customAssert.modelEquals(retrievedModel, testModel);
});

Deno.test("ModelRegistry - Register Duplicate Model", () => {
  const registry = ModelRegistry.getInstance();
  const testModel = createMockModel("duplicate-model-main");
  registry.registerModel(testModel);
  // Use Deno's assertThrows
  assertThrows(
    () => registry.registerModel(testModel),
    Error,
    "Model with ID duplicate-model-main already exists in the registry",
  );
});

Deno.test("ModelRegistry - Get All Models", () => {
  const registry = ModelRegistry.getInstance();
  const initialCount = registry.getAllModels().length;
  const testModel = createMockModel("get-all-test-main");
  registry.registerModel(testModel);
  const allModels = registry.getAllModels();
  assertEquals(
    allModels.length,
    initialCount + 1,
    "Model count should increase by 1",
  );
  const modelFound = allModels.some((model: ModelDefinition) =>
    model.id === "get-all-test-main"
  );
  assertEquals(modelFound, true, "Newly added model should be in the list");
});

Deno.test("ModelRegistry - Get Models By Tag", () => {
  const registry = ModelRegistry.getInstance();
  const model1 = createMockModel("tag-test-main-1", {
    tags: ["special-tag-main", "common-tag-main"],
  });
  const model2 = createMockModel("tag-test-main-2", {
    tags: ["common-tag-main"],
  });
  registry.registerModel(model1);
  registry.registerModel(model2);
  const specialTagModels = registry.getModelsByTag("special-tag-main");
  const commonTagModels = registry.getModelsByTag("common-tag-main");
  assertEquals(
    specialTagModels.length,
    1,
    "Special tag should return one model",
  );
  assertEquals(
    specialTagModels[0].id,
    "tag-test-main-1",
    "Special tag should return model1",
  );
  assertEquals(
    commonTagModels.length >= 2,
    true,
    "Common tag should return at least 2 models",
  );
  const hasModel1 = commonTagModels.some((model: ModelDefinition) =>
    model.id === "tag-test-main-1"
  );
  const hasModel2 = commonTagModels.some((model: ModelDefinition) =>
    model.id === "tag-test-main-2"
  );
  assertEquals(
    hasModel1 && hasModel2,
    true,
    "Common tag should return both models",
  );
});

Deno.test("ModelRegistry - Create Model Definition", () => {
  const registry = ModelRegistry.getInstance();
  const newModel = registry.createModelDefinition(
    "created-model-main",
    "Created Model Main",
  );
  assertEquals(newModel.id, "created-model-main", "Model ID should match");
  assertEquals(newModel.name, "Created Model Main", "Model name should match");
  customAssert.isValidModelDefinition(newModel);
});

Deno.test("ModelRegistry - Create Parameter", () => {
  const registry = ModelRegistry.getInstance();
  const numberParam = registry.createParameter(
    "num-param-main",
    "Number Parameter",
    "number",
  );
  const booleanParam = registry.createParameter(
    "bool-param-main",
    "Boolean Parameter",
    "boolean",
  );
  const selectParam = registry.createParameter(
    "select-param-main",
    "Select Parameter",
    "select",
  );
  const sliderParam = registry.createParameter(
    "slider-param-main",
    "Slider Parameter",
    "slider",
  );
  const stringParam = registry.createParameter(
    "string-param-main",
    "String Parameter",
    "string",
  );
  assertEquals(
    numberParam.type,
    "number",
    "Number parameter should have number type",
  );
  assertEquals(
    booleanParam.type,
    "boolean",
    "Boolean parameter should have boolean type",
  );
  assertEquals(
    selectParam.type,
    "select",
    "Select parameter should have select type",
  );
  assertEquals(
    sliderParam.type,
    "slider",
    "Slider parameter should have slider type",
  );
  assertEquals(
    stringParam.type,
    "string",
    "String parameter should have string type",
  );
  assertEquals(
    typeof numberParam.defaultValue,
    "number",
    "Number parameter should have number default",
  );
  assertEquals(
    typeof booleanParam.defaultValue,
    "boolean",
    "Boolean parameter should have boolean default",
  );
  assertEquals(
    Array.isArray(selectParam.options),
    true,
    "Select parameter should have options array",
  );
  assertEquals(
    typeof sliderParam.min,
    "number",
    "Slider parameter should have min value",
  );
  assertEquals(
    typeof sliderParam.max,
    "number",
    "Slider parameter should have max value",
  );
  assertEquals(
    typeof stringParam.defaultValue,
    "string",
    "String parameter should have string default",
  );
});
