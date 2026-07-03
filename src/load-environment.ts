/**
 * Environment loader script
 *
 * This script loads environment variables from .env files.
 * Can be run directly or imported in other modules.
 *
 * Usage:
 * deno run --allow-read --allow-env --allow-write load-environment.ts [environment]
 */

import { loadEnv } from "./lib/load-env.ts";
import { sanitizeForLog } from "./lib/sanitize-log.ts";

async function main() {
  try {
    // Get environment from command line args or default to development
    // @ts-ignore - Deno namespace will be available at runtime
    const args = Deno.args;
    const environment = args[0] || "development";

    console.log(`Loading environment: ${sanitizeForLog(environment)}`);
    await loadEnv(environment);
    console.log("Environment loaded successfully");
  } catch (error) {
    console.error("Failed to load environment:", sanitizeForLog(error));
  }
}

// Use dynamic import for checking if this is the main module
// This avoids top-level await and import.meta.main issues
// @ts-ignore - Deno runtime check
if (import.meta.main) {
  main().catch((error) => {
    console.error(
      `Unhandled error while loading environment: ${sanitizeForLog(error)}`,
    );
  });
}

export { loadEnv };
