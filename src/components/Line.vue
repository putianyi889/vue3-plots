<template>
    <svg
        class="plot-line plot-layer plot-layer--passive"
        :height="size.height"
        :width="size.width"
        :viewBox="`0 0 ${size.width} ${size.height}`"
        preserveAspectRatio="none"
    >
        <path
            v-if="pathData"
            :d="pathData"
            :stroke="strokeColor"
            :stroke-linecap="lineCap"
            :stroke-linejoin="lineJoin"
            :stroke-opacity="strokeOpacity"
            :stroke-width="strokeWidth"
            fill="none"
            vector-effect="non-scaling-stroke"
        />
    </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { usePlotContext } from './context'
import { createLinearScale, getPlotArea, pointsToSvg } from './utils'
import type { PlotDomain, PlotPadding, PlotPoint, PlotSize } from './utils'

const props = defineProps({
  points: { type: Array as PropType<PlotPoint[]>, required: true },
  domain: { type: Object as PropType<PlotDomain>, default: undefined },
  size: { type: Object as PropType<PlotSize>, default: undefined },
  padding: { type: Object as PropType<PlotPadding>, default: undefined },
  strokeColor: { type: String, default: 'none' },
  strokeOpacity: { type: Number, default: 1 },
  strokeWidth: { type: Number, default: 1 },
  lineCap: { type: String as PropType<'butt' | 'round' | 'square'>, default: 'butt' },
  lineJoin: { type: String as PropType<'bevel' | 'miter' | 'inherit' | 'round'>, default: 'miter' },
})

const { domain, padding, size } = usePlotContext(props)

const pathData = computed(() => {
  const area = getPlotArea(size.value, padding.value)
  const scaleX = createLinearScale(domain.value.xMin, domain.value.xMax, area.x, area.x + area.width)
  const scaleY = createLinearScale(domain.value.yMin, domain.value.yMax, area.y + area.height, area.y)
  const points = pointsToSvg(props.points, scaleX, scaleY)

  if (points.length === 0) return ''

  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
})
</script>
