# Time Series Forecasting Platform

[![codecov](https://codecov.io/github/sm4rtm4art/TimeSeries_Frontend/graph/badge.svg?token=F3TO61yJUZ)](https://codecov.io/github/sm4rtm4art/TimeSeries_Frontend)
[![GitHub license](https://img.shields.io/github/license/sm4rtm4art/TimeSeries_Frontend)](https://github.com/sm4rtm4art/TimeSeries_Frontend/blob/main/LICENSE)
[![Deno](https://img.shields.io/badge/deno-v2.0-blue.svg)](https://deno.land)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

<!-- [![CI](https://github.com/sm4rtm4art/TimeSeries_Frontend/actions/workflows/ci.yml/badge.svg)](https://github.com/sm4rtm4art/TimeSeries_Frontend/actions/workflows/ci.yml)  -->

## Overview

This frontend application provides an interface for time series forecasting with
support for multiple forecasting models like N-BEATS, Prophet, and TiDE. The
application follows SOLID principles and uses a flexible component architecture
to allow easy addition of new models.

## Features

- Flexible model registry system for adding new forecasting models
- Dynamic parameter configuration for each model type
- Model training workflow with real-time progress tracking
- Dataset selection and management
- Clean, modern UI with dark mode support
- TypeScript for improved type safety

## Real-time Updates

The application uses WebSockets for real-time updates during model training:

- **Live Training Progress**: Watch training progress in real-time with detailed
  metrics
- **Resource Monitoring**: Monitor CPU and memory usage during training
- **Automatic Reconnection**: Handles connection issues with smart retry logic
- **Efficient Updates**: Optimized message protocol minimizes bandwidth usage

This real-time capability enables a responsive user experience when training
complex models that might take significant time to complete.

## Requirements

- Deno 2.0 or higher

## Installation

### Automatic Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/TimeSeries_Frontend.git
cd TimeSeries_Frontend
```

2. Run the setup script:

```bash
./setup.sh
```

### Manual Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/TimeSeries_Frontend.git
cd TimeSeries_Frontend
```

2. Install Deno (if not already installed):

```bash
# For macOS
brew install deno

# For Linux
curl -fsSL https://deno.land/x/install/install.sh | sh
```

3. Cache dependencies:

```bash
deno cache --reload import_map.json
```

## Running the Application

### Development Server

Start the regular development server:

```bash
deno task dev
```

Start the local environment development server (with mocked data):

```bash
deno task dev:local
```

The application will be available at http://localhost:3000.

### Environment Configuration

The project supports multiple environments:

- `local` - Local development with mocked data
- `development` - Development environment with test API
- `test` - Testing environment
- `production` - Production environment

To create custom environment configurations:

1. Copy `.env.example` to `.env.{environment}` (e.g., `.env.local`)
2. Modify the variables as needed

## Building for Production

Build the application for production:

```bash
deno task build
```

Start the production server:

```bash
deno task start
```

## Project Structure

- `/src` - Source code directory
  - `/app` - Next.js application files
  - `/components` - React components
  - `/hooks` - Custom React hooks
  - `/lib` - Utility functions and libraries
  - `/public` - Static assets
  - `/styles` - Global styles

## Testing Strategy

The project implements a comprehensive testing approach across multiple layers:

### Unit Testing

- Component testing with React Testing Library
- Model registry and utility function tests
- Type validation tests

### Integration Testing

- Component interaction testing
- API client testing with mock servers
- State management testing

### End-to-End Testing

- Critical user flow validation
- Backend integration testing
- WebSocket communication testing

### Performance Testing

- Rendering performance measurements
- Network operation optimizations
- Memory usage monitoring

**Note on Component Testing:** Currently, there are known issues running React
Testing Library tests for components (e.g., using `render`, `screen`) within the
`deno test` environment. These tests may fail type-checking or encounter runtime
errors related to DOM simulation. While non-component unit tests work correctly,
component testing within `deno test` might require workarounds (like
`--no-check`) or may need to be revisited pending updates to Deno or related
libraries.

Run tests with:

```bash
deno task test
```

## Technology Stack

- Deno 2.0 as the runtime
- Next.js 15
- React 19
- Tailwind CSS
- Radix UI Components
- Recharts for data visualization
- D3.js and Observable Plot for advanced visualizations

## Architecture

The application follows SOLID principles and uses several design patterns to
ensure maintainability and extensibility:

### Model Registry

The core of the application is a flexible model registry system that implements
the Factory pattern:

- **Dynamic Registration**: Models can be registered at runtime
- **Type Safety**: Strong TypeScript typing for all model definitions
- **Parameter Validation**: Automatic validation of model parameters
- **Extensibility**: New models can be added without modifying existing code

### Design Patterns

- **Factory Pattern**: Used for creating model instances
- **Strategy Pattern**: Applied for interchangeable forecasting algorithms
- **Observer Pattern**: Implemented for reactive UI updates
- **Adapter Pattern**: Used for backend API communication
- **Repository Pattern**: Applied for data access abstraction

### Component Architecture

- **Single Responsibility**: Each component has a clear, focused purpose
- **Composition over Inheritance**: Components are composed of smaller, reusable
  parts
- **Container/Presenter Pattern**: Separation of logic and presentation
- **Custom Hooks**: Encapsulation of reusable logic

## Why Deno?

- **Security**: Deno has a permissions system that provides greater security by
  default
- **TypeScript built-in**: No need for additional TypeScript configuration
- **Modern JavaScript**: First-class support for ESM and top-level await
- **Built-in tooling**: Includes testing, formatting, and linting out of the box
- **Node.js compatibility**: Deno 2.0 can use npm packages seamlessly
- **Improved performance**: Better runtime performance than Node.js

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Notes

### Linting Issues

The codebase currently has some linting issues that are being addressed
gradually:

1. **'any' type usage**: We're working on replacing `any` types with more
   specific types
2. **Unused variables**: Some variables are unused and should be prefixed with
   underscores
3. **Async functions without await**: Some async functions need await statements
   or should have the async keyword removed

To help fix these issues, run:

```bash
./fix-linting-issues.sh
```

During development, we've temporarily configured the pre-commit hooks to be more
lenient with these specific issues.

### Pre-commit configuration

The pre-commit hooks are configured in `.pre-commit-config.yaml`. We're
currently ignoring:

- `no-explicit-any`: allows `any` type for now
- `require-await`: allows async functions without await
- `no-unused-vars`: allows unused variables

In production code, these issues should be properly addressed.
