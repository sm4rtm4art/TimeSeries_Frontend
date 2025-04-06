/// <reference path="../types/react.d.ts" />
/// <reference path="../types/global.d.ts" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

/**
 * This file helps Deno tests with correct type references
 * Import this at the top of every test file to ensure proper type definitions
 * for React, JSX, and DOM elements
 */

// Re-export types that tests might need
export type { ModelDefinition } from "../types/models.ts";

// Export test utilities
export {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
