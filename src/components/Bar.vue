<template>
    <svg
        class="plot-bar plot-layer plot-layer--passive"
        :height="size.height"
        :viewBox="`0 0 ${size.width} ${size.height}`"
        :width="size.width"
        preserveAspectRatio="none"
    >
        <rect
            v-for="bar in bars"
            :key="bar.index"
            v-bind="$attrs"
            :height="bar.height"
            :width="bar.width"
            :x="bar.x"
            :y="bar.y"
        />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { usePlotContext } from './context'
import { createLinearScale, getPlotArea } from './utils'
import type { PlotDomain, PlotPadding, PlotSize } from './utils'

type BarRect = { height: number, index: number, position: number, value: number, width: number, x: number, y: number }

const props = defineProps({
    /** Bar values. Each index represents one automatically positioned category. */
    values: { type: Array as PropType<number[]>, required: true },
    /** Direction in which bars extend. */
    direction: { type: String as PropType<'vertical' | 'horizontal'>, default: 'vertical' },
    /** Data-space value from which bars extend. Defaults to the minimum value of the value axis domain. */
    baseline: { type: Number, default: undefined },
    /** Data-space bounds used to map bar values onto the plot area. */
    domain: { type: Object as PropType<PlotDomain>, default: undefined },
    /** Outer SVG size in pixels. */
    size: { type: Object as PropType<PlotSize>, default: undefined },
    /** Insets shared with other plot layers. */
    padding: { type: Object as PropType<PlotPadding>, default: undefined },
    /** Total number of side-by-side data series. */
    seriesCount: { type: Number, default: 1 },
    /** Zero-based index of this data series within its category group. */
    seriesIndex: { type: Number, default: 0 },
    /** Empty fraction of each category band between adjacent category groups. */
    gap: { type: Number, default: 0.2 },
    /** Gap between side-by-side series, as a fraction of the category band. */
    subGap: { type: Number, default: 0.04 },
})

defineOptions({
    inheritAttrs: false,
})

const { domain, padding, size } = usePlotContext(props)
const baseline = computed(() => props.baseline ?? (props.direction === 'vertical' ? domain.value.yMin : domain.value.xMin))
const area = computed(() => getPlotArea(size.value, padding.value))
const axisScale = computed(() => props.direction === 'vertical'
    ? createLinearScale(domain.value.xMin, domain.value.xMax, area.value.x, area.value.x + area.value.width)
    : createLinearScale(domain.value.yMin, domain.value.yMax, area.value.y + area.value.height, area.value.y))
const valueScale = computed(() => props.direction === 'vertical'
    ? createLinearScale(domain.value.yMin, domain.value.yMax, area.value.y + area.value.height, area.value.y)
    : createLinearScale(domain.value.xMin, domain.value.xMax, area.value.x, area.value.x + area.value.width))
const seriesCount = computed(() => Math.max(1, Math.floor(props.seriesCount)))
const seriesIndex = computed(() => Math.min(Math.max(0, Math.floor(props.seriesIndex)), seriesCount.value - 1))

/** Data-space centers of the automatically positioned bars. Use these as aligned axis ticks or Scatter coordinates. */
const positions = computed(() => {
    const count = props.values.length
    if (count === 0) return []

    const min = props.direction === 'vertical' ? domain.value.xMin : domain.value.yMin
    const max = props.direction === 'vertical' ? domain.value.xMax : domain.value.yMax

    return props.values.map((_, index) => min + (index + 0.5) / count * (max - min))
})

/** Rendered bar rectangles in SVG coordinates. */
const bars = computed<BarRect[]>(() => {
    const count = props.values.length
    if (count === 0) return []

    const categorySize = (props.direction === 'vertical' ? area.value.width : area.value.height) / count
    const groupSize = categorySize * Math.max(0, 1 - props.gap)
    const subGap = categorySize * Math.max(0, props.subGap)
    const barSize = Math.max(0, (groupSize - subGap * (seriesCount.value - 1)) / seriesCount.value)
    const baselinePosition = valueScale.value(baseline.value)
    const result: BarRect[] = []

    for (let index = 0; index < count; index++) {
        const value = props.values[index]
        const position = positions.value[index]
        if (value === undefined || position === undefined || !Number.isFinite(value)) continue

        const center = axisScale.value(position)
        const crossStart = center - categorySize / 2 + (categorySize - groupSize) / 2 + seriesIndex.value * (barSize + subGap)
        const valuePosition = valueScale.value(value)

        result.push(props.direction === 'vertical'
            ? {
                index,
                position,
                value,
                x: crossStart,
                y: Math.min(baselinePosition, valuePosition),
                width: barSize,
                height: Math.abs(valuePosition - baselinePosition),
            }
            : {
                index,
                position,
                value,
                x: Math.min(baselinePosition, valuePosition),
                y: crossStart,
                width: Math.abs(valuePosition - baselinePosition),
                height: barSize,
            })
    }

    return result
})

defineExpose({
    /** Rendered bar rectangles in SVG coordinates. */
    bars,
    /** Data-space centers of the automatically positioned bars. */
    positions,
})
</script>
