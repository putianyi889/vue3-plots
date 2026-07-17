<!-- #region template -->
<template>
    <div class="pyramid">
        <div class="plot" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
            <TransformGroup :domain="flipX(domain)" :padding="padding" :size="size">
                <Bar direction="horizontal-flip" :values="male" fill="#2563eb" />
                <Axis direction="horizontal" :ticks="ticks" />
                <XLabel>Male</XLabel>
            </TransformGroup>
        </div>

        <div class="age-labels">
            <span v-for="label in reversedAgeGroups" :key="label">
                {{ label }}
            </span>
        </div>

        <div class="plot" :style="{ height: `${size.height}px`, width: `${size.width}px` }">
            <TransformGroup :domain="domain" :padding="padding" :size="size">
                <Bar direction="horizontal" :values="female" fill="#dc2626" />
                <Axis direction="horizontal" :ticks="ticks" />
                <XLabel>Female</XLabel>
            </TransformGroup>
        </div>
    </div>
</template>
<!-- #endregion template -->

<!-- #region script -->
<script setup lang="ts">
import { computed } from 'vue'
import { Axis, Bar, flipX, TransformGroup, XLabel } from '@putianyi888/vue3-plots'
import type { PlotDomain, PlotPadding, PlotSize } from '@putianyi888/vue3-plots'

const ageGroups = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70+']
const male = [8.4, 7.6, 6.8, 6.2, 5.4, 4.6, 3.5, 2.2]
const female = [7.9, 7.2, 6.5, 6.0, 5.6, 4.9, 4.0, 3.0]
const maxValue = 10
const size: PlotSize = { width: 280, height: 360 }
const padding: PlotPadding = { top: 24, right: 12, bottom: 64, left: 12 }
const domain: PlotDomain = { xMin: 0, xMax: maxValue, yMin: 0, yMax: ageGroups.length }
const ticks = [0, 2, 4, 6, 8, 10]
const reversedAgeGroups = computed(() => [...ageGroups].reverse())
</script>
<!-- #endregion script -->

<!-- #region style -->
<style scoped>
.pyramid {
  display: flex;
  flex-direction: row;
}

.plot {
  position: relative;
}

.age-labels {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  box-sizing: border-box;
  height: 360px;
  padding: 24px 0 64px;
  text-align: center;
}
</style>
<!-- #endregion style -->
