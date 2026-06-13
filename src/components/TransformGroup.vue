<template>
    <slot />
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

import { providePlotContext } from './context'
import { defaultPlotPadding } from './utils'
import type { PlotDomain, PlotPadding, PlotSize } from './utils'

const props = defineProps({
  domain: { type: Object as PropType<PlotDomain>, required: true },
  size: { type: Object as PropType<PlotSize>, default: () => ({ width: 320, height: 200 }) },
  padding: { type: Object as PropType<PlotPadding>, default: () => defaultPlotPadding },
})

providePlotContext(props)
</script>
