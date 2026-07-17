<script setup>
import BasicPlot from '../examples/BasicPlot.vue'
import AgePyramid from '../examples/AgePyramid.vue'
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

::: code-group

<<< ../examples/BasicPlot.vue#template{vue} [template]

<<< ../examples/BasicPlot.vue#script{vue} [script]

<<< ../examples/BasicPlot.vue#style{vue} [style]

:::

## Responsive Plot With ResizeObserver

This example uses DOM layout for `XLabel` and `YLabel`, then observes the remaining plot area with `ResizeObserver` and passes that measured size to the SVG layers.

<ResponsivePlot />

::: code-group

<<< ../examples/ResponsivePlot.vue#template{vue} [template]

<<< ../examples/ResponsivePlot.vue#script{vue} [script]

<<< ../examples/ResponsivePlot.vue#style{vue} [style]

:::

## Mini Pie Scatter Points

<ScatterMiniPie />

::: code-group

<<< ../examples/ScatterMiniPie.vue#template{vue} [template]

<<< ../examples/ScatterMiniPie.vue#script{vue} [script]

<<< ../examples/ScatterMiniPie.vue#style{vue} [style]

:::

## Scatter Tooltips

Vue3 Plots intentionally leaves tooltips to your application, so you can use the library that best fits it. Enable Scatter's `interactive` prop and use its `point-enter` and `point-leave` events to update the tooltip content. This example uses [`VueTippy`](https://vue-tippy.netlify.app/) to display that content and follow the cursor.

<ScatterTippy />

::: code-group

<<< ../examples/ScatterTippy.vue#template{vue} [template]

<<< ../examples/ScatterTippy.vue#script{vue} [script]

<<< ../examples/ScatterTippy.vue#style{vue} [style]

:::

## Box Axes

<BoxAxes />

::: code-group

<<< ../examples/BoxAxes.vue#template{vue} [template]

<<< ../examples/BoxAxes.vue#script{vue} [script]

:::

## Multiple Axes

<MultipleAxes />

::: code-group

<<< ../examples/MultipleAxes.vue#template{vue} [template]

<<< ../examples/MultipleAxes.vue#script{vue} [script]

:::

## Age Pyramid

This example uses `horizontal-flip` for the left side and `horizontal` for the right side to build a mirrored population pyramid.

<AgePyramid />

::: code-group

<<< ../examples/AgePyramid.vue#template{vue} [template]

<<< ../examples/AgePyramid.vue#script{vue} [script]

<<< ../examples/AgePyramid.vue#style{vue} [style]

:::

## ImageGrid Complex Example

<ImageGridExample />

::: code-group

<<< ../examples/ImageGrid.vue#template{vue} [template]

<<< ../examples/ImageGrid.vue#script{vue} [script]

<<< ../examples/ImageGrid.vue#style{vue} [style]

:::
