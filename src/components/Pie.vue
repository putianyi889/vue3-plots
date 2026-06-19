<template>
    <svg
        class="plot-layer plot-pie"
        :class="interactive ? 'plot-layer--interactive' : 'plot-layer--passive'"
        :height="size.height" :width="size.width"
        :viewBox="`0 0 ${size.width} ${size.height}`"
        preserveAspectRatio="none"
    >
        <g :transform="`translate(${center.x}, ${center.y})`">
            <path
                v-for="(sector, index) in sectors"
                :key="index"
                class="plot-pie__piece"
                :class="{ 'plot-pie__piece--interactive': interactive }"
                :d="sector.svgPath()"
                :fill="data[index]?.color"
                :stroke="getMaybeArray(strokeColor, index)"
                :stroke-width="getMaybeArray(strokeWidth, index)"
                vector-effect="non-scaling-stroke"
                @click="emitPieceClick(index, sector)"
                @mouseenter="emitPieceMouseEnter(index, sector)"
                @mouseleave="emitPieceMouseLeave(index, sector)"
            />
        </g>
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { usePlotFrame } from './context'
import { AnnularSector } from './geometry'
import { getMaybeArray, getPlotArea } from './utils'
import type { MaybeArray, PlotPadding, PlotSize } from './utils'

type PieDatum = {
    value: number
    color: string
}

type PiePiece = {
    index: number
    data: PieDatum
    sector: AnnularSector
}

const props = defineProps({
    /** Pie segments in drawing order. */
    data: { type: Array as PropType<PieDatum[]>, required: true },
    /** Outer SVG size in pixels. */
    size: { type: Object as PropType<PlotSize>, default: undefined },
    /** Insets used to calculate the plot area. */
    padding: { type: Object as PropType<PlotPadding>, default: undefined },
    /** Inner radius for each slice in SVG units. Pass a non-negative value. */
    innerRadius: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 0 },
    /** Outer radius for each slice in SVG units. Pass a positive value. Defaults to a quarter of the smaller plot-area dimension. */
    outerRadius: { type: [Number, Array] as PropType<MaybeArray<number>>, default: undefined },
    /** Total value used to normalize segments. Defaults to the sum of data values. */
    total: { type: Number, default: undefined },
    /** Start angle in degrees. Zero degrees points right. */
    startAngle: { type: Number, default: 0 },
    /** Whether slices emit pointer events and use interactive pointer styling. */
    interactive: Boolean,
    /** Slice outline color. */
    strokeColor: { type: [String, Array] as PropType<MaybeArray<string>>, default: 'none' },
    /** Slice outline width in SVG units. */
    strokeWidth: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
})

const emit = defineEmits<{
    /** Emitted when a rendered slice is clicked. */
    (e: 'click', piece: PiePiece): void
    /** Emitted when the pointer enters a rendered slice. */
    (e: 'mouseEnter', piece: PiePiece): void
    /** Emitted when the pointer leaves a rendered slice. */
    (e: 'mouseLeave', piece: PiePiece): void
}>()

const { padding, size } = usePlotFrame(props)
const area = computed(() => getPlotArea(size.value, padding.value))
const center = computed(() => ({
    x: area.value.x + area.value.width / 2,
    y: area.value.y + area.value.height / 2,
}))

const _outerRadius = computed(() => props.outerRadius ?? Math.min(area.value.width, area.value.height) / 4)

const _Total = computed(() => props.total ?? props.data.reduce((sum, item) => sum + item.value, 0))

const sectors = computed(() => {
    const result = [] as AnnularSector[]
    let angle = props.startAngle

    for (let index = 0; index < props.data.length; index++) {
        const item = props.data[index]
        const sweep = item.value / _Total.value * 360

        result.push(new AnnularSector(0, 0, getMaybeArray(props.innerRadius, index), getMaybeArray(_outerRadius.value, index), angle, sweep))

        angle += sweep
    }

    return result
})

function emitPieceClick(index: number, sector: AnnularSector) {
    if (props.interactive) emit('click', createPiece(index, sector))
}

function emitPieceMouseEnter(index: number, sector: AnnularSector) {
    if (props.interactive) emit('mouseEnter', createPiece(index, sector))
}

function emitPieceMouseLeave(index: number, sector: AnnularSector) {
    if (props.interactive) emit('mouseLeave', createPiece(index, sector))
}

function createPiece(index: number, sector: AnnularSector): PiePiece {
    return {
        index,
        data: props.data[index] as PieDatum,
        sector,
    }
}
</script>

<style scoped>
.plot-pie__piece {
    pointer-events: none;
}

.plot-pie__piece--interactive {
    cursor: pointer;
    pointer-events: auto;
}
</style>
