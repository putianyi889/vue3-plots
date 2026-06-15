<template>
    <svg
        class="plot-x-axis plot-layer plot-layer--passive"
        :height="size.height"
        :width="size.width"
        :viewBox="`0 0 ${size.width} ${size.height}`"
        preserveAspectRatio="none"
    >
        <line
            :stroke="getMaybeArray(strokeColor, 0)"
            :stroke-opacity="getMaybeArray(strokeOpacity, 0)"
            :stroke-width="getMaybeArray(strokeWidth, 0)"
            :x1="area.x"
            :x2="area.x + area.width"
            :y1="axisY"
            :y2="axisY"
            vector-effect="non-scaling-stroke"
        />

        <g v-for="(tick, index) in ticks" :key="tick" class="plot-x-axis__tick">
            <line
                :stroke="getMaybeArray(strokeColor, index)"
                :stroke-opacity="getMaybeArray(strokeOpacity, index)"
                :stroke-width="getMaybeArray(strokeWidth, index)"
                :x1="xScale(tick)"
                :x2="xScale(tick)"
                :y1="axisY"
                :y2="axisY + getMaybeArray(tickSize, index)"
                vector-effect="non-scaling-stroke"
            />
            <text
                :text-anchor="textAnchor"
                :x="xScale(tick)"
                :y="axisY + offset"
                dominant-baseline="middle"
            >
                <slot
                    name="tick"
                    :tick="tick"
                    :x="xScale(tick)"
                    :y="axisY + offset"
                >
                    {{ formatTick(tick) }}
                </slot>
            </text>
        </g>
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { usePlotContext } from './context'
import { createLinearScale, formatTick, getMaybeArray, getPlotArea } from './utils'
import type { MaybeArray, PlotDomain, PlotPadding, PlotSize } from './utils'

type TextAnchor = 'start' | 'middle' | 'end'

const props = defineProps({
    /** Data-space bounds used to map tick values onto the plot area. */
    domain: { type: Object as PropType<PlotDomain>, default: undefined },
    /** Outer SVG size in pixels. */
    size: { type: Object as PropType<PlotSize>, default: undefined },
    /** Insets shared with other plot layers. */
    padding: { type: Object as PropType<PlotPadding>, default: undefined },
    /** X-axis tick values in data-space coordinates. */
    ticks: { type: Array as PropType<number[]>, default: () => [] },
    /** Axis line y position in data-space coordinates. */
    y: { type: Number, default: undefined },
    /** Tick label center y offset from the axis line in pixels. */
    offset: { type: Number, default: 24 },
    /** SVG text-anchor value for tick labels. */
    textAnchor: { type: String as PropType<TextAnchor>, default: 'middle' },
    /** Tick mark length in pixels. */
    tickSize: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 4 },
    /** Axis line and tick mark color. */
    strokeColor: { type: [String, Array] as PropType<MaybeArray<string>>, default: 'none' },
    /** Axis line and tick mark opacity. */
    strokeOpacity: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
    /** Axis line and tick mark width in pixels. */
    strokeWidth: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
})

defineSlots<{
    tick: (props: { tick: number, x: number, y: number }) => unknown
}>()

const { domain, padding, size } = usePlotContext(props)
const area = computed(() => getPlotArea(size.value, padding.value))
const xScale = computed(() => createLinearScale(domain.value.xMin, domain.value.xMax, area.value.x, area.value.x + area.value.width))
const yScale = computed(() => createLinearScale(domain.value.yMin, domain.value.yMax, area.value.y + area.value.height, area.value.y))
const axisY = computed(() => props.y === undefined ? area.value.y + area.value.height : yScale.value(props.y))
</script>
