#!/bin/bash

# Fix unused variable in calendar.tsx
sed -i '' 's/IconLeft: ({ ...props })/IconLeft: ({ ..._props })/g' src/components/ui/calendar.tsx
sed -i '' 's/IconRight: ({ ...props })/IconRight: ({ ..._props })/g' src/components/ui/calendar.tsx

# Fix unused variables in data-management.tsx
sed -i '' 's/const \[dataSource,/const \[_dataSource,/g' src/components/data-management.tsx
sed -i '' 's/setDataSource\]/\_setDataSource\]/g' src/components/data-management.tsx

# Fix unused variable in load-env.ts
sed -i '' 's/} catch (error) {/} catch (_error) {/g' src/lib/load-env.ts

# Fix unused variable in model-configuration.tsx
sed -i '' 's/function ModelCard({ id,/function ModelCard({ _id,/g' src/components/model-configuration.tsx

# Fix unused variable in forecasting-workspace.tsx
sed -i '' 's/import { Play, RefreshCw } from/import { Play, RefreshCw as _RefreshCw } from/g' src/components/forecasting-workspace.tsx

# Fix unused variable in data-preparation.tsx
sed -i '' 's/const \[consistencyScore, setConsistencyScore\]/const \[consistencyScore, _setConsistencyScore\]/g' src/components/data-preparation.tsx
sed -i '' 's/const \[timelinessScore,/const \[_timelinessScore,/g' src/components/data-preparation.tsx
sed -i '' 's/setTimelinessScore\]/\_setTimelinessScore\]/g' src/components/data-preparation.tsx

# Fix unused variables in d3 chart methods
find src/components/charts -type f -name "*.tsx" -exec sed -i '' 's/\.delay((d, /\.delay((_d, /g' {} \;
find src/components/charts -type f -name "*.tsx" -exec sed -i '' 's/\.x((d, /\.x((_d, /g' {} \;
find src/components/charts -type f -name "*.tsx" -exec sed -i '' 's/\.attr("cx", (d, /\.attr("cx", (_d, /g' {} \;

# Fix unused variables in data-quality-analysis.tsx
sed -i '' 's/const outlierPoints/const _outlierPoints/g' src/components/data-quality-analysis.tsx
find src/components/data-quality-analysis.tsx -type f -exec sed -i '' 's/\.delay((d, /\.delay((_d, /g' {} \;

# Fix unused variable in feature-importance-chart.tsx
sed -i '' 's/const tooltip = d3/const _tooltip = d3/g' src/components/charts/feature-importance-chart.tsx

# Fix unused variables in time-series-decomposition.tsx
sed -i '' 's/\.x((d, /\.x((_d, /g' src/components/time-series-decomposition.tsx

# Update next.config.mjs for consistency (in case it hasn't been updated yet)
sed -i '' 's/} catch (_e) {/} catch (_error) {/g' src/next.config.mjs

# Add fix for other catch error variables for consistency
sed -i '' 's/} catch (error) {/} catch (_error) {/g' src/lib/use-mock-data.ts
sed -i '' 's/} catch (error) {/} catch (_error) {/g' src/load-environment.ts
