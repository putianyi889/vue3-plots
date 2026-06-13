<template>
    <svg
        class="plot-scatter plot-layer plot-layer--passive"
        :height="size.height"
        :width="size.width"
        :viewBox="`0 0 ${size.width} ${size.height}`"
        preserveAspectRatio="none"
    >
        <circle
            v-for="(point, index) in renderedPoints"
            :key="index"
            class="plot-scatter__point"
            :cx="point.x"
            :cy="point.y"
            :r="getMaybeArray(radius, point.index)"
            :fill="getMaybeArray(fillColor, point.index)"
            :fill-opacity="getMaybeArray(fillOpacity, point.index)"
            :stroke="getMaybeArray(strokeColor, point.index)"
            :stroke-opacity="getMaybeArray(strokeOpacity, point.index)"
            :stroke-width="getMaybeArray(strokeWidth, point.index)"
            vector-effect="non-scaling-stroke"
            @click="emit('pointClick', points[point.index])"
            @mouseenter="emit('pointEnter', points[point.index])"
            @mouseleave="emit('pointLeave', points[point.index])"
        />
    </svg>
</template>

<script setup lang="ts" generic="T = unknown">
import { computed } from 'vue'
import type { PropType } from 'vue'

import { usePlotContext } from './context'
import { createLinearScale, getMaybeArray, getPlotArea, pointToSvg } from './utils'
import type { MaybeArray, PlotDomain, PlotPadding, PlotPoint, PlotSize } from './utils'

const props = defineProps({
  points: { type: Array as PropType<PlotPoint<T>[]>, required: true },
  domain: { type: Object as PropType<PlotDomain>, default: undefined },
  size: { type: Object as PropType<PlotSize>, default: undefined },
  padding: { type: Object as PropType<PlotPadding>, default: undefined },
  radius: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 0 },
  fillColor: { type: [String, Array] as PropType<MaybeArray<string>>, default: 'black' },
  fillOpacity: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
  strokeColor: { type: [String, Array] as PropType<MaybeArray<string>>, default: 'none' },
  strokeOpacity: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
  strokeWidth: { type: [Number, Array] as PropType<MaybeArray<number>>, default: 1 },
})

const emit = defineEmits<{
  (e: 'pointClick', point: PlotPoint<T>): void
  (e: 'pointEnter', point: PlotPoint<T>): void
  (e: 'pointLeave', point: PlotPoint<T>): void
}>()

const { domain, padding, size } = usePlotContext(props)

const renderedPoints = computed(() => {
  const area = getPlotArea(size.value, padding.value)
  const scaleX = createLinearScale(domain.value.xMin, domain.value.xMax, area.x, area.x + area.width)
  const scaleY = createLinearScale(domain.value.yMin, domain.value.yMax, area.y + area.height, area.y)
  const result = []

  for (let i = 0; i < props.points.length; i++) {
    const point = props.points[i]
    if (!point) continue
    if (Number.isFinite(point.x) && Number.isFinite(point.y)) {
      result.push({
        ...pointToSvg(point, scaleX, scaleY),
        index: i,
      })
    }
  }

  return result
})
</script>

<style scoped>
.plot-scatter__point {
    cursor: pointer;
    pointer-events: auto;
}
</style>
