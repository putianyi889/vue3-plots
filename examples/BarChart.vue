<template>
    <div class="example-frame plot" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
        <TransformGroup :domain="domain" :size="size">
            <Grid :x-ticks="barPositions" :y-ticks="yTicks" stroke-color="#e2e8f0" />
            <Bar
                ref="firstSeries"
                :series-count="2"
                :values="revenue"
                fill="#2563eb"
            />
            <Bar
                :series-count="2"
                :series-index="1"
                :values="profit"
                fill="#16a34a"
            />
            <XAxis :ticks="barPositions" stroke-color="#334155" />
            <YAxis :ticks="yTicks" stroke-color="#334155" />
        </TransformGroup>
    </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { Bar, Grid, TransformGroup, XAxis, YAxis, getNiceTicks } from '@putianyi888/vue3-plots'
import type { PlotDomain, PlotSize } from '@putianyi888/vue3-plots'

const revenue = [2, 4, 3, 6, 5]
const profit = [1, 3, 2, 4, 3]
const size: PlotSize = { width: 640, height: 360 }
const domain: PlotDomain = { xMin: -0.5, xMax: 4.5, yMin: 0, yMax: 6.5 }
const yTicks = getNiceTicks(domain.yMin, domain.yMax)
const firstSeries = useTemplateRef('firstSeries')
const barPositions = computed(() => firstSeries.value?.positions ?? [])
</script>

<style scoped>
.example-frame {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  background: #ffffff;
}

.plot {
  position: relative;
}
</style>
