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

import { createLinearScale, defaultPlotPadding, getPlotArea, pointsToSvg } from './utils'
import type { PlotDomain, PlotPadding, PlotPoint, PlotSize } from './utils'

const props = defineProps({
  points: { type: Array as PropType<PlotPoint[]>, required: true },
  domain: { type: Object as PropType<PlotDomain>, required: true },
  size: { type: Object as PropType<PlotSize>, default: () => ({ width: 320, height: 200 }) },
  padding: { type: Object as PropType<PlotPadding>, default: () => defaultPlotPadding },
  strokeColor: { type: String, default: 'none' },
  strokeOpacity: { type: Number, default: 1 },
  strokeWidth: { type: Number, default: 1 },
  lineCap: { type: String as PropType<'butt' | 'round' | 'square'>, default: 'butt' },
  lineJoin: { type: String as PropType<'bevel' | 'miter' | 'inherit' | 'round'>, default: 'miter' },
})

const pathData = computed(() => {
  const area = getPlotArea(props.size, props.padding)
  const scaleX = createLinearScale(props.domain.xMin, props.domain.xMax, area.x, area.x + area.width)
  const scaleY = createLinearScale(props.domain.yMin, props.domain.yMax, area.y + area.height, area.y)
  const points = pointsToSvg(props.points, scaleX, scaleY)

  if (points.length === 0) return ''

  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
})
</script>
