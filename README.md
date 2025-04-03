# TimeSeries Frontend

A modern, interactive frontend for time series forecasting with multiple models
and interactive visualizations, powered by Deno 2.0.

## Features

- Interactive dashboard for time series data visualization and forecasting
- Support for multiple forecasting models (N-BEATS, Prophet, TiDE, TSMixer)
- Data management with quality analysis and preparation tools
- Model configuration and training interface
- Forecasting workspace with customizable parameters
- Results analysis with performance metrics and visualizations

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

## Technology Stack

- Deno 2.0 as the runtime
- Next.js 15
- React 19
- Tailwind CSS
- Radix UI Components
- Recharts for data visualization
- D3.js and Observable Plot for advanced visualizations

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
