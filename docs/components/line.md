# Line

`Line` renders finite data points as a connected SVG path. It preserves the input point order and scales point coordinates from the provided `domain`.

## Import

```ts
import { Line } from '@putianyi888/vue3-plots'
```

## Example

```vue
<Line
  :points="points"
  :domain="domain"
  :size="{ width: 640, height: 360 }"
  stroke-color="#2563eb"
  :stroke-width="2"
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `points` | `PlotPoint[]` | Required | Data points to connect in order. Non-finite points are skipped. |
| `domain` | `PlotDomain` | Required | Data-space bounds used to map points onto the plot area. |
| `size` | `PlotSize` | `{ width: 320, height: 200 }` | Outer SVG size in pixels. |
| `padding` | `PlotPadding` | `defaultPlotPadding` | Insets shared with other plot layers. |
| `strokeColor` | `string` | `'none'` | Line color. |
| `strokeOpacity` | `number` | `1` | Line opacity. |
| `strokeWidth` | `number` | `1` | Line width in pixels. |
| `lineCap` | `'butt' \| 'round' \| 'square'` | `'butt'` | SVG `stroke-linecap` value. |
| `lineJoin` | `'bevel' \| 'miter' \| 'inherit' \| 'round'` | `'miter'` | SVG `stroke-linejoin` value. |

## Notes

`Line` renders nothing when no finite points remain after filtering.
