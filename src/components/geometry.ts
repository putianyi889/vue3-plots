/**
 * Coordinate pair used by geometry shapes.
 */
export interface Point {
    x: number
    y: number
}

/**
 * Discriminator values for built-in geometry shapes.
 */
export type ShapeType = 'rect' | 'ellipse' | 'polygon'

/**
 * Abstract base class implemented by all built-in geometry shapes.
 *
 * Use the `type` discriminator to narrow emitted shapes.
 *
 * @example
 * ```ts
 * function handleShape(shape: AnyShape) {
 *   if (shape.type === 'rect') {
 *     console.log(shape.width)
 *   }
 * }
 * ```
 */
export abstract class Shape<TType extends ShapeType> {
    abstract readonly type: TType

    /**
     * Checks whether a point is inside the shape.
     */
    abstract contains(point: Point): boolean
}

/**
 * Axis-aligned rectangle.
 *
 * `contains` includes boundary points.
 *
 * @example
 * ```ts
 * const rect = new Rect(10, 20, 30, 40)
 * rect.contains({ x: 25, y: 40 }) // true
 * ```
 */
export class Rect extends Shape<'rect'> {
    readonly type = 'rect'

    constructor(
        /** Left coordinate. */
        readonly x: number,
        /** Top coordinate. */
        readonly y: number,
        /** Rectangle width. */
        readonly width: number,
        /** Rectangle height. */
        readonly height: number,
    ) {
        super()
    }

    /**
     * Checks whether a point is inside or on the rectangle boundary.
     *
     * @param point Point to test.
     * @returns Whether the point is contained by the rectangle.
     */
    contains(point: Point): boolean {
        return point.x >= this.x
            && point.x <= this.x + this.width
            && point.y >= this.y
            && point.y <= this.y + this.height
    }
}

/**
 * Axis-aligned ellipse.
 *
 * `contains` includes boundary points. If either radius is not positive, all
 * points are rejected.
 *
 * @example
 * ```ts
 * const ellipse = new Ellipse(10, 20, 6, 4)
 * ellipse.contains({ x: 10, y: 20 }) // true
 * ```
 */
export class Ellipse extends Shape<'ellipse'> {
    readonly type = 'ellipse'

    constructor(
        /** Center x coordinate. */
        readonly cx: number,
        /** Center y coordinate. */
        readonly cy: number,
        /** Horizontal radius. */
        readonly rx: number,
        /** Vertical radius. */
        readonly ry: number,
    ) {
        super()
    }

    /**
     * Checks whether a point is inside or on the ellipse boundary.
     *
     * @param point Point to test.
     * @returns Whether the point is contained by the ellipse.
     */
    contains(point: Point): boolean {
        if (this.rx <= 0 || this.ry <= 0) return false

        const dx = (point.x - this.cx) / this.rx
        const dy = (point.y - this.cy) / this.ry

        return dx * dx + dy * dy <= 1
    }
}

/**
 * Polygon defined by ordered vertices.
 *
 * `contains` includes boundary points. Polygons with fewer than three vertices
 * reject all points.
 *
 * @example
 * ```ts
 * const polygon = new Polygon([
 *   { x: 10, y: 10 },
 *   { x: 40, y: 10 },
 *   { x: 40, y: 30 },
 *   { x: 10, y: 30 },
 * ])
 *
 * polygon.contains({ x: 20, y: 20 }) // true
 * ```
 */
export class Polygon extends Shape<'polygon'> {
    readonly type = 'polygon'

    /**
     * @param points Ordered polygon vertices.
     */
    constructor(readonly points: Point[]) {
        super()
    }

    /**
     * Checks whether a point is inside or on the polygon boundary.
     *
     * @param point Point to test.
     * @returns Whether the point is contained by the polygon.
     */
    contains(point: Point): boolean {
        if (this.points.length < 3) return false

        let isInside = false

        for (let i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
            const start = this.points[i]
            const end = this.points[j]

            if (isPointOnSegment(point, start, end)) return true

            const intersects = (start.y > point.y) !== (end.y > point.y)
                && point.x < (end.x - start.x) * (point.y - start.y) / (end.y - start.y) + start.x

            if (intersects) isInside = !isInside
        }

        return isInside
    }
}

/**
 * Union of all built-in geometry shapes.
 */
export type AnyShape = Rect | Ellipse | Polygon

function isPointOnSegment(point: Point, start: Point, end: Point) {
    const crossProduct = (point.y - start.y) * (end.x - start.x) - (point.x - start.x) * (end.y - start.y)
    if (Math.abs(crossProduct) > Number.EPSILON) return false

    const dotProduct = (point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)
    if (dotProduct < 0) return false

    const segmentLengthSquared = (end.x - start.x) ** 2 + (end.y - start.y) ** 2
    return dotProduct <= segmentLengthSquared
}
