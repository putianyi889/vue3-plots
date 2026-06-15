<template>
    <svg
        class="plot-x-label plot-layer plot-layer--passive"
        :height="size.height"
        :width="size.width"
        :viewBox="`0 0 ${size.width} ${size.height}`"
        preserveAspectRatio="none"
    >
        <text
            :x="size.width / 2"
            :y="size.height - 2"
            text-anchor="middle"
        >
            <slot />
        </text>
    </svg>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

import { usePlotSize } from './context'
import type { PlotSize } from './utils'

const props = defineProps({
    /** Outer SVG size in pixels. */
    size: { type: Object as PropType<PlotSize>, default: undefined },
})

defineSlots<{
    default: () => unknown
}>()

const size = usePlotSize(props)
</script>
