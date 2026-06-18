<template>
    <svg
        class="plot-layer plot-layer--passive plot-scatter"
        :height="size.height"
        :width="size.width"
        :viewBox="`0 0 ${size.width} ${size.height}`"
        preserveAspectRatio="none"
    >
        <g
            v-for="(point, index) in renderedPoints"
            :key="index"
            class="plot-scatter__point"
            :class="{ 'plot-scatter__point--interactive': interactive }"
            :transform="`translate(${point.x}, ${point.y})`"
            @click="emitPointClick(point.source)"
            @mouseenter="emitPointEnter(point.source)"
            @mouseleave="emitPointLeave(point.source)"
        >
            <slot name="point" :index="point.index" :x="point.x" :y="point.y" :point="point.source">
                <circle
                    cx="0"
                    cy="0"
                    :r="getMaybeArray(radius, point.index)"
                    :fill="getMaybeArray(fillColor, point.index)"
                    :fill-opacity="getMaybeArray(fillOpacity, point.index)"
                    :stroke="getMaybeArray(strokeColor, point.index)"
                    :stroke-opacity="getMaybeArray(strokeOpacity, point.index)"
                    :stroke-width="getMaybeArray(strokeWidth, point.index)"
                    vector-effect="non-scaling-stroke"
                />
            </slot>
        </g>
    </svg>
</template>

<script setup lang="ts" generic="T = unknown">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { usePlotContext } from './context'
import { createLinearScale, getMaybeArray, getPlotArea, pointToSvg } from './utils'
import type { MaybeArray, PlotDomain, PlotPadding, PlotPoint, PlotSize } from './utils'

const props = defineProps({
    /** Data points to render. */
    points: { type: Array as PropType<PlotPoint<T>[]>, required: true },
    /** Data-space bounds used to map points onto the plot area. */
    domain: { type: Object as PropType<PlotDomain>, default: undefined },
    /** Outer SVG size in pixels. */
    size: { type: Object as PropType<PlotSize>, default: undefined },
    /** Insets shared with other plot layers. */
    padding: { type: Object as PropType<PlotPadding>, default: undefined },
    /** Whether points emit pointer events and use interactive pointer styling. */
    interactive: Boolean,
    /** Circle radius in pixels. */
    radius: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 0 },
    /** Circle fill color. */
    fillColor: { type: [String, Array] as PropType<MaybeArray<string>>, default: 'black' },
    /** Circle fill opacity. */
    fillOpacity: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
    /** Circle outline color. */
    strokeColor: { type: [String, Array] as PropType<MaybeArray<string>>, default: 'none' },
    /** Circle outline opacity. */
    strokeOpacity: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
    /** Circle outline width in pixels. */
    strokeWidth: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
})

const emit = defineEmits<{
    /** Emitted when a rendered point is clicked. */
    (e: 'pointClick', point: PlotPoint<T>): void
    /** Emitted when the pointer enters a rendered point. */
    (e: 'pointEnter', point: PlotPoint<T>): void
    /** Emitted when the pointer leaves a rendered point. */
    (e: 'pointLeave', point: PlotPoint<T>): void
}>()

defineSlots<{
    /** Custom renderer for a data point marker. */
    point: (props: { index: number, x: number, y: number, point: PlotPoint<T> }) => unknown
}>()

const { domain, padding, size } = usePlotContext(props)

function emitPointClick(point: PlotPoint<T>) {
    if (props.interactive) emit('pointClick', point)
}

function emitPointEnter(point: PlotPoint<T>) {
    if (props.interactive) emit('pointEnter', point)
}

function emitPointLeave(point: PlotPoint<T>) {
    if (props.interactive) emit('pointLeave', point)
}

const renderedPoints = computed(() => {
    const area = getPlotArea(size.value, padding.value)
    const scaleX = createLinearScale(domain.value.xMin, domain.value.xMax, area.x, area.x + area.width)
    const scaleY = createLinearScale(domain.value.yMin, domain.value.yMax, area.y + area.height, area.y)
    const result = []

    for (let i = 0; i < props.points.length; i++) {
        const point = props.points[i]
        if (!point) continue
        if (Number.isFinite(point.x) && Number.isFinite(point.y)) {
            result.push({
                ...pointToSvg(point, scaleX, scaleY),
                index: i,
                source: point,
            })
        }
    }

    return result
})
</script>

<style scoped>
.plot-scatter__point {
    pointer-events: none;
}

.plot-scatter__point--interactive {
    cursor: pointer;
    pointer-events: auto;
}
</style>
