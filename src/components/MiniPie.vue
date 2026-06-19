<template>
    <svg
        class="plot-mini-pie"
        :height="diameter"
        :viewBox="`${-radius} ${-radius} ${diameter} ${diameter}`"
        :width="diameter"
        role="img"
    >
        <path
            v-for="(slice, index) in slices"
            :key="index"
            :d="slice.path"
            :fill="slice.color"
            :stroke="strokeColor"
            :stroke-width="strokeWidth"
        />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { CircularSector } from './geometry'

type MiniPieDatum = {
    value: number
    color: string
}

type MiniPieSlice = {
    color: string
    path: string
}

const props = defineProps({
    /** Pie segments in drawing order. */
    data: { type: Array as PropType<MiniPieDatum[]>, required: true },
    /** Circle radius in SVG units. */
    radius: { type: Number, default: 8 },
    /** Total value used to normalize segments. Defaults to the sum of positive finite values. */
    total: { type: Number, default: undefined },
    /** Start angle in degrees. Zero degrees points right. */
    startAngle: { type: Number, default: 0 },
    /** Slice outline color. */
    strokeColor: { type: String, default: 'none' },
    /** Slice outline width in SVG units. */
    strokeWidth: { type: Number, default: 1 },
})

const diameter = computed(() => props.radius * 2)
const effectiveTotal = computed(() => {
    if (Number.isFinite(props.total) && props.total !== undefined && props.total > 0) return props.total

    return props.data.reduce((sum, item) => sum + getDrawableValue(item.value), 0)
})
const slices = computed(() => {
    const total = effectiveTotal.value
    if (!Number.isFinite(total) || total <= 0 || props.radius <= 0) return []

    const result: MiniPieSlice[] = []
    let angle = props.startAngle

    for (const item of props.data) {
        const value = getDrawableValue(item.value)
        if (value <= 0) continue

        const sweep = Math.min(value / total, 1) * 360
        if (sweep <= 0) continue

        result.push({
            color: item.color,
            path: new CircularSector(0, 0, props.radius, angle, sweep).svgPath(),
        })
        angle += sweep
    }

    return result
})

function getDrawableValue(value: number) {
    return Number.isFinite(value) && value > 0 ? value : 0
}
</script>
