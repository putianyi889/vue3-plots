# Axes

`Axes` renders x and y axis lines, tick marks, and tick labels. It is an absolutely positioned SVG layer, so place it inside a relatively positioned plot container.

## Import

```ts
import { Axes } from 'vue3-plots'
```

## Example

```vue
<Axes
  :domain="domain"
  :size="{ width: 640, height: 360 }"
  :x-ticks="[0, 2, 4, 6, 8, 10]"
  :y-ticks="[0, 25, 50, 75, 100]"
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `domain` | `PlotDomain` | Required | Data-space bounds used to map tick values onto the plot area. |
| `size` | `PlotSize` | `{ width: 320, height: 200 }` | Outer SVG size in pixels. |
| `padding` | `PlotPadding` | `defaultPlotPadding` | Insets reserved for tick marks and tick labels. |
| `xTicks` | `number[]` | `[]` | X-axis tick values in data-space coordinates. |
| `yTicks` | `number[]` | `[]` | Y-axis tick values in data-space coordinates. |
| `tickSize` | `number \| number[]` | `4` | Tick mark length in pixels. Arrays are indexed across x ticks first, then y ticks. |
| `strokeColor` | `string \| string[]` | `'none'` | Axis line and tick mark color. Arrays are indexed across x ticks first, then y ticks. |
| `strokeOpacity` | `number \| number[]` | `1` | Axis line and tick mark opacity. Arrays are indexed across x ticks first, then y ticks. |
| `strokeWidth` | `number \| number[]` | `1` | Axis line and tick mark width in pixels. Arrays are indexed across x ticks first, then y ticks. |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `x-tick` | `{ tick: number; x: number; y: number }` | Custom renderer for an x-axis tick label. |
| `y-tick` | `{ tick: number; x: number; y: number }` | Custom renderer for a y-axis tick label. |

## Notes

Tick labels use `formatTick` by default. Pass explicit `xTicks` and `yTicks`, or generate them with `getNiceTicks`.

Array-valued stroke props are useful when individual ticks need distinct styling. Use `XLabel` and `YLabel` for axis titles.
