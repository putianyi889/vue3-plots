<template>
    <svg
        class="plot-y-label plot-layer plot-layer--passive"
        :height="size.height"
        :width="size.width"
        :viewBox="`0 0 ${size.width} ${size.height}`"
        preserveAspectRatio="none"
    >
        <text
            :transform="`translate(16, ${size.height / 2}) rotate(-90)`"
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
  size: { type: Object as PropType<PlotSize>, default: undefined },
})

const size = usePlotSize(props)
</script>
