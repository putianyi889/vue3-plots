<!-- #region template -->
<template>
    <div>
        <button type="button" @click="generatePoints">
            Generate 1,000,000 points
        </button>
        <p>{{ points.length.toLocaleString() }} source points; Min/Max sampling preserves the two narrow spikes.</p>
        <div class="large-line-plot">
            <TransformGroup :domain="domain" :size="{ width: 640, height: 280 }">
                <Line :points="points" sampling="min-max" stroke-color="#2563eb" :stroke-width="1" />
                <Axis direction="horizontal" :ticks="xTicks" />
                <Axis direction="vertical" :ticks="yTicks" />
            </TransformGroup>
        </div>
    </div>
</template>
<!-- #endregion template -->

<!-- #region script -->
<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Axis, Line, TransformGroup, getDataDomain, getNiceTicks } from '@putianyi888/vue3-plots'
import type { PlotPoint } from '@putianyi888/vue3-plots'

const points = shallowRef<PlotPoint[]>([])
const domain = computed(() => getDataDomain(points.value))
const xTicks = computed(() => getNiceTicks(domain.value.xMin, domain.value.xMax))
const yTicks = computed(() => getNiceTicks(domain.value.yMin, domain.value.yMax))

function generatePoints() {
    points.value = Array.from({ length: 1_000_000 }, (_, x) => ({
        x,
        y: x === 500_001 ? 2 : x === 500_002 ? -2 : Math.sin(x / 10_000),
    }))
}
</script>
<!-- #endregion script -->

<!-- #region style -->
<style scoped>
.large-line-plot {
    position: relative;
    width: 640px;
    height: 280px;
    max-width: 100%;
    overflow: auto;
}
</style>
<!-- #endregion style -->
