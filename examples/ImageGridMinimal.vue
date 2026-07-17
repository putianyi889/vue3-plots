<!-- #region template -->
<template>
    <ImageGrid
        :cell-height="16"
        :cell-width="16"
        :cells="cells"
        :images="images"
    />
</template>
<!-- #endregion template -->

<!-- #region script -->
<script setup lang="ts">
import { ImageGrid } from '@putianyi888/vue3-plots'

const cells = [
    ['grass', 'water', 'grass'],
    ['stone', 'grass', 'water'],
]
const images = {
    grass: createTile('#86efac'),
    stone: createTile('#d4d4d8'),
    water: createTile('#93c5fd'),
}

function createTile(color: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16" fill="${color}"/></svg>`

    return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
</script>
<!-- #endregion script -->
