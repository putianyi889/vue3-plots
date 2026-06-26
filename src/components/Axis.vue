<template>
    <svg
        class="plot-axis plot-layer plot-layer--passive"
        :class="`plot-axis--${direction}`"
        :height="size.height"
        :width="size.width"
        :viewBox="`0 0 ${size.width} ${size.height}`"
        preserveAspectRatio="none"
    >
        <line
            stroke="currentColor"
            :stroke-opacity="getMaybeArray(strokeOpacity, 0)"
            :stroke-width="getMaybeArray(strokeWidth, 0)"
            :x1="axisLine.x1"
            :x2="axisLine.x2"
            :y1="axisLine.y1"
            :y2="axisLine.y2"
            vector-effect="non-scaling-stroke"
        />

        <g v-for="(tick, index) in ticks" :key="index" class="plot-axis__tick">
            <line
                stroke="currentColor"
                :stroke-opacity="getMaybeArray(strokeOpacity, index)"
                :stroke-width="getMaybeArray(strokeWidth, index)"
                :x1="getTickLine(tick, index).x1"
                :x2="getTickLine(tick, index).x2"
                :y1="getTickLine(tick, index).y1"
                :y2="getTickLine(tick, index).y2"
                vector-effect="non-scaling-stroke"
            />
            <text
                fill="currentColor"
                :text-anchor="textAnchor"
                :x="getTickLabel(tick).x"
                :y="getTickLabel(tick).y"
                dominant-baseline="middle"
            >
                <slot
                    name="tick"
                    :tick="tick"
                    :x="getTickLabel(tick).x"
                    :y="getTickLabel(tick).y"
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

type AxisDirection = 'horizontal' | 'vertical'
type TextAnchor = 'start' | 'middle' | 'end'

const props = defineProps({
    /** Data-space bounds used to map tick values onto the plot area. */
    domain: { type: Object as PropType<PlotDomain>, default: undefined },
    /** Outer SVG size in pixels. */
    size: { type: Object as PropType<PlotSize>, default: undefined },
    /** Insets shared with other plot layers. */
    padding: { type: Object as PropType<PlotPadding>, default: undefined },
    /** Axis direction. Horizontal maps ticks on x; vertical maps ticks on y. */
    direction: { type: String as PropType<AxisDirection>, required: true },
    /** Axis tick values in data-space coordinates. */
    ticks: { type: Array as PropType<number[]>, default: () => [] },
    /** Axis line position in data-space coordinates on the opposite axis. */
    position: { type: Number, default: undefined },
    /** Tick label center offset from the axis line in pixels. */
    offset: { type: Number, default: undefined },
    /** SVG text-anchor value for tick labels. */
    textAnchor: { type: String as PropType<TextAnchor>, default: 'middle' },
    /** Tick mark length in pixels. */
    tickSize: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 4 },
    /** Axis line and tick mark opacity. */
    strokeOpacity: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
    /** Axis line and tick mark width in pixels. */
    strokeWidth: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
})

defineSlots<{
    /** Custom renderer for a tick label. */
    tick: (props: { tick: number, x: number, y: number }) => unknown
}>()

const { domain, padding, size } = usePlotContext(props)
const area = computed(() => getPlotArea(size.value, padding.value))
const xScale = computed(() => createLinearScale(domain.value.xMin, domain.value.xMax, area.value.x, area.value.x + area.value.width))
const yScale = computed(() => createLinearScale(domain.value.yMin, domain.value.yMax, area.value.y + area.value.height, area.value.y))
const isHorizontal = computed(() => props.direction === 'horizontal')
const offset = computed(() => props.offset ?? (isHorizontal.value ? 24 : -24))
const axisPosition = computed(() => {
    if (props.position === undefined) {
        return isHorizontal.value ? area.value.y + area.value.height : area.value.x
    }

    return isHorizontal.value ? yScale.value(props.position) : xScale.value(props.position)
})
const axisLine = computed(() => {
    if (isHorizontal.value) {
        return {
            x1: area.value.x,
            x2: area.value.x + area.value.width,
            y1: axisPosition.value,
            y2: axisPosition.value,
        }
    }

    return {
        x1: axisPosition.value,
        x2: axisPosition.value,
        y1: area.value.y,
        y2: area.value.y + area.value.height,
    }
})

function getTickPosition(tick: number) {
    return isHorizontal.value ? xScale.value(tick) : yScale.value(tick)
}

function getTickLine(tick: number, index: number) {
    const tickPosition = getTickPosition(tick)
    const size = getMaybeArray(props.tickSize, index)

    if (isHorizontal.value) {
        return {
            x1: tickPosition,
            x2: tickPosition,
            y1: axisPosition.value,
            y2: axisPosition.value + size,
        }
    }

    return {
        x1: axisPosition.value,
        x2: axisPosition.value - size,
        y1: tickPosition,
        y2: tickPosition,
    }
}

function getTickLabel(tick: number) {
    const tickPosition = getTickPosition(tick)

    if (isHorizontal.value) {
        return {
            x: tickPosition,
            y: axisPosition.value + offset.value,
        }
    }

    return {
        x: axisPosition.value + offset.value,
        y: tickPosition,
    }
}
</script>
