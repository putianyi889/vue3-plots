<template>
    <div class="example-frame" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
        <TransformGroup :domain="domain" :size="size" :padding="padding">
            <Grid :x-ticks="xTicks" :y-ticks="yTicks" stroke-color="#e2e8f0" :stroke-opacity="0.5" />
            <Axis direction="horizontal" :position="25" :ticks="xTicks">
                <template #tick="{ tick }">
                    {{ months[tick] }}
                </template>
            </Axis>
            <Axis direction="vertical" :ticks="yTicks" />
        </TransformGroup>
    </div>
</template>

<script setup lang="ts">
import { Axis, Grid, TransformGroup } from '@putianyi888/vue3-plots'
import type { PlotDomain, PlotPadding, PlotSize } from '@putianyi888/vue3-plots'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const size: PlotSize = { width: 640, height: 240 }
const padding: PlotPadding = { top: 24, right: 24, bottom: 40, left: 48 }
const domain: PlotDomain = { xMin: -0.5, xMax: months.length - 0.5, yMin: 0, yMax: 100 }
const xTicks = months.map((_, index) => index)
const yTicks = [0, 25, 50, 75, 100]
</script>

<style scoped>
.example-frame {
  overflow-x: auto;
  position: relative;
}
</style>
