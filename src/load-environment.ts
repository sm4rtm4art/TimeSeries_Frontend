/**
 * Environment loader script
 *
 * This script loads environment variables from .env files.
 * Can be run directly or imported in other modules.
 *
 * Usage:
 * deno run --allow-read --allow-env --allow-write load-environment.ts [environment]
 */

// Using relative import without .ts extension for compatibility
import { loadEnv } from "./lib/load-env";

async function main() {
  try {
    // Get environment from command line args or default to development
    // @ts-ignore - Deno namespace will be available at runtime
    const args = Deno.args;
    const environment = args[0] || "development";

    console.log(`Loading environment: ${environment}`);
    await loadEnv(environment);
    console.log("Environment loaded successfully");
  } catch (_error) {
    console.error("Failed to load environment:", error);
  }
}

// Use dynamic import for checking if this is the main module
// This avoids top-level await and import.meta.main issues
// @ts-ignore - Deno runtime check
if (import.meta.main) {
  main().catch(console.error);
}

export { loadEnv };
