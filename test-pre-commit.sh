#!/bin/bash

echo "Testing pre-commit hooks..."

# Check if pre-commit is installed
if ! command -v pre-commit &> /dev/null; then
    echo "Error: pre-commit is not installed. Please run ./setup.sh first."
    exit 1
fi

# Show all hooks
echo "Configured hooks:"
pre-commit list-hooks

# Run against all files
echo -e "\nRunning pre-commit on all files:"
pre-commit run --all-files

echo -e "\nDone! If there were no errors, your pre-commit hooks are working correctly." 