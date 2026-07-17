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

::: code-group

<<< ../../examples/PieChart.vue#template{vue} [template]

<<< ../../examples/PieChart.vue#script{vue} [script]

<<< ../../examples/PieChart.vue#style{vue} [style]

:::

<!-- @include: ../.generated/api/pie.md -->

## Types

| Type | Description |
| --- | --- |
| [`PieDatum`](/api/pie-types/type-aliases/PieDatum) | Data item rendered as one `Pie` or `MiniPie` slice. |
| [`PiePiece`](/api/pie-types/type-aliases/PiePiece) | Event payload emitted by interactive `Pie` slices. |

## Notes

`Pie` is a full SVG layer centered in the plot area after padding is applied. When `outerRadius` is omitted, it defaults to half of the smaller plot-area dimension.

`Pie` does not validate data values or radius values. Pass finite values, a positive `total` when overriding automatic totals, non-negative `innerRadius` values, and positive `outerRadius` values. Invalid SVG radius values are passed through to the generated path data and may not render.

When `interactive` is enabled, hovered slices receive a visual floating effect. `click`, `mouse-enter`, and `mouse-leave` emit the slice index, source datum, and generated sector geometry.

Use `MiniPie` instead when you need an inline DOM-sized pie marker that participates in text flow or can be placed inside another SVG element.
