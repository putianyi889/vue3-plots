# Utilities

Utility exports cover coordinate conversion, domain calculation, tick generation, and small typing helpers used by the components.

The detailed API pages are generated from JSDoc in `src/components/utils.ts`. Use this page as a map to the generated reference.

## Types

| Export | Description |
| --- | --- |
| [`PlotPoint<T = unknown>`](/api/utils/type-aliases/PlotPoint) | Data-space point with `x`, `y`, and optional typed source data. |
| [`PlotPadding`](/api/utils/interfaces/PlotPadding) | Plot insets: `{ top, right, bottom, left }`. |
| [`PlotDomain`](/api/utils/interfaces/PlotDomain) | Data-space bounds: `{ xMin, xMax, yMin, yMax }`. |
| [`PlotSize`](/api/utils/interfaces/PlotSize) | Outer SVG size: `{ width, height }`. |
| [`PlotArea`](/api/utils/interfaces/PlotArea) | Drawable SVG area after padding. |
| [`SvgPoint`](/api/utils/interfaces/SvgPoint) | SVG-space point: `{ x, y }`. |
| [`Scale`](/api/utils/type-aliases/Scale) | One-dimensional scale function. |
| [`MaybeArray<T>`](/api/utils/type-aliases/MaybeArray) | Scalar-or-array helper type: `T \| T[]`. |

## Constants

| Export | Description |
| --- | --- |
| [`defaultPlotPadding`](/api/utils/variables/defaultPlotPadding) | Default padding used when no `padding` prop is supplied. |

## Layout And Scales

| Export | Description |
| --- | --- |
| [`getPlotArea`](/api/utils/functions/getPlotArea) | Returns the drawable plot area after subtracting padding. |
| [`createLinearScale`](/api/utils/functions/createLinearScale) | Creates a linear data-space to SVG-space scale. |
| [`pointToSvg`](/api/utils/functions/pointToSvg) | Maps one data-space point into SVG coordinates. |
| [`pointsToSvg`](/api/utils/functions/pointsToSvg) | Filters and maps finite data-space points into SVG coordinates. |
| [`polarToCartesian`](/api/utils/functions/polarToCartesian) | Converts a polar coordinate into SVG-space cartesian coordinates. |

## Domains And Ticks

| Export | Description |
| --- | --- |
| [`getDataDomain`](/api/utils/functions/getDataDomain) | Calculates a padded domain from finite point coordinates. |
| [`getNiceTicks`](/api/utils/functions/getNiceTicks) | Generates readable tick values between two bounds. |
| [`formatTick`](/api/utils/functions/formatTick) | Formats a tick label for display. |

## Scalar Or Array Props

| Export | Description |
| --- | --- |
| [`getMaybeArray`](/api/utils/functions/getMaybeArray) | Reads either a scalar value or an indexed array value. |

## Recommended Companion Packages

Vue3 Plots keeps its utility layer intentionally small. For heavier data preparation, prefer established packages and pass their output into the components.

| Package | Use it for | Notes |
| --- | --- | --- |
| [`d3-array`](https://d3js.org/d3-array) | Summaries, grouping, sorting, bins, bisectors, and tick helpers. | Good when `getDataDomain` and `getNiceTicks` are not enough for your data pipeline. |
| [`d3-scale`](https://d3js.org/d3-scale) | Linear, time, log, symlog, ordinal, band, point, quantile, quantize, threshold, sequential, and diverging scales. | Use when you need scale types beyond `createLinearScale`. |
| [`d3-format`](https://d3js.org/d3-format) | Numeric label formatting. | Useful when `formatTick` is too simple for locale, SI-prefix, percentage, or fixed-precision labels. |
| [`d3-time`](https://d3js.org/d3-time) and [`d3-time-format`](https://d3js.org/d3-time-format) | Time intervals and date formatting. | Pair with `d3-scale` time scales for temporal plots. |
| [`simple-statistics`](https://simplestatistics.org/) | Descriptive statistics, regression, classification, and sampling helpers. | A focused option for statistical preprocessing before rendering. |

These packages should usually live in the consuming application, not inside this component library.
