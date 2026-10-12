import type { PlotPoint, Scale } from '../utils'

type Bucket = {
    column: number
    first: number
    last: number
    min: number
    max: number
    minY: number
    maxY: number
}

/** Builds a path without allocating an intermediate array of scaled points. */
export function createLinePath(
    points: PlotPoint[],
    scaleX: Scale,
    scaleY: Scale,
    sampling: 'none' | 'min-max',
): string {
    if (sampling === 'none') return createFullPath(points, scaleX, scaleY)

    const commands: string[] = []
    let bucket: Bucket | undefined
    let previousX: number | undefined
    let direction = 0

    for (let index = 0; index < points.length; index++) {
        const point = points[index]
        if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) continue

        if (previousX !== undefined && point.x !== previousX) {
            const nextDirection = point.x > previousX ? 1 : -1
            // An x reversal can revisit a column and form a loop. Keep that geometry intact.
            if (direction !== 0 && direction !== nextDirection) return createFullPath(points, scaleX, scaleY)
            direction = nextDirection
        }
        previousX = point.x

        const column = Math.floor(scaleX(point.x))
        if (!bucket || column !== bucket.column) {
            if (bucket) appendBucket(commands, bucket, points, scaleX, scaleY)
            bucket = {
                column,
                first: index,
                last: index,
                min: index,
                max: index,
                minY: point.y,
                maxY: point.y,
            }
            continue
        }

        bucket.last = index
        if (point.y < bucket.minY) {
            bucket.min = index
            bucket.minY = point.y
        }
        if (point.y > bucket.maxY) {
            bucket.max = index
            bucket.maxY = point.y
        }
    }

    if (bucket) appendBucket(commands, bucket, points, scaleX, scaleY)
    return commands.join(' ')
}

function createFullPath(points: PlotPoint[], scaleX: Scale, scaleY: Scale): string {
    const commands: string[] = []

    points.forEach((point) => {
        if (Number.isFinite(point.x) && Number.isFinite(point.y)) {
            appendPoint(commands, point, scaleX, scaleY)
        }
    })

    return commands.join(' ')
}

function appendBucket(commands: string[], bucket: Bucket, points: PlotPoint[], scaleX: Scale, scaleY: Scale) {
    // Preserve input order even when a maximum precedes a minimum, or x decreases.
    const indices = [bucket.first, bucket.min, bucket.max, bucket.last].sort((a, b) => a - b)
    let previousIndex = -1

    for (const index of indices) {
        if (index !== previousIndex) appendPoint(commands, points[index], scaleX, scaleY)
        previousIndex = index
    }
}

function appendPoint(commands: string[], point: PlotPoint, scaleX: Scale, scaleY: Scale) {
    commands.push(`${commands.length === 0 ? 'M' : 'L'} ${scaleX(point.x)} ${scaleY(point.y)}`)
}
