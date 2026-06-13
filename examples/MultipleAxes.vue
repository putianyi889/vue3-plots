<template>
    <div style="position: relative; width: 640px; height: 360px; background: white">
        <YAxis :domain="domain1" :size="size" :padding="padding" :ticks="yTicks1" :offset="12" :tick-size="-4" :x="0" stroke-color="#334155" />
        <YAxis :domain="domain1" :size="size" :padding="padding" :ticks="yTicks1" :offset="-12" :x="5" stroke-color="#334155" />
        <YAxis :domain="domain2" :size="size" :padding="padding" :ticks="yTicks2" :offset="12" :tick-size="-4" :x="5" stroke-color="#334155" />
        <YAxis :domain="domain2" :size="size" :padding="padding" :ticks="yTicks2" :offset="-12" :x="10" stroke-color="#334155" />
    </div>
</template>

<script setup lang="ts">
import { YAxis } from '@putianyi888/vue3-plots'

const size = { width: 640, height: 360 }
const padding = { top: 30, right: 30, bottom: 30, left: 30 }
const domain1 = { xMin: 0, xMax: 10, yMin: 0, yMax: 10 }
const domain2 = { xMin: 0, xMax: 10, yMin: 0, yMax: 20 }
const yTicks1 = [0, 5, 10]
const yTicks2 = [0, 5, 10, 15, 20]
</script>
