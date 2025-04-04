// Simple test runner for our test files
console.log("🧪 Running all tests...\n");

const testFiles = [
  "./simple-test.ts",
  "./unit/model-registry-standalone.test.ts",
  "./unit/model-parameter.test.ts",
];

// Helper to run a test file with proper error handling
async function runTestFile(filename: string): Promise<boolean> {
  console.log(`\n📋 Running tests in: ${filename}`);
  console.log("--------------------------------------------------");

  try {
    // Import and run the test file
    await import(filename);
    return true;
  } catch (error) {
    console.error(`❌ Error running ${filename}:`);
    console.error(error);
    return false;
  }
}

// Run all tests sequentially
async function runAllTests(): Promise<void> {
  let passedCount = 0;
  let failedCount = 0;

  for (const file of testFiles) {
    const passed = await runTestFile(file);
    if (passed) {
      passedCount++;
    } else {
      failedCount++;
    }
    console.log("--------------------------------------------------");
  }

  // Print summary
  console.log("\n🔍 Test Summary:");
  console.log(`Total test files: ${testFiles.length}`);
  console.log(`✅ Passed: ${passedCount}`);
  console.log(`❌ Failed: ${failedCount}`);

  if (failedCount === 0) {
    console.log("\n✨ All tests passed! ✨");
  } else {
    console.log("\n⚠️ Some tests failed, please check the errors above.");
    // Use Deno.exit if running in Deno context
    // @ts-ignore: Check for Deno global in a platform-agnostic way
    if (typeof Deno !== "undefined" && typeof Deno.exit === "function") {
      // @ts-ignore: Call Deno.exit if available
      Deno.exit(1); // Exit with error code if any tests failed
    } else {
      // Fallback for non-Deno environments if needed (e.g., throw error)
      // This might not be strictly necessary if only running tests via Deno
      throw new Error("Some tests failed");
    }
  }
}

// Run the tests
runAllTests();
