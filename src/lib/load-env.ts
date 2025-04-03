/**
 * Environment variables loader
 * Loads .env files based on the current environment
 */

// Load environment variables from .env file
export async function loadEnv(environment = "development") {
  try {
    // @ts-ignore - Deno.env is available at runtime
    const currentEnv = Deno.env.get("ENVIRONMENT") || environment;

    // Load appropriate .env file
    const envFile = `.env.${currentEnv}`;

    try {
      // @ts-ignore - Deno types
      await Deno.readTextFile(envFile)
        .then((content: string) => {
          const envVars = parseEnvFile(content);
          for (const [key, value] of Object.entries(envVars)) {
            // @ts-ignore - Deno types
            Deno.env.set(key, value);
          }
          console.log(`Loaded environment variables from ${envFile}`);
        })
        .catch(() => {
          // Try to load .env file if specific environment file is not found
          return loadDefaultEnv();
        });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : String(error);
      console.error(`Error loading environment variables: ${errorMessage}`);
      await loadDefaultEnv();
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Environment setup error: ${errorMessage}`);
  }
}

// Load default .env file
async function loadDefaultEnv() {
  try {
    // @ts-ignore - Deno types
    const content = await Deno.readTextFile(".env");
    const envVars = parseEnvFile(content);
    for (const [key, value] of Object.entries(envVars)) {
      // @ts-ignore - Deno types
      Deno.env.set(key, value);
    }
    console.log("Loaded environment variables from .env");
  } catch (error) {
    console.warn("No .env file found, using default environment variables");
  }
}

// Parse .env file content
function parseEnvFile(content: string): Record<string, string> {
  const result: Record<string, string> = {};

  const lines = content.split("\n");
  for (const line of lines) {
    // Skip comments and empty lines
    if (line.trim().startsWith("#") || line.trim() === "") {
      continue;
    }

    const equalSignPos = line.indexOf("=");
    if (equalSignPos !== -1) {
      const key = line.slice(0, equalSignPos).trim();
      const value = line.slice(equalSignPos + 1).trim();
      if (key && value) {
        result[key] = value;
      }
    }
  }

  return result;
}
