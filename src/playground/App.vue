<template>
    <main class="playground">
        <section class="toolbar" aria-label="Plot controls">
            <div>
                <h1>vue3-plots</h1>
                <p>Layered SVG plot demo</p>
            </div>

            <div class="mode-control" aria-label="Drawing mode">
                <button
                    v-for="option in drawModes"
                    :key="option.value"
                    :class="{ active: mode === option.value }"
                    type="button"
                    @click="mode = option.value"
                >
                    {{ option.label }}
                </button>
            </div>
        </section>

        <section class="plot-shell" aria-label="Interactive plot demo">
            <div class="plot-stage" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
                <Grid
                    :domain="domain"
                    :size="size"
                    :padding="padding"
                    :x-ticks="xTicks"
                    :y-ticks="yTicks"
                    stroke-color="#e2e8f0"
                    :stroke-opacity="1"
                />
                <Line
                    :points="points"
                    :domain="domain"
                    :size="size"
                    :padding="padding"
                    stroke-color="#2563eb"
                    line-cap="round"
                    line-join="round"
                    :stroke-width="3"
                />
                <Scatter
                    :points="points"
                    :domain="domain"
                    :size="size"
                    :padding="padding"
                    :radius="5"
                    fill-color="#0f172a"
                    stroke-color="#ffffff"
                    :stroke-width="2"
                    @point-click="selectedPoint = $event"
                />
                <XAxis
                    :domain="domain"
                    :size="size"
                    :padding="padding"
                    :ticks="xTicks"
                    stroke-color="#334155"
                />
                <YAxis
                    :domain="domain"
                    :size="size"
                    :padding="padding"
                    :ticks="yTicks"
                    stroke-color="#334155"
                />
                <XLabel :size="size">
                    Sample
                </XLabel>
                <YLabel :size="size">
                    Value
                </YLabel>
                <MouseDraw
                    :mode="mode"
                    :size="size"
                    :fill-opacity="0.18"
                    :stroke-opacity="0.9"
                    @draw="lastShape = $event"
                />
            </div>

            <aside class="details">
                <h2>Selection</h2>
                <dl>
                    <div>
                        <dt>Mode</dt>
                        <dd>{{ mode || 'off' }}</dd>
                    </div>
                    <div>
                        <dt>Point</dt>
                        <dd>{{ selectedPoint ? `(${selectedPoint.x}, ${selectedPoint.y})` : 'none' }}</dd>
                    </div>
                    <div>
                        <dt>Shape</dt>
                        <dd>{{ shapeSummary }}</dd>
                    </div>
                </dl>
            </aside>
        </section>
    </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

import {
  Grid,
  Line,
  MouseDraw,
  Scatter,
  XAxis,
  XLabel,
  YAxis,
  YLabel,
  getDataDomain,
  getNiceTicks,
} from '../index'
import type { AnyShape, PlotPadding, PlotPoint, PlotSize } from '../index'

type DrawMode = '' | 'rect' | 'ellipse' | 'polygon'

const points: PlotPoint[] = [
  { x: 0, y: 12 },
  { x: 1, y: 18 },
  { x: 2, y: 14 },
  { x: 3, y: 28 },
  { x: 4, y: 24 },
  { x: 5, y: 36 },
  { x: 6, y: 32 },
  { x: 7, y: 44 },
  { x: 8, y: 38 },
  { x: 9, y: 52 },
]
const size: PlotSize = { width: 760, height: 420 }
const padding: PlotPadding = { top: 24, right: 28, bottom: 48, left: 56 }
const drawModes: { label: string, value: DrawMode }[] = [
  { label: 'Off', value: '' },
  { label: 'Rect', value: 'rect' },
  { label: 'Ellipse', value: 'ellipse' },
  { label: 'Polygon', value: 'polygon' },
]

const mode = ref<DrawMode>('rect')
const selectedPoint = ref<PlotPoint>()
const lastShape = ref<AnyShape>()

const domain = computed(() => getDataDomain(points, 0.08))
const xTicks = computed(() => getNiceTicks(domain.value.xMin, domain.value.xMax, 6))
const yTicks = computed(() => getNiceTicks(domain.value.yMin, domain.value.yMax, 6))
const shapeSummary = computed(() => {
  if (lastShape.value === undefined) return 'none'
  if (lastShape.value.type === 'rect') {
    return `rect ${lastShape.value.width}x${lastShape.value.height} at (${lastShape.value.x}, ${lastShape.value.y})`
  }
  if (lastShape.value.type === 'ellipse') {
    return `ellipse center (${lastShape.value.cx}, ${lastShape.value.cy})`
  }

  return `polygon ${lastShape.value.points.length} points`
})
</script>

<style scoped>
.playground {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 32px;
  color: #172033;
  background: #f7f8fb;
}

.toolbar,
.plot-shell {
  max-width: 1120px;
  margin: 0 auto;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

h1,
h2,
p,
dl {
  margin: 0;
}

h1 {
  font-size: 1.75rem;
  line-height: 2.25rem;
}

p {
  margin-top: 4px;
  color: #64748b;
}

.mode-control {
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
}

button {
  min-width: 72px;
  border: 0;
  padding: 8px 12px;
  color: #334155;
  background: transparent;
  cursor: pointer;
}

button.active {
  color: #ffffff;
  background: #2563eb;
}

.plot-shell {
  display: grid;
  grid-template-columns: minmax(0, 760px) 1fr;
  gap: 24px;
  align-items: start;
}

.plot-stage {
  position: relative;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  background: #ffffff;
}

.details {
  padding: 16px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
}

.details h2 {
  margin-bottom: 16px;
  font-size: 1rem;
  line-height: 1.5rem;
}

.details div {
  display: grid;
  grid-template-columns: 72px 1fr;
  gap: 12px;
  padding: 10px 0;
  border-top: 1px solid #e2e8f0;
}

dt {
  color: #64748b;
}

dd {
  margin: 0;
  color: #0f172a;
}

@media (max-width: 920px) {
  .toolbar,
  .plot-shell {
    max-width: 760px;
  }

  .toolbar,
  .plot-shell {
    grid-template-columns: 1fr;
  }

  .toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .plot-stage {
    width: 100% !important;
  }
}
</style>
