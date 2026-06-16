<template>
    <slot />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

import { providePlotContext } from './context'
import { defaultPlotPadding } from './utils'
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

providePlotContext(props)
</script>
