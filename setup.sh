#!/bin/bash

# Check if Deno is installed
if ! command -v deno &> /dev/null; then
    echo "Deno is not installed. Would you like to install it now? (y/n)"
    read answer
    if [ "$answer" = "y" ]; then
        echo "Installing Deno..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            brew install deno
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl -fsSL https://deno.land/x/install/install.sh | sh
        else
            echo "Please install Deno manually: https://deno.land/#installation"
            exit 1
        fi
    else
        echo "Please install Deno and run this script again."
        exit 1
    fi
fi

# Check Deno version
DENO_VERSION=$(deno --version | grep "deno" | cut -d' ' -f2 | cut -d'.' -f1)
if [ "$DENO_VERSION" -lt 2 ]; then
    echo "Deno version 2.0 or higher is required. Current version: $(deno --version | grep 'deno')"
    echo "Please upgrade Deno and run this script again."
    exit 1
fi

# Check if pre-commit is installed
if ! command -v pre-commit &> /dev/null; then
    echo "pre-commit is not installed. Would you like to install it now? (y/n)"
    read answer
    if [ "$answer" = "y" ]; then
        echo "Installing pre-commit..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            brew install pre-commit
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            pip install pre-commit
        else
            echo "Please install pre-commit manually: https://pre-commit.com/#installation"
            exit 1
        fi
    else
        echo "Please install pre-commit and run this script again."
        exit 1
    fi
fi

echo "Setting up the project..."

# Install npm dependencies for Deno
echo "Installing npm dependencies..."
cd src
deno cache --node-modules-dir=auto --reload npm:next
deno cache --node-modules-dir=auto --reload npm:react
deno cache --node-modules-dir=auto --reload npm:react-dom
deno cache --node-modules-dir=auto --reload npm:@observablehq/plot
deno cache --node-modules-dir=auto --reload npm:d3
deno cache --node-modules-dir=auto --reload npm:recharts
deno cache --node-modules-dir=auto --reload npm:tailwindcss
deno cache --node-modules-dir=auto --reload npm:postcss
deno cache --node-modules-dir=auto --reload npm:autoprefixer
cd ..

echo "Caching import map..."
deno cache --node-modules-dir=auto --reload import_map.json

# Install pre-commit hooks
echo "Setting up pre-commit hooks..."
pre-commit install

echo "Setup completed successfully!"
echo "To start the development server, run: deno task dev" 