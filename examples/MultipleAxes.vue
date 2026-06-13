<template>
    <div style="position: relative; width: 640px; height: 360px; background: white">
        <TransformGroup :domain="domain1" :size="size" :padding="padding">
            <YAxis :ticks="yTicks1" :offset="12" :tick-size="-4" :x="0" stroke-color="#334155" />
            <YAxis :ticks="yTicks1" :offset="-12" :x="5" stroke-color="#334155" />
        </TransformGroup>
        <TransformGroup :domain="domain2" :size="size" :padding="padding">
            <YAxis :ticks="yTicks2" :offset="12" :tick-size="-4" :x="5" stroke-color="#334155" />
            <YAxis :ticks="yTicks2" :offset="-12" :x="10" stroke-color="#334155" />
        </TransformGroup>
    </div>
</template>

<script setup lang="ts">
import { TransformGroup, YAxis } from '@putianyi888/vue3-plots'

const size = { width: 640, height: 360 }
const padding = { top: 30, right: 30, bottom: 30, left: 30 }
const domain1 = { xMin: 0, xMax: 10, yMin: 0, yMax: 10 }
const domain2 = { xMin: 0, xMax: 10, yMin: 0, yMax: 20 }
const yTicks1 = [0, 5, 10]
const yTicks2 = [0, 5, 10, 15, 20]
</script>
