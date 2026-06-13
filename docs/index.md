# vue3-plots

Composable Vue 3 SVG plot layers for building charts from small, focused components.

Use `vue3-plots` when you want chart primitives instead of a full charting framework. Each component renders one layer, so you can stack grids, axes, lines, points, labels, and interaction layers in the same plot container.

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
import { Grid, Line, Scatter, XAxis, YAxis, getDataDomain, getNiceTicks } from '@putianyi888/vue3-plots'
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
    <Grid :domain="domain" :size="size" :x-ticks="xTicks" :y-ticks="yTicks" stroke-color="#e2e8f0" />
    <Line :points="points" :domain="domain" :size="size" stroke-color="#2563eb" :stroke-width="2" />
    <Scatter :points="points" :domain="domain" :size="size" :radius="4" fill-color="#0f172a" />
    <XAxis :domain="domain" :size="size" :ticks="xTicks" stroke-color="#334155" />
    <YAxis :domain="domain" :size="size" :ticks="yTicks" stroke-color="#334155" />
  </div>
</template>
```

## Next Steps

- Read the [component guide](components.md).
- Check the [utility API](utils.md).
- Review the [geometry API](geometry.md).
