<template>
    <div class="example-frame">
        <div class="plot" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
            <TransformGroup :domain="domain" :size="size" :padding="padding">
                <Grid :x-ticks="xTicks" :y-ticks="yTicks" stroke-color="#e2e8f0" />
                <Scatter :points="points">
                    <template #point="{ point }">
                        <MiniPie
                            class="mini-pie-point"
                            :data="point.data"
                            :radius="pieRadius"
                            :start-angle="-90"
                            :style="{ height: `${pieRadius * 2}px`, width: `${pieRadius * 2}px`, x: `${-pieRadius}px`, y: `${-pieRadius}px` }"
                        />
                    </template>
                </Scatter>
                <Axis direction="horizontal" :ticks="xTicks" stroke-color="#334155" />
                <Axis direction="vertical" :ticks="yTicks" stroke-color="#334155" />
            </TransformGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Axis, Grid, MiniPie, Scatter, TransformGroup, getDataDomain, getNiceTicks } from '@putianyi888/vue3-plots'
import type { PlotPadding, PlotPoint, PlotSize } from '@putianyi888/vue3-plots'

type CategoryBreakdown = Array<{ value: number, color: string }>

const points: PlotPoint<CategoryBreakdown>[] = [
    { x: 1, y: 3, data: [{ value: 4, color: '#2563eb' }, { value: 2, color: '#f97316' }, { value: 1, color: '#16a34a' }] },
    { x: 2, y: 6, data: [{ value: 2, color: '#2563eb' }, { value: 5, color: '#f97316' }, { value: 3, color: '#16a34a' }] },
    { x: 3, y: 4, data: [{ value: 3, color: '#2563eb' }, { value: 1, color: '#f97316' }, { value: 5, color: '#16a34a' }] },
    { x: 4, y: 8, data: [{ value: 5, color: '#2563eb' }, { value: 3, color: '#f97316' }, { value: 2, color: '#16a34a' }] },
    { x: 5, y: 5, data: [{ value: 1, color: '#2563eb' }, { value: 4, color: '#f97316' }, { value: 4, color: '#16a34a' }] },
]
const size: PlotSize = { width: 640, height: 360 }
const padding: PlotPadding = { top: 24, right: 24, bottom: 40, left: 44 }
const domain = getDataDomain(points, 0.14)
const xTicks = getNiceTicks(domain.xMin, domain.xMax)
const yTicks = getNiceTicks(domain.yMin, domain.yMax)
const pieRadius = 12
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

.mini-pie-point {
  filter: drop-shadow(0 1px 2px rgb(15 23 42 / 24%));
}
</style>
