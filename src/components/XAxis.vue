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

import { createLinearScale, defaultPlotPadding, formatTick, getMaybeArray, getPlotArea } from './utils'
import type { MaybeArray, PlotDomain, PlotPadding, PlotSize } from './utils'

type TextAnchor = 'start' | 'middle' | 'end'

defineSlots<{
  tick: (props: { tick: number, x: number, y: number }) => unknown
}>()

const props = defineProps({
  domain: { type: Object as PropType<PlotDomain>, required: true },
  size: { type: Object as PropType<PlotSize>, default: () => ({ width: 320, height: 200 }) },
  padding: { type: Object as PropType<PlotPadding>, default: () => defaultPlotPadding },
  ticks: { type: Array as PropType<number[]>, default: () => [] },
  y: { type: Number, default: undefined },
  offset: { type: Number, default: 24 },
  textAnchor: { type: String as PropType<TextAnchor>, default: 'middle' },
  tickSize: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 4 },
  strokeColor: { type: [String, Array] as PropType<MaybeArray<string>>, default: 'none' },
  strokeOpacity: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
  strokeWidth: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
})

const area = computed(() => getPlotArea(props.size, props.padding))
const xScale = computed(() => createLinearScale(props.domain.xMin, props.domain.xMax, area.value.x, area.value.x + area.value.width))
const yScale = computed(() => createLinearScale(props.domain.yMin, props.domain.yMax, area.value.y + area.value.height, area.value.y))
const axisY = computed(() => props.y === undefined ? area.value.y + area.value.height : yScale.value(props.y))
</script>
