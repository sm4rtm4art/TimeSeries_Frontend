/**
 * Utility to determine whether to use mock data
 * Will check environment and configuration flags
 */

import { getEnvironment } from "./env";

// Check if we should use mock data
export function shouldUseMockData(): boolean {
  try {
    // First check: direct environment variable
    // @ts-ignore - Deno is available at runtime
    const mockDataFlag = Deno.env.get("MOCK_DATA");
    if (mockDataFlag && mockDataFlag.toLowerCase() === "true") {
      return true;
    }

    // Second check: are we in local environment?
    const env = getEnvironment();
    if (env === "local") {
      return true;
    }

    // Default to false for production and other environments
    return false;
  } catch (error) {
    // In case Deno.env is not available or there's another error
    // Default to local development behavior
    console.warn(
      "Error checking mock data status, defaulting to mock data:",
      error,
    );
    return true;
  }
}

export default shouldUseMockData;
