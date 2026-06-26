# vue3-plots

Composable Vue 3 SVG plot layers for building charts from small, focused components.

## Links

- Documentation: <https://putianyi889.github.io/vue3-plots/>
- Examples: <https://putianyi889.github.io/vue3-plots/examples>
- Components: <https://putianyi889.github.io/vue3-plots/components>
- npm: <https://www.npmjs.com/package/@putianyi888/vue3-plots>
- Issues: <https://github.com/putianyi889/vue3-plots/issues>

## Install

```sh
npm install @putianyi888/vue3-plots
```

## Minimal Use

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
const size = { width: 640, height: 360 }
const xTicks = getNiceTicks(domain.xMin, domain.xMax)
const yTicks = getNiceTicks(domain.yMin, domain.yMax)
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

`vue3-plots` is intentionally composable: each layer handles one part of the chart, and `TransformGroup` keeps shared `domain`, `size`, and `padding` values synchronized.

## Development

```sh
npm install
npm run docs:dev
npm run test:run
npm run build
```

`docs:dev` generates API tables once before starting VitePress, then watches component and TypeDoc sources for targeted API doc updates.
