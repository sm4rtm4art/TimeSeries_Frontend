# Local Environment Setup

This document provides a detailed guide on setting up and using the local development environment for the TimeSeries Frontend project.

## Overview

The local environment is designed for:

- Fast development without external dependencies
- Using mock data instead of real API calls
- Testing new features in isolation
- Quick iterations without affecting others

## Setup

### 1. Environment Configuration

The local environment uses the `.env.local` file for configuration. This file is already included in the repository, but you can customize it:

```bash
ENVIRONMENT=local
API_URL=http://localhost:8000
DEBUG=true
MOCK_DATA=true
MAX_DATA_POINTS=5000
```

### 2. Running the Local Environment

You can start the local environment in two ways:

**Using the helper script:**

```bash
./start-local.sh
```

**Using Deno tasks:**

```bash
deno task dev:local
```

The application will be available at http://localhost:3000.

## Features of the Local Environment

### 1. Mock Data

In local mode, the application uses mock data instead of making real API calls. This allows for:

- Working without an active backend
- Testing various data scenarios
- Faster development cycles

The mock data is located in `src/lib/mock-data/`.

### 2. Debug Mode

Local environment enables debug mode by default, which provides:

- Detailed console logging
- Error details in the UI
- Performance metrics

### 3. Hot Reloading

Changes to files are immediately reflected in the browser thanks to Deno's watch mode.

## Environment Variables

Here are the key environment variables used in local mode:

| Variable        | Description               | Default in Local      |
| --------------- | ------------------------- | --------------------- |
| ENVIRONMENT     | Current environment       | local                 |
| API_URL         | URL for API calls         | http://localhost:8000 |
| DEBUG           | Enable debug mode         | true                  |
| MOCK_DATA       | Use mock data             | true                  |
| MAX_DATA_POINTS | Max data points to render | 5000                  |

## Troubleshooting

### Common Issues

1. **Deno Not Found**

   - Make sure Deno is installed: `deno --version`
   - If not installed, run ./setup.sh

2. **Permission Errors**

   - Deno requires explicit permissions
   - The task commands already include necessary permissions

3. **Environment Not Loading**
   - Check if .env.local exists
   - Make sure start-local.sh is executable: `chmod +x start-local.sh`

### Debugging Tips

1. Check the console for environment loading messages
2. Verify environment with: `deno run --allow-env -e "console.log(Deno.env.get('ENVIRONMENT'))"`
3. Use the browser's developer tools to see network requests and console output
