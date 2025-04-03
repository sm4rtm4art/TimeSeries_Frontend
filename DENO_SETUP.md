# Deno Setup Guide

This document provides detailed instructions for setting up and running the
TimeSeries Frontend project with Deno 2.0.

## Installing Deno

### macOS

Using Homebrew:

```bash
brew install deno
```

### Linux

Using curl:

```bash
curl -fsSL https://deno.land/x/install/install.sh | sh
```

Add Deno to your path (add to your .bashrc or .zshrc):

```bash
export DENO_INSTALL="$HOME/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
```

### Windows

Using PowerShell:

```powershell
irm https://deno.land/install.ps1 | iex
```

## Verifying Installation

Check that Deno is correctly installed:

```bash
deno --version
```

You should see output similar to:

```
deno 2.x.x
v8 x.x.x
typescript x.x.x
```

## Project Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/TimeSeries_Frontend.git
cd TimeSeries_Frontend
```

2. Cache dependencies:

```bash
deno cache --reload import_map.json
```

## Running the Project

Start the development server:

```bash
deno task dev
```

The application will be available at http://localhost:3000.

## Troubleshooting

### Permission Errors

If you encounter permission errors, Deno's security model requires explicit
permissions. The tasks in deno.json already include the necessary permissions,
but if you're running custom commands, you might need to add relevant permission
flags.

### npm Compatibility

If you encounter issues with npm modules, ensure you have the latest version of
Deno, as Deno 2.0 has significantly improved npm compatibility.

### Path Resolution Issues

If you encounter module resolution issues, check the import_map.json file to
ensure the paths are correctly configured.

## Additional Resources

- [Deno Official Documentation](https://deno.land/manual)
- [Using npm Packages with Deno](https://deno.land/manual@v2.0.0/node/npm_specifiers)
