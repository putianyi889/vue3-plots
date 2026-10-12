<template>
    <svg
        class="plot-layer plot-layer--passive plot-line"
        :height="size.height"
        :width="size.width"
        :viewBox="`0 0 ${size.width} ${size.height}`"
        preserveAspectRatio="none"
    >
        <path
            v-if="pathData"
            :d="pathData"
            :stroke="strokeColor"
            :stroke-linecap="lineCap"
            :stroke-linejoin="lineJoin"
            :stroke-opacity="strokeOpacity"
            :stroke-width="strokeWidth"
            fill="none"
            vector-effect="non-scaling-stroke"
        />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { usePlotContext } from './context'
import { createLinePath } from './line-path'
import { createLinearScale, getPlotArea } from './utils'
import type { PlotDomain, PlotPadding, PlotPoint, PlotSize } from './utils'

const props = defineProps({
    /** Data points to connect in order. */
    points: { type: Array as PropType<PlotPoint[]>, required: true },
    /** Data-space bounds used to map points onto the plot area. */
    domain: { type: Object as PropType<PlotDomain>, default: undefined },
    /** Outer SVG size in pixels. */
    size: { type: Object as PropType<PlotSize>, default: undefined },
    /** Insets shared with other plot layers. */
    padding: { type: Object as PropType<PlotPadding>, default: undefined },
    /** Optional peak-preserving sampling per SVG pixel column. X reversals retain the full path. */
    sampling: { type: String as PropType<'none' | 'min-max'>, default: 'none' },
    /** Line color. */
    strokeColor: { type: String, default: 'none' },
    /** Line opacity. */
    strokeOpacity: { type: Number, default: 1 },
    /** Line width in pixels. */
    strokeWidth: { type: Number, default: 1 },
    /** SVG stroke-linecap value. */
    lineCap: { type: String as PropType<'butt' | 'round' | 'square'>, default: 'butt' },
    /** SVG stroke-linejoin value. */
    lineJoin: { type: String as PropType<'bevel' | 'miter' | 'inherit' | 'round'>, default: 'miter' },
})

const { domain, padding, size } = usePlotContext(props)

const pathData = computed(() => {
    const area = getPlotArea(size.value, padding.value)
    const scaleX = createLinearScale(domain.value.xMin, domain.value.xMax, area.x, area.x + area.width)
    const scaleY = createLinearScale(domain.value.yMin, domain.value.yMax, area.y + area.height, area.y)
    return createLinePath(props.points, scaleX, scaleY, props.sampling)
})
</script>
