import { createTile, createTileCacheKey, isImageReady } from './image-grid-utils'

type ImageGridRendererOptions = {
    canvas: { value: HTMLCanvasElement | null | undefined }
    cellHeight: () => number
    cellWidth: () => number
    cells: () => string[][]
    height: () => number
    images: () => Record<string, string>
    width: () => number
}

export function createImageGridRenderer(options: ImageGridRendererOptions) {
    const imageCache = new Map<string, HTMLImageElement>()
    const tileCache = new Map<string, HTMLCanvasElement>()
    const scheduledCells = new Set<string>()
    let drawVersion = 0
    let drawScheduled = false

    return {
        clearTiles: () => tileCache.clear(),
        draw,
        drawCell,
    }

    function draw() {
        const currentVersion = ++drawVersion
        const context = options.canvas.value?.getContext('2d')

        if (!context) return

        context.clearRect(0, 0, options.width(), options.height())
        options.cells().forEach((row, rowIndex) => drawRow(context, row, rowIndex, currentVersion))
    }

    function drawRow(context: CanvasRenderingContext2D, row: string[], rowIndex: number, version: number) {
        row.forEach((key, columnIndex) => {
            drawTile(context, key, rowIndex, columnIndex, version)
        })
    }

    function drawCell(rowIndex: number, columnIndex: number) {
        const context = options.canvas.value?.getContext('2d')

        if (!context) return

        const key = options.cells()[rowIndex]?.[columnIndex]
        const source = key === undefined ? undefined : options.images()[key]
        const tile = getTile(source, () => scheduleCellDraw(rowIndex, columnIndex))
        const x = columnIndex * options.cellWidth()
        const y = rowIndex * options.cellHeight()

        if (source !== undefined && tile === undefined) return

        context.clearRect(x, y, options.cellWidth(), options.cellHeight())
        drawTile(context, key, rowIndex, columnIndex, drawVersion)
    }

    function drawTile(context: CanvasRenderingContext2D, key: string | undefined, rowIndex: number, columnIndex: number, version: number) {
        const tile = getTile(key === undefined ? undefined : options.images()[key], () => {
            if (version === drawVersion) {
                scheduleDraw()
            }
        })

        if (tile === undefined) return

        context.drawImage(
            tile,
            columnIndex * options.cellWidth(),
            rowIndex * options.cellHeight(),
        )
    }

    function getTile(source: string | undefined, onLoad: () => void) {
        if (source === undefined) return undefined

        const cacheKey = createTileCacheKey(source, options.cellWidth(), options.cellHeight())
        const cachedTile = tileCache.get(cacheKey)

        if (cachedTile !== undefined) return cachedTile

        const image = getImage(source, onLoad)

        if (!isImageReady(image)) return undefined

        const tile = createTile(image, options.cellWidth(), options.cellHeight())
        tileCache.set(cacheKey, tile)

        return tile
    }

    function getImage(source: string, onLoad: () => void) {
        const cachedImage = imageCache.get(source)

        if (cachedImage !== undefined) {
            if (!isImageReady(cachedImage)) {
                cachedImage.addEventListener('load', onLoad, { once: true })
            }

            return cachedImage
        }

        const image = new Image()
        imageCache.set(source, image)
        image.addEventListener('load', onLoad, { once: true })
        image.src = source

        return image
    }

    function scheduleDraw() {
        if (drawScheduled) return

        drawScheduled = true
        queueMicrotask(() => {
            drawScheduled = false
            draw()
        })
    }

    function scheduleCellDraw(rowIndex: number, columnIndex: number) {
        const key = `${rowIndex}-${columnIndex}`

        if (scheduledCells.has(key)) return

        scheduledCells.add(key)
        queueMicrotask(() => {
            scheduledCells.delete(key)
            drawCell(rowIndex, columnIndex)
        })
    }
}
