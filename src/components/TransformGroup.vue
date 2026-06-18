<template>
    <slot />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { providePlotContext } from './context'
import { createLinearScale, defaultPlotPadding, getPlotArea } from './utils'
import type { PlotDomain, PlotPadding, PlotSize } from './utils'

const props = defineProps({
    /** Data-space bounds provided to child plot layers. */
    domain: { type: Object as PropType<PlotDomain>, required: true },
    /** Outer SVG size provided to child plot layers. */
    size: { type: Object as PropType<PlotSize>, default: () => ({ width: 320, height: 200 }) },
    /** Insets provided to child plot layers. */
    padding: { type: Object as PropType<PlotPadding>, default: () => defaultPlotPadding },
})

defineSlots<{
    /** Plot layers that share this transform context. */
    default: () => unknown
}>()

const area = computed(() => getPlotArea(props.size, props.padding))
const scaleX = computed(() => createLinearScale(props.domain.xMin, props.domain.xMax, area.value.x, area.value.x + area.value.width))
const scaleY = computed(() => createLinearScale(props.domain.yMin, props.domain.yMax, area.value.y + area.value.height, area.value.y))

defineExpose({
    /** Maps an x value from data coordinates to SVG coordinates. */
    scaleX,
    /** Maps a y value from data coordinates to SVG coordinates. */
    scaleY,
})

providePlotContext(props)
</script>
