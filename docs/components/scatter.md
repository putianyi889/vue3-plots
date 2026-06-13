# Scatter

`Scatter` renders finite data points as SVG circles and emits point-level pointer events. Fill, opacity, and outline props can be scalar values or arrays aligned with the input point list.

## Import

```ts
import { Scatter } from '@putianyi888/vue3-plots'
```

## Example

```vue
<Scatter
  :points="points"
  :domain="domain"
  :size="{ width: 640, height: 360 }"
  :radius="4"
  :fill-color="['#2563eb', '#dc2626']"
  @point-click="handlePointClick"
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `points` | `PlotPoint<T>[]` | Required | Data points to render. Non-finite points are skipped. |
| `domain` | `PlotDomain` | From `TransformGroup` | Data-space bounds used to map points onto the plot area. Required when no `TransformGroup` provides it. |
| `size` | `PlotSize` | From `TransformGroup`, then `{ width: 320, height: 200 }` | Outer SVG size in pixels. |
| `padding` | `PlotPadding` | From `TransformGroup`, then `defaultPlotPadding` | Insets shared with other plot layers. |
| `radius` | `number \| number[]` | `0` | Circle radius in pixels. Arrays are indexed by original point index. |
| `fillColor` | `string \| string[]` | `'black'` | Circle fill color. Arrays are indexed by original point index. |
| `fillOpacity` | `number \| number[]` | `1` | Circle fill opacity. Arrays are indexed by original point index. |
| `strokeColor` | `string \| string[]` | `'none'` | Circle outline color. Arrays are indexed by original point index. |
| `strokeOpacity` | `number \| number[]` | `1` | Circle outline opacity. Arrays are indexed by original point index. |
| `strokeWidth` | `number \| number[]` | `1` | Circle outline width in pixels. Arrays are indexed by original point index. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `pointClick` | `PlotPoint<T>` | Emitted when a rendered point is clicked. |
| `pointEnter` | `PlotPoint<T>` | Emitted when the pointer enters a rendered point. |
| `pointLeave` | `PlotPoint<T>` | Emitted when the pointer leaves a rendered point. |

## Notes

Array-valued style props use the original input point index, even when earlier points are skipped because their coordinates are not finite.
