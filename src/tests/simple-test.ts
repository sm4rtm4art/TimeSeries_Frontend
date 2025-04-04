// Simple test script to verify our testing setup
console.log("Running simple test...");

import { assertEquals, assertNotEquals } from "./test-utils.ts";

// Test a simple function - Overload for number and string
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number | string, b: number | string): number | string {
  // Perform type check for actual operation
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  }
  if (typeof a === "string" && typeof b === "string") {
    return a + b;
  }
  throw new Error("Invalid types for add function");
}

// Run tests
try {
  console.log("Testing addition...");
  assertEquals(add(1, 2), 3, "1 + 2 should equal 3");
  assertEquals(add(-1, 1), 0, "-1 + 1 should equal 0");
  assertEquals(add(0, 0), 0, "0 + 0 should equal 0");

  console.log("Testing string concatenation...");
  assertEquals(
    add("hello", " world"),
    "hello world",
    "String concatenation works",
  );

  console.log("Testing that assertions fail when they should...");
  let failedAsExpected = false;

  try {
    assertNotEquals(2, 2, "This should fail");
  } catch (_error: unknown) { // Use unknown for catch variable
    failedAsExpected = true;
    console.log("Assertion failed as expected!");
  }

  if (!failedAsExpected) {
    throw new Error("Test failed: assertion should have failed but didn't");
  }

  console.log("✅ All tests passed!");
} catch (error: unknown) { // Use unknown for catch variable
  if (error instanceof Error) {
    console.error("❌ Test failed:", error.message);
  } else {
    console.error("❌ Test failed with unknown error type");
  }
}
