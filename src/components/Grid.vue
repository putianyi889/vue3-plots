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

import { usePlotContext } from './context'
import { createLinearScale, getMaybeArray, getPlotArea } from './utils'
import type { MaybeArray, PlotDomain, PlotPadding, PlotSize } from './utils'

const props = defineProps({
    /** Data-space bounds used to place grid lines. */
    domain: { type: Object as PropType<PlotDomain>, default: undefined },
    /** Outer SVG size in pixels. */
    size: { type: Object as PropType<PlotSize>, default: undefined },
    /** Insets shared with other plot layers. */
    padding: { type: Object as PropType<PlotPadding>, default: undefined },
    /** X-axis grid positions in data-space coordinates. */
    xTicks: { type: Array as PropType<number[]>, default: () => [] },
    /** Y-axis grid positions in data-space coordinates. */
    yTicks: { type: Array as PropType<number[]>, default: () => [] },
    /** Grid line color. */
    strokeColor: { type: [String, Array] as PropType<MaybeArray<string>>, default: 'none' },
    /** Grid line opacity. */
    strokeOpacity: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
    /** Grid line width in pixels. */
    strokeWidth: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
    /** SVG stroke-dasharray value for grid lines. */
    dashArray: { type: [String, Array] as PropType<MaybeArray<string>>, default: 'none' },
})

const { domain, padding, size } = usePlotContext(props)
const area = computed(() => getPlotArea(size.value, padding.value))
const xScale = computed(() => createLinearScale(domain.value.xMin, domain.value.xMax, area.value.x, area.value.x + area.value.width))
const yScale = computed(() => createLinearScale(domain.value.yMin, domain.value.yMax, area.value.y + area.value.height, area.value.y))
</script>
