# vue3-plots

Composable Vue 3 SVG plot layers for building charts from small, focused components.

## Motivation Behind This Package

Charting packages are not a new idea. Many excellent libraries have been maintained for years, and some are close to feature-complete for common charting needs. The trouble is that no general-purpose charting library can cover every niche interaction, annotation, axis layout, or visual detail that a project may need.

Large plotting libraries often solve this by providing all-in-one chart components. A single component may render the axes, grid, data series, labels, tooltip behavior, and more. That approach is convenient: good defaults can produce a useful chart with very little code. But once you need something outside the supported configuration surface, customization can become difficult, and workarounds often require digging deep into the library.

`vue3-plots` takes a different approach. It does not try to create a complete chart from one component. Instead, you compose a plot from smaller parts: axes, grids, data layers, labels, and interaction layers. This takes a little more setup, but gives you more control over how each piece behaves. If one layer does not support exactly what you need, you can replace or extend that layer without rebuilding the entire chart from scratch.

## Install

```sh
npm install @putianyi888/vue3-plots
```

Import the package stylesheet once in your app:

```ts
import '@putianyi888/vue3-plots/style.css'
```

## Minimal Example

```vue
<script setup lang="ts">
import { Axis, Grid, Line, Scatter, TransformGroup, getDataDomain, getNiceTicks } from '@putianyi888/vue3-plots'
import '@putianyi888/vue3-plots/style.css'

const points = [
  { x: 0, y: 2 },
  { x: 1, y: 4 },
  { x: 2, y: 3 },
]
const domain = getDataDomain(points)
const xTicks = getNiceTicks(domain.xMin, domain.xMax)
const yTicks = getNiceTicks(domain.yMin, domain.yMax)
const size = { width: 640, height: 360 }
</script>

<template>
  <div style="position: relative; width: 640px; height: 360px;">
    <TransformGroup :domain="domain" :size="size">
      <Grid :x-ticks="xTicks" :y-ticks="yTicks" stroke-color="#e2e8f0" />
      <Line :points="points" stroke-color="#2563eb" :stroke-width="2" />
      <Scatter :points="points" :radius="4" fill-color="#0f172a" />
      <Axis direction="horizontal" :ticks="xTicks" style="color: #334155" />
      <Axis direction="vertical" :ticks="yTicks" style="color: #334155" />
    </TransformGroup>
  </div>
</template>
```

The example uses `TransformGroup` to share `domain`, `size`, and `padding` with every plot layer inside it. Each child component then focuses on one part of the chart: `Grid` draws reference lines, `Line` connects the points, `Scatter` renders markers, and `Axis` renders tick marks and labels. Because these layers are independent, you can remove, reorder, replace, or style them separately while keeping their coordinate system aligned.

## Next Steps

- Try the [examples](examples.md).
- Read the [component guide](components.md).
- Check the [utility API](utils.md).
- Review the [geometry API](geometry.md).
