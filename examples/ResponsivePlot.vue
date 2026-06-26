<template>
    <div class="resize-frame">
        <div class="chart">
            <YLabel class="chart-y-label">
                Value
            </YLabel>
            <div ref="plot" class="plot">
                <TransformGroup :domain="domain" :size="size">
                    <Grid :x-ticks="xTicks" :y-ticks="yTicks" stroke-color="#e2e8f0" />
                    <Line :points="points" stroke-color="#16a34a" :stroke-width="2" />
                    <Scatter fill-color="#14532d" :points="points" :radius="4" />
                    <Axis direction="horizontal" stroke-color="#334155" :ticks="xTicks" />
                    <Axis direction="vertical" stroke-color="#334155" :ticks="yTicks" />
                </TransformGroup>
            </div>
            <XLabel class="chart-x-label">
                Sample
            </XLabel>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { computed, ref, useTemplateRef } from 'vue'
import { Axis, Grid, Line, Scatter, TransformGroup, XLabel, YLabel, getDataDomain, getNiceTicks } from '@putianyi888/vue3-plots'
import type { PlotPoint, PlotSize } from '@putianyi888/vue3-plots'

const plot = useTemplateRef<HTMLElement>('plot')
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

useResizeObserver(plot, ([entry]) => {
    if (!entry) return

    size.value = {
        width: Math.max(220, Math.round(entry.contentRect.width)),
        height: Math.max(180, Math.round(entry.contentRect.height)),
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

.chart {
  display: grid;
  grid-template-columns: auto minmax(220px, 1fr);
  grid-template-rows: minmax(180px, 1fr) auto;
  height: 100%;
  width: 100%;
}

.plot {
  grid-column: 2;
  grid-row: 1;
  min-width: 0;
  min-height: 0;
  position: relative;
}

.chart-x-label,
.chart-y-label {
  position: static;
  height: auto !important;
  width: auto !important;
}

.chart-x-label {
  grid-column: 2;
  grid-row: 2;
  padding-top: 6px;
}

.chart-y-label {
  grid-column: 1;
  grid-row: 1;
  padding-right: 6px;
}
</style>
