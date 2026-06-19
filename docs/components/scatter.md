<script setup>
import ScatterSlot from '../../examples/ScatterSlot.vue'
</script>

# Scatter

`Scatter` renders finite data points as SVG circles. Fill, opacity, and outline props can be scalar values or arrays aligned with the input point list. Enable `interactive` when points should emit pointer events.

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
  interactive
  @point-click="handlePointClick"
/>
```

<!-- @include: ../.generated/api/scatter.md -->

This slot is useful for customizing marker shapes, but it can also render more complex SVG. The example below uses it to draw line segments and bars.

<ScatterSlot />

<<< ../../examples/ScatterSlot.vue

## Notes

Array-valued style props use the original input point index, even when earlier points are skipped because their coordinates are not finite.
