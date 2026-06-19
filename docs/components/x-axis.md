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

<!-- @include: ../.generated/api/x-axis.md -->

## Notes

Tick labels use `formatTick` by default. Positive tick sizes extend below the axis line, and negative tick sizes extend above it. Use `offset` to place labels above or below the axis line independently from tick mark direction.
