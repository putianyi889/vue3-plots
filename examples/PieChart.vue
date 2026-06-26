<template>
    <div class="plot" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
        <Pie
            :data="data"
            :inner-radius="34"
            :size="size"
            interactive
            @mouse-enter="hoveredIndex = $event.index"
            @mouse-leave="hoveredIndex = undefined"
        />
    </div>
    <p>{{ hoveredLabel }}</p>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Pie } from '@putianyi888/vue3-plots'
import type { PlotSize } from '@putianyi888/vue3-plots'

const data = [
    { label: 'Research', value: 42, color: '#2563eb' },
    { label: 'Design', value: 24, color: '#16a34a' },
    { label: 'Engineering', value: 28, color: '#dc2626' },
    { label: 'Review', value: 12, color: '#9333ea' },
]
const size: PlotSize = { width: 360, height: 260 }
const hoveredIndex = ref<number>()
const hoveredLabel = computed(() => {
    if (hoveredIndex.value === undefined) return 'Hover a slice'

    const item = data[hoveredIndex.value]
    return `${item.label}: ${item.value}`
})
</script>

<style scoped>
.plot {
  position: relative;
}
</style>
