# MouseDraw

`MouseDraw` captures click gestures over the plot and emits geometry objects. Use it for rectangular, elliptical, or polygon selection and annotation workflows.

## Import

```ts
import { MouseDraw } from '@putianyi888/vue3-plots'
```

## Example

```vue
<MouseDraw
  mode="rect"
  :size="{ width: 640, height: 360 }"
  @draw="handleDraw"
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'' \| 'rect' \| 'ellipse' \| 'polygon'` | `'rect'` | Draw mode. Use `''` to disable pointer capture and clear the active draft shape. |
| `size` | `PlotSize` | `{ width: 320, height: 200 }` | SVG coordinate size used to convert pointer positions into plot-space coordinates. |
| `fillOpacity` | `number` | `1` | Draft shape fill opacity. |
| `strokeOpacity` | `number` | `1` | Draft shape outline opacity. |

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `draw` | `Rect \| Ellipse \| Polygon` | Emitted when a click gesture finishes. |

## Behavior

`MouseDraw` starts rectangles and ellipses on the first click, previews them on `mousemove`, and emits them on the second click. Rectangle coordinates are normalized so `x` and `y` are the top-left corner. Ellipses are emitted as center coordinates plus radii.

Polygon mode adds one vertex per click, previews the next vertex on `mousemove`, and emits the polygon on `dblclick` when at least three vertices are available.
