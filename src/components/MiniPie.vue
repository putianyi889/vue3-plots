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
        />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { polarToCartesian } from './utils'

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
            path: createSlicePath(props.radius, angle, sweep),
        })
        angle += sweep
    }

    return result
})

function getDrawableValue(value: number) {
    return Number.isFinite(value) && value > 0 ? value : 0
}

function createSlicePath(radius: number, startAngle: number, sweep: number) {
    if (sweep >= 360) {
        return [
            `M ${radius} 0`,
            `A ${radius} ${radius} 0 1 1 ${-radius} 0`,
            `A ${radius} ${radius} 0 1 1 ${radius} 0`,
            'Z',
        ].join(' ')
    }

    const start = polarToCartesian(radius, startAngle)
    const end = polarToCartesian(radius, startAngle + sweep)
    const largeArc = sweep > 180 ? 1 : 0

    return [
        'M 0 0',
        `L ${formatCoordinate(start.x)} ${formatCoordinate(start.y)}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${formatCoordinate(end.x)} ${formatCoordinate(end.y)}`,
        'Z',
    ].join(' ')
}

function formatCoordinate(value: number) {
    if (Object.is(value, -0)) return '0'

    return Number(value.toFixed(6)).toString()
}
</script>
