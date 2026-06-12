# vue3-plots

Composable Vue 3 SVG plot layers for building charts from small, focused components.

## Setup

```sh
npm install
```

## Development

```sh
npm run dev
```

This starts the Vite playground server. Open the local URL printed in the
terminal, usually:

```txt
http://localhost:5173/
```

The playground entry point is `index.html`, and the demo code lives in
`src/playground/`.

If port `5173` is already in use, Vite will print the alternate port it chose.

## Testing

```sh
npm run test:run
```

## Build

```sh
npm run build
```

The package build is emitted to `dist/`.

## Usage

```vue
<script setup lang="ts">
import { Axes, Grid, Line, Scatter, XLabel, YLabel, getDataDomain, getNiceTicks } from 'vue3-plots'
import 'vue3-plots/style.css'

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
    <Grid
      :domain="domain"
      :size="size"
      :x-ticks="xTicks"
      :y-ticks="yTicks"
      stroke-color="#e2e8f0"
    />
    <Line
      :points="points"
      :domain="domain"
      :size="size"
      stroke-color="#2563eb"
      :stroke-width="2"
    />
    <Scatter
      :points="points"
      :domain="domain"
      :size="size"
      :radius="4"
      fill-color="#0f172a"
    />
    <Axes
      :domain="domain"
      :size="size"
      :x-ticks="xTicks"
      :y-ticks="yTicks"
      stroke-color="#334155"
    />
    <XLabel :size="size">X value</XLabel>
    <YLabel :size="size">Y value</YLabel>
  </div>
</template>
```

## Exports

Components:

- `Axes`
- `Grid`
- `Line`
- `Scatter`
- `MouseDraw`
- `XLabel`
- `YLabel`

Utilities and types:

- `getPlotArea`
- `createLinearScale`
- `pointToSvg`
- `pointsToSvg`
- `getDataDomain`
- `getNiceTicks`
- `formatTick`
- `getMaybeArray`
- `Rect`
- `Ellipse`
- `Polygon`
- `MaybeArray`
- `Scale`
- `PlotPoint`
- `PlotDomain`
- `PlotPadding`
- `PlotSize`
- `PlotArea`

More docs are available in [docs/components.md](docs/components.md), [docs/utils.md](docs/utils.md), and [docs/geometry.md](docs/geometry.md).
