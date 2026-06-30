<script setup>
import BasicPlot from '../examples/BasicPlot.vue'
import BoxAxes from '../examples/BoxAxes.vue'
import ImageGridExample from '../examples/ImageGrid.vue'
import MultipleAxes from '../examples/MultipleAxes.vue'
import ResponsivePlot from '../examples/ResponsivePlot.vue'
import ScatterMiniPie from '../examples/ScatterMiniPie.vue'
import ScatterTippy from '../examples/ScatterTippy.vue'
</script>

# Examples

## Minimal Plot

<BasicPlot />

<<< ../examples/BasicPlot.vue

## Responsive Plot With ResizeObserver

This example uses DOM layout for `XLabel` and `YLabel`, then observes the remaining plot area with `ResizeObserver` and passes that measured size to the SVG layers.

<ResponsivePlot />

<<< ../examples/ResponsivePlot.vue

## Mini Pie Scatter Points

<ScatterMiniPie />

<<< ../examples/ScatterMiniPie.vue

## Scatter Tooltips

Vue3 Plots intentionally leaves tooltips to your application, so you can use the library that best fits it. Enable Scatter's `interactive` prop and use its `point-enter` and `point-leave` events to update the tooltip content. This example uses [`VueTippy`](https://vue-tippy.netlify.app/) to display that content and follow the cursor.

<ScatterTippy />

<<< ../examples/ScatterTippy.vue

## Box Axes

<BoxAxes />

<<< ../examples/BoxAxes.vue

## Multiple Axes

<MultipleAxes />

<<< ../examples/MultipleAxes.vue

## ImageGrid Complex Example

<ImageGridExample />

<<< ../examples/ImageGrid.vue
