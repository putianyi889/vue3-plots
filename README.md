# vue3-plots

Composable Vue 3 SVG plot layers for building charts from small, focused components.

Use `vue3-plots` when you want chart primitives instead of a full charting framework. Each component renders one layer, so you can stack grids, axes, lines, points, labels, and interaction layers in the same plot container.

## Install

```sh
npm install @putianyi888/vue3-plots
```

Vue is a peer dependency and should already be installed in your Vue 3 app.

## Quick Start

```vue
<script setup lang="ts">
import { Grid, Line, Scatter, TransformGroup, XAxis, XLabel, YAxis, YLabel, getDataDomain, getNiceTicks } from '@putianyi888/vue3-plots'
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
      <XAxis :ticks="xTicks" stroke-color="#334155" />
      <YAxis :ticks="yTicks" stroke-color="#334155" />
      <XLabel>X value</XLabel>
      <YLabel>Y value</YLabel>
    </TransformGroup>
  </div>
</template>
```

## Components

- `Grid`: background grid lines aligned to x and y ticks.
- `Line`: connected SVG path for ordered points.
- `Scatter`: SVG circles with point click and hover events.
- `TransformGroup`: shared `domain`, `size`, and `padding` context for layers.
- `XAxis` and `YAxis`: axis lines, tick marks, and tick labels.
- `XLabel` and `YLabel`: standalone axis title layers.
- `MouseDraw`: click-based rectangle, ellipse, and polygon drawing.

Layer components are absolutely positioned SVGs. Put them inside a relatively positioned container. Use `TransformGroup` when several layers should share the same `size`, `domain`, and `padding`.

## Styling

Import the package stylesheet once:

```ts
import '@putianyi888/vue3-plots/style.css'
```

The stylesheet only contains plot layer positioning and scoped component styles. Visual SVG attributes such as `strokeColor`, `fillColor`, `radius`, `strokeWidth`, and opacity props are passed directly to components.

## Utilities

The package also exports small helpers for common plot setup:

- `getDataDomain`
- `getNiceTicks`
- `createLinearScale`
- `pointToSvg`
- `pointsToSvg`
- `formatTick`
- `getMaybeArray`

Type exports include `PlotPoint`, `PlotDomain`, `PlotPadding`, `PlotSize`, `PlotArea`, `MaybeArray`, and geometry types such as `Rect`, `Ellipse`, and `Polygon`.

## Documentation

Detailed documentation is available at <https://putianyi889.github.io/vue3-plots/>.

The source Markdown lives in [docs](docs/), and rendered example components live in [examples](examples/).

## Repository Development

For contributors working in this repository:

```sh
npm install
npm run dev
npm run docs:build
npm run test:run
npm run build
```
