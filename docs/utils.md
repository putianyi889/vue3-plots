# Utilities

Utility exports cover coordinate conversion, domain calculation, tick generation, and small typing helpers used by the components.

## Types

| Export | Description |
| --- | --- |
| `PlotPoint<T = unknown>` | Data-space point with `x`, `y`, and optional `data`. When `T` is provided, `data` is required. |
| `PlotPadding` | Plot insets: `{ top, right, bottom, left }`. |
| `PlotDomain` | Data-space bounds: `{ xMin, xMax, yMin, yMax }`. |
| `PlotSize` | Outer SVG size: `{ width, height }`. |
| `PlotArea` | Drawable SVG area after padding: `{ x, y, width, height }`. |
| `SvgPoint` | SVG-space point: `{ x, y }`. |
| `Scale` | Function type `(value: number) => number`. |
| `MaybeArray<T>` | Scalar-or-array helper type: `T \| T[]`. |

## Constants

### `defaultPlotPadding`

Default padding used by plot layers when no `padding` prop is supplied.

```ts
const defaultPlotPadding = {
  top: 12,
  right: 16,
  bottom: 28,
  left: 40,
}
```

## Layout And Scales

### `getPlotArea(size, padding?)`

Returns the drawable plot area after subtracting padding from the outer size.

```ts
const area = getPlotArea(
  { width: 640, height: 360 },
  { top: 12, right: 16, bottom: 28, left: 40 },
)
```

Widths and heights are clamped to `0` when padding is larger than the outer size.

### `createLinearScale(domainMin, domainMax, rangeMin, rangeMax)`

Creates a linear mapping function from a data-space domain to an SVG-space range.

```ts
const scaleX = createLinearScale(0, 10, 40, 624)
scaleX(5) // 332
```

Non-finite input values map to `rangeMin`. Degenerate or non-finite domains map values to the center of the range.

### `pointToSvg(point, scaleX, scaleY)`

Maps one `PlotPoint` into SVG coordinates using precomputed scale functions.

```ts
const svgPoint = pointToSvg({ x: 5, y: 10 }, scaleX, scaleY)
```

### `pointsToSvg(points, scaleX, scaleY)`

Filters out points with non-finite `x` or `y`, then maps the remaining points with `pointToSvg`.

```ts
const svgPoints = pointsToSvg(points, scaleX, scaleY)
```

## Domains And Ticks

### `getDataDomain(points, paddingRatio?)`

Calculates a padded `PlotDomain` from finite point coordinates.

```ts
const domain = getDataDomain(points, 0.05)
```

When no finite values are available, the fallback range is `0` to `1` for each axis. When all values on an axis are equal, the range expands around that value.

### `getNiceTicks(min, max, count?)`

Generates readable tick values between `min` and `max`.

```ts
const ticks = getNiceTicks(domain.xMin, domain.xMax, 5)
```

Returns an empty array for non-finite inputs or non-positive `count`. Returns `[min]` when `min === max`.

### `formatTick(value)`

Formats a tick label for display.

```ts
formatTick(1234) // '1.23e+3'
formatTick(12.345678) // '12.3457'
```

Non-finite values format to an empty string.

## Scalar Or Array Props

### `getMaybeArray(value, index)`

Reads either a scalar value or an indexed array value. Components use this for props that accept `T | T[]`.

```ts
getMaybeArray('blue', 2) // 'blue'
getMaybeArray(['red', 'blue'], 1) // 'blue'
```

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
