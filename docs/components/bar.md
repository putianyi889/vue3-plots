<script setup>
import BarChart from '../../examples/BarChart.vue'
</script>

# Bar

`Bar` renders one data series as evenly spaced bars. Bar positions are calculated automatically from the supplied value order. Render multiple `Bar` layers with matching `series-count` and distinct `series-index` values to create grouped bars.

## Import

```ts
import { Bar } from '@putianyi888/vue3-plots'
```

## Example

<BarChart />

<<< ../../examples/BarChart.vue

<!-- @include: ../.generated/api/bar.md -->

## Notes

`gap` controls the empty portion between adjacent categories, while `sub-gap` controls spacing between series in one category. Both values are proportions of a category band.

The `baseline` defaults to `domain.yMin` for vertical bars and `domain.xMin` for horizontal bars. Pass `baseline` when bars should extend from another data-space value.

The exposed `positions` array contains the data-space center coordinate of every bar. Pass it to `XAxis` for vertical bars or `YAxis` for horizontal bars to align ticks with the categories. `bars` exposes the rendered SVG rectangles when their exact geometry is needed.

All non-prop attributes are forwarded to every rendered SVG `<rect>`. For example, use `fill`, `stroke`, `stroke-width`, `rx`, and `opacity` to style a series. Refer to [MDN's SVG attribute reference](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute) for the complete set of available attributes.
