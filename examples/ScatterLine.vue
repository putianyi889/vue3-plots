<template>
    <div class="example-frame">
        <div class="plot" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
            <TransformGroup :domain="domain" :size="size" :padding="padding">
                <Grid :x-ticks="xTicks" :y-ticks="yTicks" stroke-color="#e2e8f0" />
                <Scatter :points="points">
                    <template #point="{ point }">
                        <line
                            v-if="point.index > 0"
                            :x1="svgPoints[point.index - 1].x - point.x"
                            :y1="svgPoints[point.index - 1].y - point.y"
                            x2="0" y2="0" stroke="#2563eb" stroke-width="2"
                            vector-effect="non-scaling-stroke"
                        />
                        <circle cx="0" cy="0" r="4" fill="#0f172a" />
                    </template>
                </Scatter>
                <XAxis :ticks="xTicks" stroke-color="#334155" />
                <YAxis :ticks="yTicks" stroke-color="#334155" />
            </TransformGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Grid, Scatter, TransformGroup, XAxis, YAxis, createLinearScale, getDataDomain, getNiceTicks, getPlotArea, pointToSvg } from '@putianyi888/vue3-plots'
import type { PlotPadding, PlotPoint, PlotSize } from '@putianyi888/vue3-plots'

const points: PlotPoint[] = [
  { x: 0, y: 2 },
  { x: 1, y: 4 },
  { x: 2, y: 3 },
  { x: 3, y: 6 },
  { x: 4, y: 5 },
]
const size: PlotSize = { width: 640, height: 360 }
const padding: PlotPadding = { top: 20, right: 20, bottom: 40, left: 40 }
const domain = getDataDomain(points, 0.1)
const xTicks = getNiceTicks(domain.xMin, domain.xMax)
const yTicks = getNiceTicks(domain.yMin, domain.yMax)
const area = getPlotArea(size, padding)
const scaleX = createLinearScale(domain.xMin, domain.xMax, area.x, area.x + area.width)
const scaleY = createLinearScale(domain.yMin, domain.yMax, area.y + area.height, area.y)
const svgPoints = points.map((point) => pointToSvg(point, scaleX, scaleY))
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
