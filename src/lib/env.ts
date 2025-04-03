/**
 * Environment configuration management
 * Loads appropriate environment variables based on current environment
 */

// Define environment types
export type Environment = "development" | "production" | "test" | "local";

// Get current environment
export function getEnvironment(): Environment {
  try {
    // @ts-ignore - Deno namespace will be available at runtime
    return (Deno.env.get("ENVIRONMENT") || "development") as Environment;
  } catch {
    // Fallback for environments where Deno.env is not available
    return "development";
  }
}

// Environment-specific configuration
interface EnvConfig {
  apiUrl: string;
  debug: boolean;
  cacheTTL: number;
  maxDataPoints: number;
}

// Configuration for different environments
const configs: Record<Environment, EnvConfig> = {
  local: {
    apiUrl: "http://localhost:8000",
    debug: true,
    cacheTTL: 0, // No cache in local development
    maxDataPoints: 5000,
  },
  development: {
    apiUrl: "https://dev-api.example.com",
    debug: true,
    cacheTTL: 300, // 5 minutes
    maxDataPoints: 5000,
  },
  test: {
    apiUrl: "https://test-api.example.com",
    debug: false,
    cacheTTL: 300,
    maxDataPoints: 5000,
  },
  production: {
    apiUrl: "https://api.example.com",
    debug: false,
    cacheTTL: 3600, // 1 hour
    maxDataPoints: 10000,
  },
};

// Get configuration for current environment
export function getConfig(): EnvConfig {
  const env = getEnvironment();
  return configs[env];
}

// For debugging purposes
export function logEnvironmentInfo() {
  const env = getEnvironment();
  const config = getConfig();

  console.log(`Environment: ${env}`);
  console.log("Configuration:", config);
}
