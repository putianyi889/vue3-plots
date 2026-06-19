<script setup>
import PieChart from '../../examples/PieChart.vue'
</script>

# Pie

`Pie` renders value-color pairs as a centered SVG plot layer. It is useful for background summaries, proportional overlays, and donut-style annotations that should share a plot container with other layers. Enable `interactive` when slices should emit pointer events.

## Import

```ts
import { Pie } from '@putianyi888/vue3-plots'
```

## Example

<PieChart />

<<< ../../examples/PieChart.vue

<!-- @include: ../.generated/api/pie.md -->

## Notes

`Pie` is a full SVG layer centered in the plot area after padding is applied. When `outerRadius` is omitted, it defaults to one quarter of the smaller plot-area dimension.

`Pie` does not validate data values or radius values. Pass finite values, a positive `total` when overriding automatic totals, non-negative `innerRadius` values, and positive `outerRadius` values. Invalid SVG radius values are passed through to the generated path data and may not render.

When `interactive` is enabled, `click`, `mouse-enter`, and `mouse-leave` emit the slice index, source datum, and generated sector geometry.

Use `MiniPie` instead when you need an inline DOM-sized pie marker that participates in text flow or can be placed inside another SVG element.
