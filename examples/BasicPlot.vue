<template>
    <div class="example-frame">
        <div class="plot" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
            <TransformGroup :domain="domain" :size="size">
                <Grid :x-ticks="xTicks" :y-ticks="yTicks" stroke-color="#e2e8f0" />
                <Line :points="points" stroke-color="#2563eb" :stroke-width="2" />
                <Scatter fill-color="#0f172a" :points="points" :radius="4" />
                <XAxis stroke-color="#334155" :ticks="xTicks" />
                <YAxis stroke-color="#334155" :ticks="yTicks" />
                <XLabel>
                    X value
                </XLabel>
                <YLabel>
                    Y value
                </YLabel>
            </TransformGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Grid, Line, Scatter, TransformGroup, XAxis, XLabel, YAxis, YLabel, getDataDomain, getNiceTicks } from '@putianyi888/vue3-plots'
import type { PlotPoint, PlotSize } from '@putianyi888/vue3-plots'

const points: PlotPoint[] = [
  { x: 0, y: 2 },
  { x: 1, y: 4 },
  { x: 2, y: 3 },
  { x: 3, y: 6 },
  { x: 4, y: 5 },
]
const size: PlotSize = { width: 640, height: 360 }
const domain = getDataDomain(points, 0.1)
const xTicks = getNiceTicks(domain.xMin, domain.xMax)
const yTicks = getNiceTicks(domain.yMin, domain.yMax)
</script>

<style scoped>
.example-frame {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  padding: 16px;
  background: #ffffff;
}

.plot {
  position: relative;
}
</style>
