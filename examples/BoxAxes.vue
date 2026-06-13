<template>
    <div style="position: relative; width: 640px; height: 360px; background: white">
        <TransformGroup :domain="domain" :size="size" :padding="padding">
            <XAxis :ticks="xTicks" :offset="12" :tick-size="-4" :y="0" stroke-color="#334155" />
            <XAxis :ticks="xTicks" :offset="-12" :y="10" stroke-color="#334155" />
            <YAxis :ticks="yTicks" :offset="-12" :tick-size="-4" :x="0" stroke-color="#334155" />
            <YAxis :ticks="yTicks" :offset="12" :x="10" stroke-color="#334155" />
        </TransformGroup>
    </div>
</template>

<script setup lang="ts">
import { TransformGroup, XAxis, YAxis } from '@putianyi888/vue3-plots'

const size = { width: 640, height: 360 }
const padding = { top: 30, right: 30, bottom: 30, left: 30 }
const domain = { xMin: 0, xMax: 10, yMin: 0, yMax: 10 }
const xTicks = [0, 2, 4, 6, 8, 10]
const yTicks = [0, 5, 10]
</script>
