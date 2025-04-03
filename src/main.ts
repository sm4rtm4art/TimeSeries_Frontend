import { serve } from "https://deno.land/std@0.220.1/http/server.ts";

// Function to handle requests
async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);

  // Serve static files from the public directory
  if (url.pathname.startsWith("/static/")) {
    try {
      const filePath = url.pathname.replace("/static/", "public/");
      const file = await Deno.readFile(filePath);

      // Simple MIME type detection
      const contentType = filePath.endsWith(".html")
        ? "text/html"
        : filePath.endsWith(".css")
        ? "text/css"
        : filePath.endsWith(".js")
        ? "application/javascript"
        : filePath.endsWith(".json")
        ? "application/json"
        : filePath.endsWith(".png")
        ? "image/png"
        : filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")
        ? "image/jpeg"
        : "application/octet-stream";

      return new Response(file, {
        headers: { "content-type": contentType },
      });
    } catch {
      return new Response("File not found", { status: 404 });
    }
  }

  // Default response for the homepage
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>TimeSeries Frontend</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
          line-height: 1.6;
        }
        h1 { margin-bottom: 1em; }
      </style>
    </head>
    <body>
      <h1>TimeSeries Frontend</h1>
      <p>This site is currently under construction. Please check back later.</p>
      <p>This is a Deno Deploy application.</p>
    </body>
    </html>
  `,
    {
      headers: { "content-type": "text/html" },
    },
  );
}

// Start the server
console.log("Server is running on http://localhost:8000");
serve(handler, { port: 8000 });
