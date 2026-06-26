<template>
    <div style="position: relative; width: 640px; height: 360px;">
        <TransformGroup :domain="domain" :size="size" :padding="padding">
            <Axis direction="horizontal" :ticks="xTicks" :offset="12" :tick-size="-4" :position="0" />
            <Axis direction="horizontal" :ticks="xTicks" :offset="-12" :position="10" />
            <Axis direction="vertical" :ticks="yTicks" :offset="-12" :tick-size="-4" :position="0" />
            <Axis direction="vertical" :ticks="yTicks" :offset="12" :position="10" />
        </TransformGroup>
    </div>
</template>

<script setup lang="ts">
import { Axis, TransformGroup } from '@putianyi888/vue3-plots'

const size = { width: 640, height: 360 }
const padding = { top: 30, right: 30, bottom: 30, left: 30 }
const domain = { xMin: 0, xMax: 10, yMin: 0, yMax: 10 }
const xTicks = [0, 2, 4, 6, 8, 10]
const yTicks = [0, 5, 10]
</script>
