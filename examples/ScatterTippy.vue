<!-- #region template -->
<template>
    <Tippy :duration="0" sticky follow-cursor :arrow="false">
        <div class="plot" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
            <Scatter
                :domain="domain"
                fill-color="#2563eb"
                :points="points"
                :radius="6"
                :size="size"
                interactive
                @point-enter="showPointTooltip"
                @point-leave="hideTooltip"
            />
        </div>
        <template #content>
            <div v-if="hoveredPoint">
                ({{ hoveredPoint.x }}, {{ hoveredPoint.y }})
            </div>
        </template>
    </Tippy>
</template>
<!-- #endregion template -->

<!-- #region script -->
<script setup lang="ts">
import { ref } from 'vue'
import { Tippy } from 'vue-tippy'
import { Scatter } from '@putianyi888/vue3-plots'

const points = [
    { x: 1, y: 2 },
    { x: 2, y: 5 },
    { x: 3, y: 3 },
    { x: 4, y: 6 },
    { x: 5, y: 4 },
]

const size = { width: 640, height: 360 }
const domain = { xMin: 0, xMax: 6, yMin: 0, yMax: 7 }
const hoveredPoint = ref<{ x: number, y: number }>()

function showPointTooltip(point: { x: number, y: number }) {
    hoveredPoint.value = point
}

function hideTooltip() {
    hoveredPoint.value = undefined
}
</script>
<!-- #endregion script -->

<!-- #region style -->
<style scoped>
.plot {
  position: relative;
}
</style>
<!-- #endregion style -->
