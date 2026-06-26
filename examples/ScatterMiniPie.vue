<template>
    <div class="example-frame" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
        <TransformGroup :domain="domain" :size="size" :padding="padding">
            <Scatter :points="points">
                <template #point="{ point }">
                    <MiniPie
                        :data="point.data"
                        :radius="pieRadius"
                        :start-angle="-90"
                        :style="{ height: `${pieRadius * 2}px`, width: `${pieRadius * 2}px`, x: `${-pieRadius}px`, y: `${-pieRadius}px` }"
                    />
                </template>
            </Scatter>
        </TransformGroup>
    </div>
</template>

<script setup lang="ts">
import { MiniPie, Scatter, TransformGroup, getDataDomain } from '@putianyi888/vue3-plots'
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
const pieRadius = 12
</script>

<style scoped>
.example-frame {
  overflow-x: auto;
  padding: 16px;
  position: relative;
}
</style>
