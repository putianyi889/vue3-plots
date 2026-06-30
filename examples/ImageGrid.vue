<template>
    <div class="example-frame">
        <div class="controls">
            <label>
                Rows
                <input v-model.number="rowCount" min="1" max="200" type="number">
            </label>
            <label>
                Columns
                <input v-model.number="columnCount" min="1" max="200" type="number">
            </label>
            <label>
                Cell
                <input v-model.number="cellSize" min="1" max="16" type="number">
            </label>
            <span class="status">
                {{ hoverText }}
            </span>
        </div>

        <div class="viewport">
            <ImageGrid
                ref="imageGrid"
                :cell-height="cellSize"
                :cell-width="cellSize"
                :cells="cells"
                :images="images"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { ImageGrid } from '@putianyi888/vue3-plots'

type CellIndex = { rowIndex: number, columnIndex: number }
type TileKey = keyof typeof baseToHighlight

const rowCount = ref(75)
const columnCount = ref(100)
const cellSize = ref(3)
const imageGrid = useTemplateRef<InstanceType<typeof ImageGrid>>('imageGrid')
const baseToHighlight = {
    grass: 'grassHover',
    stone: 'stoneHover',
    water: 'waterHover',
} as const
const images = {
    grass: createTile('#86efac', '#16a34a'),
    grassHover: createTile('#16a34a', '#86efac'),
    stone: createTile('#d4d4d8', '#71717a'),
    stoneHover: createTile('#71717a', '#d4d4d8'),
    water: createTile('#93c5fd', '#2563eb'),
    waterHover: createTile('#2563eb', '#93c5fd'),
}
const keys = Object.keys(baseToHighlight) as TileKey[]
const cells = ref(createCells())
const lastHoveredCell = ref<CellIndex>()
const cellIndex = computed(() => imageGrid.value?.cellIndex)
const hoverText = computed(() => {
    const index = cellIndex.value

    if (index === undefined) return 'Move over the grid'

    return `row ${index.rowIndex}, column ${index.columnIndex}: ${getBaseKey(cells.value[index.rowIndex]?.[index.columnIndex])}`
})

watch([rowCount, columnCount], () => {
    cells.value = createCells()
    lastHoveredCell.value = undefined
})

watch(cellIndex, (index) => {
    restoreHoveredCell()

    if (index === undefined) return

    const key = cells.value[index.rowIndex]?.[index.columnIndex]
    const baseKey = getBaseKey(key)

    if (baseKey === undefined) return

    cells.value[index.rowIndex][index.columnIndex] = baseToHighlight[baseKey]
    lastHoveredCell.value = index
})

function createCells() {
    return Array.from({ length: rowCount.value }, (_, rowIndex) => {
        return Array.from({ length: columnCount.value }, (_, columnIndex) => {
            return keys[(rowIndex * 17 + columnIndex * 7) % keys.length]
        })
    })
}

function restoreHoveredCell() {
    const index = lastHoveredCell.value

    if (index === undefined) return

    const key = cells.value[index.rowIndex]?.[index.columnIndex]
    const baseKey = getBaseKey(key)

    if (baseKey !== undefined) {
        cells.value[index.rowIndex][index.columnIndex] = baseKey
    }

    lastHoveredCell.value = undefined
}

function getBaseKey(key: string | undefined) {
    if (key === undefined) return undefined
    if (key in baseToHighlight) return key as TileKey

    return keys.find((baseKey) => baseToHighlight[baseKey] === key)
}

function createTile(background: string, foreground: string) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="${background}"/><circle cx="16" cy="16" r="8" fill="${foreground}"/></svg>`

    return `data:image/svg+xml,${encodeURIComponent(svg)}`
}
</script>

<style scoped>
.example-frame {
  display: grid;
  gap: 12px;
}

.controls {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 12px;
}

label {
  display: grid;
  gap: 4px;
  color: #475569;
  font-size: 12px;
}

input {
  width: 72px;
  box-sizing: border-box;
  border: 1px solid #cbd5e1;
  padding: 4px 6px;
}

.status {
  color: #334155;
  font-size: 14px;
}

.viewport {
  overflow: auto;
  max-width: 100%;
  border: 1px solid #e2e8f0;
}
</style>
