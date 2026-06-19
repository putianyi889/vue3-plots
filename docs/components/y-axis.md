# YAxis

`YAxis` renders a vertical axis line, y-axis tick marks, and tick labels. It is an absolutely positioned SVG layer, so place it inside a relatively positioned plot container.

## Import

```ts
import { YAxis } from '@putianyi888/vue3-plots'
```

## Example

```vue
<YAxis
  :domain="domain"
  :size="{ width: 640, height: 360 }"
  :ticks="[0, 25, 50, 75, 100]"
  text-anchor="middle"
/>
```

<!-- @include: ../.generated/api/y-axis.md -->

## Notes

Tick labels use `formatTick` by default. Positive tick sizes extend to the left of the axis line, and negative tick sizes extend to the right. Use `offset` to place labels left or right of the axis line independently from tick mark direction.
