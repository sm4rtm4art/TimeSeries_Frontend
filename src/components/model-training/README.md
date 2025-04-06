# Model Training Components

This directory contains components used in the model training interface.

## ModelCard Component

The `ModelCard.tsx` component in this directory is specialized for training
model selection. It displays detailed characteristic metrics like accuracy,
speed, interpretability, and data requirements.

> ⚠️ **Note:** There is also a `model-card.tsx` component in the root components
> directory. These are two separate components with similar names but different
> purposes:
>
> - `ModelCard.tsx` (this directory): Used in model training with detailed
>   characteristic metrics
> - `model-card.tsx` (root components): Simpler card with optional configure
>   button

### Future Improvement Suggestion

In the future, consider:

1. Merging these components into a single flexible component
2. Renaming them to be more distinct (e.g., `ModelTrainingCard` vs
   `ModelSelectionCard`)
3. Creating a base card component that both extend

## Type Notes

This component uses `React.ReactElement` instead of `JSX.Element` for type
annotations due to Deno compatibility.
