<template>
    <div ref="container" class="resize-frame">
        <div class="plot" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
            <TransformGroup :domain="domain" :size="size">
                <Grid :x-ticks="xTicks" :y-ticks="yTicks" stroke-color="#e2e8f0" />
                <Line :points="points" stroke-color="#16a34a" :stroke-width="2" />
                <Scatter fill-color="#14532d" :points="points" :radius="4" />
                <XAxis stroke-color="#334155" :ticks="xTicks" />
                <YAxis stroke-color="#334155" :ticks="yTicks" />
            </TransformGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'
import { Grid, Line, Scatter, TransformGroup, XAxis, YAxis, getDataDomain, getNiceTicks } from '@putianyi888/vue3-plots'
import type { PlotPoint, PlotSize } from '@putianyi888/vue3-plots'

const container = useTemplateRef<HTMLElement>('container')
const size = ref<PlotSize>({ width: 640, height: 320 })
const points: PlotPoint[] = [
    { x: 0, y: 8 },
    { x: 1, y: 12 },
    { x: 2, y: 7 },
    { x: 3, y: 16 },
    { x: 4, y: 13 },
    { x: 5, y: 20 },
]
const domain = getDataDomain(points, 0.1)
const xTicks = computed(() => getNiceTicks(domain.xMin, domain.xMax))
const yTicks = computed(() => getNiceTicks(domain.yMin, domain.yMax))

useResizeObserver(container, ([entry]) => {
    if (!entry) return

    size.value = {
        width: Math.max(260, Math.round(entry.contentRect.width)),
        height: Math.max(220, Math.round(entry.contentRect.height)),
    }
})
</script>

<style scoped>
.resize-frame {
  overflow: auto;
  min-width: 320px;
  max-width: 100%;
  min-height: 260px;
  height: 320px;
  resize: both;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}

.plot {
  position: relative;
}
</style>
