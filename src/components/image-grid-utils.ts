export type CellIndex = {
    rowIndex: number
    columnIndex: number
}

export function createTile(source: CanvasImageSource, width: number, height: number) {
    const tile = document.createElement('canvas')

    tile.width = width
    tile.height = height
    tile.getContext('2d')?.drawImage(source, 0, 0, width, height)

    return tile
}

export function createTileCacheKey(source: string, width: number, height: number) {
    return `${source}\n${width}\n${height}`
}

export function getCellIndex(options: {
    cellHeight: number
    cellWidth: number
    cells: string[][]
    height: number
    mouseX: number
    mouseY: number
    width: number
}) {
    const x = options.mouseX * options.width
    const y = options.mouseY * options.height
    const rowIndex = Math.floor(y / options.cellHeight)
    const columnIndex = Math.floor(x / options.cellWidth)

    return options.cells[rowIndex]?.[columnIndex] === undefined
        ? undefined
        : { rowIndex, columnIndex }
}

export function isImageReady(image: HTMLImageElement) {
    return image.complete && image.naturalWidth > 0
}

export function cloneCells(cells: string[][]) {
    return cells.map((row) => [...row])
}

export function hasCellStructureChanged(cells: string[][], previousCells: string[][]) {
    return cells.length !== previousCells.length
        || cells.some((row, index) => row.length !== previousCells[index]?.length)
}
