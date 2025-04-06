# TypeScript in Deno + React Environment

This document outlines the TypeScript fixes that were applied to solve
compatibility issues between Deno and React in a JSX environment.

## Current Status

The application has two levels of type compatibility:

1. **Functional Tests**: All tests pass when run with
   `deno task test --no-check`
2. **Type Safety**: Most non-JSX code passes type checking, but JSX components
   still have some type errors due to Deno/React compatibility issues

## Main Issues & Solutions

### 1. JSX Type Errors

**Problem:** Deno's TypeScript environment doesn't fully recognize JSX elements,
resulting in errors like:

- `JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists`
- `This JSX tag requires the module path 'react/jsx-runtime' to exist`

**Solution:**

- Created custom declaration files:

  - `src/types/jsx.d.ts` - Defines JSX intrinsic elements
  - `src/types/jsx-runtime.d.ts` - Provides declarations for react/jsx-runtime

- Added reference directives to components:

  ```typescript
  /// <reference path="../types/jsx.d.ts" />
  /// <reference path="../types/jsx-runtime.d.ts" />
  ```

- Updated the import map to include JSX runtime modules:

  ```json
  "react/jsx-runtime": "npm:react/jsx-runtime",
  "react-jsx-runtime": "npm:react/jsx-runtime",
  "react-jsx-dev-runtime": "npm:react/jsx-dev-runtime"
  ```

### 2. File Extensions in Imports

**Problem:** Deno requires explicit file extensions in imports, unlike
Next.js/Node environment.

**Solution:**

- Added `.tsx` or `.ts` extensions to imports:

  ```typescript
  import { Badge } from "@/components/ui/badge.tsx";
  ```

- Added specific imports to the import map:
  ```json
  "@/lib/utils": "./src/lib/utils.ts"
  ```

### 3. Component Return Types

**Problem:** `JSX.Element` wasn't recognized in Deno environment.

**Solution:**

- Changed return type annotations to `React.ReactElement`:
  ```typescript
  export const Component = (): React.ReactElement => { ... }
  ```

### 4. Testing Approach

**Problem:** UI component tests using JSX had too many type issues in Deno.

**Solution:**

- Created simplified tests that focus on data structures and utility functions
- Avoided DOM testing in favor of functional tests
- Using `--no-check` flag for now to validate functionality while we work on
  full type support

## Pragmatic Approach for Deno/React Development

Given the current limitations in Deno's JSX/React support, we've taken a
pragmatic approach:

1. **Focus on Functionality**: Ensure all tests pass with `--no-check`
2. **Improve Type Coverage Gradually**: Fix type errors in non-UI code and basic
   component props
3. **Document Known Issues**: Maintain this document to track progress and known
   limitations
4. **Use Type References**: Add proper reference directives to help IDEs provide
   some type support

## Duplicate Components

There are currently two similar components with different names and locations:

1. `src/components/model-training/ModelCard.tsx`

   - Used for detailed model selection in training interface
   - Shows characteristic metrics

2. `src/components/model-card.tsx`
   - Simpler card with basic model information
   - Has configure button functionality

Future improvement should consider:

- Merging into a single component with flexible configuration
- Renaming for clarity (e.g., `ModelTrainingCard` vs `ModelSelectionCard`)
- Creating a base component that both extend

## Verification

Use the `scripts/verify-types.sh` script to check if the application is working
correctly:

```bash
./scripts/verify-types.sh
```

This script:

1. Runs tests with `--no-check` to verify functionality
2. Checks type compatibility of non-JSX test files
3. Provides a summary of the current status
