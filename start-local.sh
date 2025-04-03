#!/bin/bash

# Check if Deno is installed
if ! command -v deno &> /dev/null; then
    echo "Deno is not installed. Please run setup.sh first."
    exit 1
fi

# Set environment to local
export ENVIRONMENT=local

# Check if npm dependencies are cached
echo "Checking npm dependencies..."
cd src
if ! deno cache --node-modules-dir=auto npm:next 2>/dev/null; then
    echo "Installing npm dependencies..."
    deno cache --node-modules-dir=auto --reload npm:next
    deno cache --node-modules-dir=auto --reload npm:react
    deno cache --node-modules-dir=auto --reload npm:react-dom
    deno cache --node-modules-dir=auto --reload npm:@observablehq/plot
    deno cache --node-modules-dir=auto --reload npm:d3
    deno cache --node-modules-dir=auto --reload npm:recharts
    deno cache --node-modules-dir=auto --reload npm:tailwindcss
    deno cache --node-modules-dir=auto --reload npm:postcss
    deno cache --node-modules-dir=auto --reload npm:autoprefixer
fi
cd ..

echo "Starting application in local environment..."
deno task dev:local 