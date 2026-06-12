<template>
    <svg
        class="plot-grid plot-layer plot-layer--passive"
        :height="size.height"
        :width="size.width"
        :viewBox="`0 0 ${size.width} ${size.height}`"
        preserveAspectRatio="none"
    >
        <line
            v-for="(tick, index) in xTicks"
            :key="`x-${tick}`"
            :stroke="getMaybeArray(strokeColor, index)"
            :stroke-dasharray="getMaybeArray(dashArray, index)"
            :stroke-opacity="getMaybeArray(strokeOpacity, index)"
            :stroke-width="getMaybeArray(strokeWidth, index)"
            :x1="xScale(tick)"
            :x2="xScale(tick)"
            :y1="area.y"
            :y2="area.y + area.height"
            vector-effect="non-scaling-stroke"
        />
        <line
            v-for="(tick, index) in yTicks"
            :key="`y-${tick}`"
            :stroke="getMaybeArray(strokeColor, xTicks.length + index)"
            :stroke-dasharray="getMaybeArray(dashArray, xTicks.length + index)"
            :stroke-opacity="getMaybeArray(strokeOpacity, xTicks.length + index)"
            :stroke-width="getMaybeArray(strokeWidth, xTicks.length + index)"
            :x1="area.x"
            :x2="area.x + area.width"
            :y1="yScale(tick)"
            :y2="yScale(tick)"
            vector-effect="non-scaling-stroke"
        />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { createLinearScale, defaultPlotPadding, getMaybeArray, getPlotArea } from './utils'
import type { MaybeArray, PlotDomain, PlotPadding, PlotSize } from './utils'

const props = defineProps({
  domain: { type: Object as PropType<PlotDomain>, required: true },
  size: { type: Object as PropType<PlotSize>, default: () => ({ width: 320, height: 200 }) },
  padding: { type: Object as PropType<PlotPadding>, default: () => defaultPlotPadding },
  xTicks: { type: Array as PropType<number[]>, default: () => [] },
  yTicks: { type: Array as PropType<number[]>, default: () => [] },
  strokeColor: { type: [String, Array] as PropType<MaybeArray<string>>, default: 'none' },
  strokeOpacity: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
  strokeWidth: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
  dashArray: { type: [String, Array] as PropType<MaybeArray<string>>, default: 'none' },
})

const area = computed(() => getPlotArea(props.size, props.padding))
const xScale = computed(() => createLinearScale(props.domain.xMin, props.domain.xMax, area.value.x, area.value.x + area.value.width))
const yScale = computed(() => createLinearScale(props.domain.yMin, props.domain.yMax, area.value.y + area.value.height, area.value.y))
</script>
