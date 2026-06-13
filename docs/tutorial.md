# Tutorial

<script setup>
import DomainSizePadding from '../examples/DomainSizePadding.vue'
</script>

## `domain`, `size`, and `padding`

Most plot layers use the same three layout props:

```ts
interface PlotDomain {
  xMin: number
  xMax: number
  yMin: number
  yMax: number
}

interface PlotSize {
  width: number
  height: number
}

interface PlotPadding {
  top: number
  right: number
  bottom: number
  left: number
}
```

These props define how data-space values become SVG pixel positions. `domain` describes the visible data range, `size` sets the outer SVG dimensions, and `padding` reserves space between the SVG edge and the area where the data domain is drawn.

<DomainSizePadding />

In the example above, the dashed rectangle is the full SVG canvas described by `size`. The blue rectangle is the plot area left after applying `padding`. Data points are passed in their original data-space coordinates, and each layer maps them into that plot area using the shared `domain`.

Most components in a chart should share these three props. Instead of passing them to every layer, wrap the layers in `TransformGroup` and provide the values once.

## `MaybeArray` props

Many component props have a type like `T | T[]`. This means you can control all rendered items uniformly with one value, or individually with an array.

For example, to render two scatter series with different colors, you can use two `<Scatter />` layers with separate point arrays and separate `fill-color` values:

```vue
<TransformGroup :domain="domain" :size="size">
  <Scatter :points="seriesA" fill-color="#2563eb" :radius="4" />
  <Scatter :points="seriesB" fill-color="#dc2626" :radius="4" />
</TransformGroup>
```

Alternatively, you can render one `<Scatter />` layer and pass one combined point array plus an array of colors:

```vue
<script setup lang="ts">
const points = [
  { x: 0, y: 2 },
  { x: 1, y: 7 },
  { x: 2, y: 4 },
  { x: 3, y: 9 },
]

const colors = [
  '#2563eb',
  '#dc2626',
  '#2563eb',
  '#dc2626',
]
</script>

<template>
  <TransformGroup :domain="domain" :size="size">
    <Scatter :points="points" :fill-color="colors" :radius="4" />
  </TransformGroup>
</template>
```

Array values are matched by point index. Points from the same visual series do not need to be consecutive, so you can mix, sort, or filter your data before rendering.

The main advantage of `MaybeArray` props is per-item control. You can vary radius, color, opacity, and other supported attributes to emphasize the parts of the data that matter.

## SVG specification

This package uses SVG under the hood, and many props map directly to SVG attributes. The current API supports the attributes needed by the existing components, and broader SVG attribute support is one of the goals before version 1.0.
