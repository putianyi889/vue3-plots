<template>
    <div
        class="plot-layer plot-layer--passive plot-y-label"
        :style="{ height: `${size.height}px`, width: `${size.width}px` }"
    >
        <slot />
    </div>
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
    /** Label content. */
    default: () => unknown
}>()

const size = usePlotSize(props)
</script>

<style scoped>
.plot-y-label {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  padding-left: 16px;
  text-align: center;
  writing-mode: sideways-lr;
}
</style>
