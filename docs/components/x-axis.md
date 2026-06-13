# XAxis

`XAxis` renders a horizontal axis line, x-axis tick marks, and tick labels. It is an absolutely positioned SVG layer, so place it inside a relatively positioned plot container.

## Import

```ts
import { XAxis } from '@putianyi888/vue3-plots'
```

## Example

```vue
<XAxis
  :domain="domain"
  :size="{ width: 640, height: 360 }"
  :ticks="[0, 2, 4, 6, 8, 10]"
  text-anchor="middle"
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `domain` | `PlotDomain` | Required | Data-space bounds used to map tick values onto the plot area. |
| `size` | `PlotSize` | `{ width: 320, height: 200 }` | Outer SVG size in pixels. |
| `padding` | `PlotPadding` | `defaultPlotPadding` | Insets shared with other plot layers. |
| `ticks` | `number[]` | `[]` | X-axis tick values in data-space coordinates. |
| `y` | `number` | Plot area bottom | Axis line y position in SVG-space coordinates. |
| `offset` | `number` | `16` | Tick label y offset from the axis line in SVG-space pixels. Positive values move labels downward. |
| `textAnchor` | `'start' \| 'middle' \| 'end'` | `'middle'` | SVG `text-anchor` value for tick labels. See the [official SVG text-anchor specification](https://www.w3.org/TR/SVG2/text.html#TextAnchorProperty). |
| `tickSize` | `number \| number[]` | `4` | Tick mark length in pixels. Arrays are indexed by tick index. Negative values draw ticks in the opposite direction. |
| `strokeColor` | `string \| string[]` | `'none'` | Axis line and tick mark color. Arrays are indexed by tick index. |
| `strokeOpacity` | `number \| number[]` | `1` | Axis line and tick mark opacity. Arrays are indexed by tick index. |
| `strokeWidth` | `number \| number[]` | `1` | Axis line and tick mark width in pixels. Arrays are indexed by tick index. |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `tick` | `{ tick: number; x: number; y: number }` | Custom renderer for a tick label. |

## Notes

Tick labels use `formatTick` by default. Positive tick sizes extend below the axis line, and negative tick sizes extend above it. Use `offset` to place labels above or below the axis line independently from tick mark direction.
