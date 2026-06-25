<script setup>
import AxisTicks from '../../examples/AxisTicks.vue'
</script>

# Axis

`Axis` renders an axis line, tick marks, and tick labels. It is an absolutely positioned SVG layer, so place it inside a relatively positioned plot container.

Use `direction="horizontal"` for an x-axis and `direction="vertical"` for a y-axis. The `position` prop replaces the old x/y-specific position props: for a horizontal axis it is the y data-space position, and for a vertical axis it is the x data-space position.

## Import

```ts
import { Axis } from '@putianyi888/vue3-plots'
```

## Example

<AxisTicks />

<<< ../../examples/AxisTicks.vue

<!-- @include: ../.generated/api/axis.md -->

## Notes

Tick labels use `formatTick` by default.

For horizontal axes, positive tick sizes extend below the axis line and negative tick sizes extend above it. The default label `offset` is `24`.

For vertical axes, positive tick sizes extend to the left of the axis line and negative tick sizes extend to the right. The default label `offset` is `-24`.
