<script setup>
import ScatterSlot from '../../examples/ScatterSlot.vue'
</script>

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


<!-- @include-props scatter -->

## Events

| Event | Payload | Description |
| --- | --- | --- |
| `pointClick` | `PlotPoint<T>` | Emitted when a rendered point is clicked. |
| `pointEnter` | `PlotPoint<T>` | Emitted when the pointer enters a rendered point. |
| `pointLeave` | `PlotPoint<T>` | Emitted when the pointer leaves a rendered point. |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `point` | `{ index: number; x: number; y: number; point: PlotPoint<T> }` | Custom renderer for a data point marker. `x` and `y` are SVG coordinates, `index` is the original input index, and `point` is the original data point. |

This slot is useful for customizing marker shapes, but it can also render more complex SVG. The example below uses it to draw line segments and bars.

<ScatterSlot />

<<< ../../examples/ScatterSlot.vue

## Notes

Array-valued style props use the original input point index, even when earlier points are skipped because their coordinates are not finite.
