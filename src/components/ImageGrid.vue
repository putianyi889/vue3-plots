<template>
    <canvas
        ref="canvas"
        :height="canvasHeight"
        :width="canvasWidth"
        @mouseleave="cellIndex = undefined"
        @mousemove="updateCellIndex"
    />
</template>

<script setup lang="ts">
import { computed, onMounted, shallowRef, useTemplateRef, watch } from 'vue'
import type { PropType } from 'vue'
import { createImageGridRenderer } from './image-grid-renderer'
import { cloneCells, getCellIndex, hasCellStructureChanged } from './image-grid-utils'
import type { CellIndex } from './image-grid-utils'
const props = defineProps({
    /** Two-dimensional grid of image keys. */
    cells: { type: Array as PropType<string[][]>, required: true },
    /** Map from image keys used in `cells` to image URLs. */
    images: { type: Object as PropType<Record<string, string>>, required: true },
    /** Width of each rendered cell in canvas pixels. */
    cellWidth: { type: Number, required: true },
    /** Height of each rendered cell in canvas pixels. */
    cellHeight: { type: Number, required: true },
})
const canvas = useTemplateRef<HTMLCanvasElement>('canvas')
const cellIndex = shallowRef<CellIndex>()
const rowCount = computed(() => props.cells.length)
const columnCount = computed(() => props.cells.reduce((max, row) => Math.max(max, row.length), 0))
const canvasWidth = computed(() => columnCount.value * props.cellWidth)
const canvasHeight = computed(() => rowCount.value * props.cellHeight)
let renderedCells = cloneCells(props.cells)
const renderer = createImageGridRenderer({
    canvas,
    cellHeight: () => props.cellHeight,
    cellWidth: () => props.cellWidth,
    cells: () => props.cells,
    height: () => canvasHeight.value,
    images: () => props.images,
    width: () => canvasWidth.value,
})
onMounted(() => {
    renderer.draw()
    renderedCells = cloneCells(props.cells)
})

watch(
    () => props.cells,
    () => {
        drawChangedCells()
    },
    { deep: true, flush: 'post' },
)

watch(
    [
        () => props.images,
        () => props.cellWidth,
        () => props.cellHeight,
    ],
    () => {
        renderer.clearTiles()
        renderer.draw()
        renderedCells = cloneCells(props.cells)
    },
    { flush: 'post' },
)

defineExpose({
    /** Current mouse position as cell indexes. Undefined when the mouse is outside a valid cell. */
    cellIndex,
})

function drawChangedCells() {
    if (hasCellStructureChanged(props.cells, renderedCells)) {
        renderer.draw()
        renderedCells = cloneCells(props.cells)
        return
    }

    props.cells.forEach((row, rowIndex) => {
        row.forEach((key, columnIndex) => {
            if (renderedCells[rowIndex]?.[columnIndex] === key) return

            renderer.drawCell(rowIndex, columnIndex)
        })
    })
    renderedCells = cloneCells(props.cells)
}

function updateCellIndex(event: MouseEvent) {
    const target = canvas.value

    if (!target) return

    const rect = target.getBoundingClientRect()

    if (rect.width === 0 || rect.height === 0) {
        cellIndex.value = undefined
        return
    }

    setCellIndex(getCellIndex({
        cellHeight: props.cellHeight,
        cellWidth: props.cellWidth,
        cells: props.cells,
        height: canvasHeight.value,
        mouseX: (event.clientX - rect.left) / rect.width,
        mouseY: (event.clientY - rect.top) / rect.height,
        width: canvasWidth.value,
    }))
}

function setCellIndex(nextIndex: CellIndex | undefined) {
    const currentIndex = cellIndex.value

    if (currentIndex?.rowIndex === nextIndex?.rowIndex && currentIndex?.columnIndex === nextIndex?.columnIndex) {
        return
    }

    cellIndex.value = nextIndex
}
</script>
