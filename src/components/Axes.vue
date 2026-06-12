<template>
    <svg
        class="plot-axes plot-layer plot-layer--passive"
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
            :y1="area.y + area.height"
            :y2="area.y + area.height"
            vector-effect="non-scaling-stroke"
        />
        <line
            :stroke="getMaybeArray(strokeColor, 0)"
            :stroke-opacity="getMaybeArray(strokeOpacity, 0)"
            :stroke-width="getMaybeArray(strokeWidth, 0)"
            :x1="area.x"
            :x2="area.x"
            :y1="area.y"
            :y2="area.y + area.height"
            vector-effect="non-scaling-stroke"
        />

        <g v-for="(tick, index) in xTicks" :key="`x-${tick}`" class="plot-axes__tick">
            <line
                :stroke="getMaybeArray(strokeColor, index)"
                :stroke-opacity="getMaybeArray(strokeOpacity, index)"
                :stroke-width="getMaybeArray(strokeWidth, index)"
                :x1="xScale(tick)"
                :x2="xScale(tick)"
                :y1="area.y + area.height"
                :y2="area.y + area.height + getMaybeArray(tickSize, index)"
                vector-effect="non-scaling-stroke"
            />
            <text
                :x="xScale(tick)"
                :y="area.y + area.height + getMaybeArray(tickSize, index) + tickLabelOffset"
                text-anchor="middle"
            >
                <slot
                    name="x-tick"
                    :tick="tick"
                    :x="xScale(tick)"
                    :y="area.y + area.height + getMaybeArray(tickSize, index) + tickLabelOffset"
                >
                    {{ formatTick(tick) }}
                </slot>
            </text>
        </g>

        <g v-for="(tick, index) in yTicks" :key="`y-${tick}`" class="plot-axes__tick">
            <line
                :stroke="getMaybeArray(strokeColor, xTicks.length + index)"
                :stroke-opacity="getMaybeArray(strokeOpacity, xTicks.length + index)"
                :stroke-width="getMaybeArray(strokeWidth, xTicks.length + index)"
                :x1="area.x - getMaybeArray(tickSize, xTicks.length + index)"
                :x2="area.x"
                :y1="yScale(tick)"
                :y2="yScale(tick)"
                vector-effect="non-scaling-stroke"
            />
            <text
                :x="area.x - getMaybeArray(tickSize, xTicks.length + index) - 4"
                :y="yScale(tick)"
                dominant-baseline="middle"
                text-anchor="end"
            >
                <slot
                    name="y-tick"
                    :tick="tick"
                    :x="area.x - getMaybeArray(tickSize, xTicks.length + index) - 4"
                    :y="yScale(tick)"
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

defineSlots<{
  'x-tick': (props: { tick: number, x: number, y: number }) => unknown
  'y-tick': (props: { tick: number, x: number, y: number }) => unknown
}>()

const props = defineProps({
  domain: { type: Object as PropType<PlotDomain>, required: true },
  size: { type: Object as PropType<PlotSize>, default: () => ({ width: 320, height: 200 }) },
  padding: { type: Object as PropType<PlotPadding>, default: () => defaultPlotPadding },
  xTicks: { type: Array as PropType<number[]>, default: () => [] },
  yTicks: { type: Array as PropType<number[]>, default: () => [] },
  tickSize: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 4 },
  strokeColor: { type: [String, Array] as PropType<MaybeArray<string>>, default: 'none' },
  strokeOpacity: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
  strokeWidth: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
})

const tickLabelOffset = 16
const area = computed(() => getPlotArea(props.size, props.padding))
const xScale = computed(() => createLinearScale(props.domain.xMin, props.domain.xMax, area.value.x, area.value.x + area.value.width))
const yScale = computed(() => createLinearScale(props.domain.yMin, props.domain.yMax, area.value.y + area.value.height, area.value.y))
</script>
