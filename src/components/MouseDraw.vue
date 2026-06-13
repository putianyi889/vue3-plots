<template>
    <svg
        class="plot-mouse-draw plot-layer plot-layer--interactive"
        :class="{ 'plot-mouse-draw--disabled': !isEnabled }"
        :height="size.height"
        :width="size.width"
        :viewBox="`0 0 ${size.width} ${size.height}`"
        preserveAspectRatio="none"
        @click.stop.prevent="handleClick"
        @dblclick.stop.prevent="finishPolygon"
        @mouseenter.stop
        @mouseleave.stop
        @mousemove.stop.prevent="moveDraw"
    >
        <rect
            v-if="drawingShape?.type === 'rect'"
            class="plot-mouse-draw__shape"
            :height="drawingShape.height"
            :width="drawingShape.width"
            :x="drawingShape.x"
            :y="drawingShape.y"
            :fill-opacity="fillOpacity"
            :stroke-opacity="strokeOpacity"
            vector-effect="non-scaling-stroke"
        />
        <ellipse
            v-else-if="drawingShape?.type === 'ellipse'"
            class="plot-mouse-draw__shape"
            :cx="drawingShape.cx"
            :cy="drawingShape.cy"
            :rx="drawingShape.rx"
            :ry="drawingShape.ry"
            :fill-opacity="fillOpacity"
            :stroke-opacity="strokeOpacity"
            vector-effect="non-scaling-stroke"
        />
        <polygon
            v-else-if="drawingShape?.type === 'polygon'"
            class="plot-mouse-draw__shape"
            :fill-opacity="fillOpacity"
            :points="formatPolygonPoints(drawingShape.points)"
            :stroke-opacity="strokeOpacity"
            vector-effect="non-scaling-stroke"
        />
    </svg>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PropType } from 'vue'

import { Ellipse, Polygon, Rect } from './geometry'
import { usePlotSize } from './context'
import type { AnyShape, Point } from './geometry'
import type { PlotSize } from './utils'

type MouseDrawMode = '' | 'rect' | 'ellipse' | 'polygon'

const props = defineProps({
  mode: { type: String as PropType<MouseDrawMode>, default: 'rect' },
  size: { type: Object as PropType<PlotSize>, default: undefined },
  fillOpacity: { type: Number, default: 1 },
  strokeOpacity: { type: Number, default: 1 },
})

const emit = defineEmits<{
  (e: 'draw', shape: AnyShape): void
}>()

const isEnabled = computed(() => props.mode !== '')
const size = usePlotSize(props)
const startPoint = ref<Point>()
const polygonPoints = ref<Point[]>([])
const previewPoint = ref<Point>()
const drawingShape = ref<AnyShape>()

watch(() => props.mode, () => {
  clearDraw()
})

function handleClick(event: MouseEvent) {
  if (!isEnabled.value) return

  const point = getSvgPoint(event)

  if (props.mode === 'polygon') {
    addPolygonPoint(point)
    return
  }

  if (startPoint.value === undefined) {
    startPoint.value = point
    drawingShape.value = createShape(point, point)
    return
  }

  emit('draw', createShape(startPoint.value, point))
  clearDraw()
}

function moveDraw(event: MouseEvent) {
  if (!isEnabled.value) return

  const point = getSvgPoint(event)

  if (props.mode === 'polygon') {
    if (polygonPoints.value.length === 0) return

    previewPoint.value = point
    updatePolygonDraft()
    return
  }

  if (startPoint.value === undefined) return

  drawingShape.value = createShape(startPoint.value, point)
}

function finishPolygon(event: MouseEvent) {
  if (!isEnabled.value || props.mode !== 'polygon') return

  const point = getSvgPoint(event)
  const lastPoint = polygonPoints.value[polygonPoints.value.length - 1]

  if (lastPoint === undefined || !isSamePoint(lastPoint, point)) {
    polygonPoints.value.push(point)
  }

  if (polygonPoints.value.length >= 3) {
    emit('draw', new Polygon([...polygonPoints.value]))
  }

  clearDraw()
}

function clearDraw() {
  startPoint.value = undefined
  polygonPoints.value = []
  previewPoint.value = undefined
  drawingShape.value = undefined
}

function addPolygonPoint(point: Point) {
  polygonPoints.value.push(point)
  previewPoint.value = undefined
  updatePolygonDraft()
}

function updatePolygonDraft() {
  const points = previewPoint.value === undefined
    ? polygonPoints.value
    : [...polygonPoints.value, previewPoint.value]

  drawingShape.value = points.length >= 2 ? new Polygon([...points]) : undefined
}

function createShape(start: Point, end: Point): AnyShape {
  if (props.mode === 'ellipse') return createEllipse(start, end)
  if (props.mode === 'rect') return createRect(start, end)

  throw new Error('MouseDraw is disabled.')
}

function createRect(start: Point, end: Point): Rect {
  const x = Math.min(start.x, end.x)
  const y = Math.min(start.y, end.y)

  return new Rect(x, y, Math.abs(end.x - start.x), Math.abs(end.y - start.y))
}

function createEllipse(start: Point, end: Point): Ellipse {
  const rect = createRect(start, end)

  return new Ellipse(rect.x + rect.width / 2, rect.y + rect.height / 2, rect.width / 2, rect.height / 2)
}

function formatPolygonPoints(points: Point[]) {
  return points.map((point) => `${point.x},${point.y}`).join(' ')
}

function isSamePoint(first: Point, second: Point) {
  return first.x === second.x && first.y === second.y
}

function getSvgPoint(event: MouseEvent): Point {
  const rect = (event.currentTarget as SVGSVGElement).getBoundingClientRect()
  const scaleX = rect.width === 0 ? 1 : size.value.width / rect.width
  const scaleY = rect.height === 0 ? 1 : size.value.height / rect.height

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  }
}
</script>

<style scoped>
.plot-mouse-draw--disabled {
    pointer-events: none;
}

.plot-mouse-draw__shape {
    fill: rgb(37 99 235 / 12%);
    stroke: currentcolor;
    stroke-width: 1;
}
</style>
