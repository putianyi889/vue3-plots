<template>
    <div class="example-frame" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
        <TransformGroup ref="transformGroup" :domain="domain" :size="size" :padding="padding">
            <Grid :x-ticks="xTicks" :y-ticks="yTicks" stroke-color="#e2e8f0" />
            <Scatter :points="points">
                <template #point="{ index, x, y, point }">
                    <rect
                        :x="-barWidth / 2" :y="0"
                        :width="barWidth"
                        :height="transformGroup?.scaleY(domain.yMin) - transformGroup?.scaleY(point.y)"
                        fill="#2563eb" fill-opacity="0.78"
                    />
                    <line
                        v-if="index > 0"
                        :x1="transformGroup?.scaleX(points[index - 1].x) - x"
                        :y1="transformGroup?.scaleY(points[index - 1].y) - y"
                        x2="0" y2="0" stroke="#2563eb" stroke-width="2"
                        vector-effect="non-scaling-stroke"
                    />
                    <circle cx="0" cy="0" r="4" fill="#0f172a" />
                </template>
            </Scatter>
            <Axis direction="horizontal" :ticks="xTicks" />
            <Axis direction="vertical" :ticks="yTicks" />
        </TransformGroup>
    </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { Axis, Grid, Scatter, TransformGroup, getDataDomain, getNiceTicks } from '@putianyi888/vue3-plots'
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
const transformGroup = useTemplateRef('transformGroup')

const barWidth = computed(() => Math.abs(transformGroup.value?.scaleX(domain.xMin + 0.64) - transformGroup.value?.scaleX(domain.xMin)))
</script>

<style scoped>
.example-frame {
  overflow-x: auto;
  padding: 16px;
  position: relative;
}
</style>
