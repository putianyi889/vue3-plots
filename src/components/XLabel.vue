<template>
    <div
        class="plot-x-label"
        :class="{ 'plot-layer': isPositioned, 'plot-layer--passive': isPositioned }"
        :style="layerStyle"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { useOptionalPlotSize } from './context'
import type { PlotSize } from './utils'

const props = defineProps({
    /** Outer SVG size in pixels. */
    size: { type: Object as PropType<PlotSize>, default: undefined },
})

defineSlots<{
    /** Label content. */
    default: () => unknown
}>()

const size = useOptionalPlotSize(props)
const isPositioned = computed(() => size.value !== undefined)
const layerStyle = computed(() => size.value === undefined
    ? undefined
    : { height: `${size.value.height}px`, width: `${size.value.width}px` })
</script>

<style scoped>
.plot-x-label {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  box-sizing: border-box;
  padding-bottom: 2px;
  text-align: center;
}
</style>
