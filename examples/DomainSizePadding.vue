<template>
    <div class="tutorial-frame">
        <div class="plot" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
            <TransformGroup :domain="domain" :size="size" :padding="padding">
                <Grid :x-ticks="xTicks" :y-ticks="yTicks" stroke-color="#d4d4d8" />
                <Scatter :points="points" :radius="[5, 5, 6]" :fill-color="['#2563eb', '#2563eb', '#dc2626']" />
                <Axis direction="horizontal" :ticks="xTicks" stroke-color="#52525b" />
                <Axis direction="vertical" :ticks="yTicks" stroke-color="#52525b" />
            </TransformGroup>
            <svg class="plot-layer plot-layer--passive" :height="size.height" :width="size.width" :viewBox="`0 0 ${size.width} ${size.height}`" preserveAspectRatio="none">
                <rect class="canvas-box" x="0" y="0" :width="size.width" :height="size.height" />
                <rect class="plot-box" :x="padding.left" :y="padding.top" :width="size.width - padding.left - padding.right" :height="size.height - padding.top - padding.bottom" />
                <line class="annotation-line" :x1="padding.left" :x2="padding.left" y1="10" :y2="padding.top - 8" />
                <text class="annotation-text" :x="padding.left + 8" :y="padding.top - 16">padding</text>
                <text class="annotation-text" :x="size.width - 118" y="22">size: 520 x 320</text>
                <text class="annotation-text" :x="padding.left + 10" :y="size.height - padding.bottom - 12">domain: x 0-10, y 0-100</text>
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Axis, Grid, Scatter, TransformGroup } from '@putianyi888/vue3-plots'
import type { PlotDomain, PlotPadding, PlotPoint, PlotSize } from '@putianyi888/vue3-plots'

const size: PlotSize = { width: 520, height: 320 }
const padding: PlotPadding = { top: 48, right: 36, bottom: 48, left: 64 }
const domain: PlotDomain = { xMin: 0, xMax: 10, yMin: 0, yMax: 100 }
const points: PlotPoint[] = [
    { x: 1, y: 20 },
    { x: 5, y: 50 },
    { x: 9, y: 82 },
]
const xTicks = [0, 2, 4, 6, 8, 10]
const yTicks = [0, 25, 50, 75, 100]
</script>

<style scoped>
.tutorial-frame {
  overflow-x: auto;
  border: 1px solid #e4e4e7;
  padding: 16px;
  background: #ffffff;
}

.plot {
  position: relative;
}

.canvas-box {
  fill: none;
  stroke: #71717a;
  stroke-dasharray: 6 4;
  stroke-width: 1;
}

.plot-box {
  fill: rgb(37 99 235 / 6%);
  stroke: #2563eb;
  stroke-width: 1;
}

.annotation-line {
  stroke: #dc2626;
  stroke-width: 1;
}

.annotation-text {
  fill: #18181b;
  font-size: 13px;
}
</style>
