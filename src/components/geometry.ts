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
export type ShapeType = 'rect' | 'ellipse' | 'polygon' | 'circular-sector' | 'annular-sector'

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

    /**
     * Generates an SVG path string for the shape boundary.
     */
    abstract svgPath(): string
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

    /**
     * Generates an SVG path string for the rectangle.
     *
     * @returns SVG path data.
     */
    svgPath(): string {
        return [
            `M ${formatCoordinate(this.x)} ${formatCoordinate(this.y)}`,
            `H ${formatCoordinate(this.x + this.width)}`,
            `V ${formatCoordinate(this.y + this.height)}`,
            `H ${formatCoordinate(this.x)}`,
            'Z',
        ].join(' ')
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

    /**
     * Generates an SVG path string for the ellipse.
     *
     * @returns SVG path data.
     */
    svgPath(): string {
        return [
            `M ${formatCoordinate(this.cx + this.rx)} ${formatCoordinate(this.cy)}`,
            `A ${formatCoordinate(this.rx)} ${formatCoordinate(this.ry)} 0 1 1 ${formatCoordinate(this.cx - this.rx)} ${formatCoordinate(this.cy)}`,
            `A ${formatCoordinate(this.rx)} ${formatCoordinate(this.ry)} 0 1 1 ${formatCoordinate(this.cx + this.rx)} ${formatCoordinate(this.cy)}`,
            'Z',
        ].join(' ')
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

    /**
     * Generates an SVG path string for the polygon.
     *
     * @returns SVG path data, or an empty string when no points are available.
     */
    svgPath(): string {
        const firstPoint = this.points[0]
        if (firstPoint === undefined) return ''

        return [
            `M ${formatPoint(firstPoint)}`,
            ...this.points.slice(1).map((point) => `L ${formatPoint(point)}`),
            'Z',
        ].join(' ')
    }
}

/**
 * Circular sector defined by a center point, outer radius, start angle, and sweep angle.
 *
 * Angles are in degrees. `0` points right, and positive values rotate
 * clockwise in SVG coordinates.
 */
export class CircularSector extends Shape<'circular-sector'> {
    readonly type = 'circular-sector'

    constructor(
        /** Center x coordinate. */
        readonly cx: number,
        /** Center y coordinate. */
        readonly cy: number,
        /** Outer radius. */
        readonly radius: number,
        /** Start angle in degrees. */
        readonly startAngle: number,
        /** Sweep angle in degrees. */
        readonly sweep: number,
    ) {
        super()
    }

    /**
     * Checks whether a point is inside or on the sector boundary.
     *
     * @param point Point to test.
     * @returns Whether the point is contained by the sector.
     */
    contains(point: Point): boolean {
        return containsSectorPoint(point, this.cx, this.cy, 0, this.radius, this.startAngle, this.sweep)
    }

    /**
     * Generates an SVG path string for the sector.
     *
     * @returns SVG path data.
     */
    svgPath(): string {
        if (this.sweep >= 360) {
            return new Ellipse(this.cx, this.cy, this.radius, this.radius).svgPath()
        }

        const start = polarPoint(this.cx, this.cy, this.radius, this.startAngle)
        const end = polarPoint(this.cx, this.cy, this.radius, this.startAngle + this.sweep)
        const largeArc = this.sweep > 180 ? 1 : 0

        return [
            `M ${formatCoordinate(this.cx)} ${formatCoordinate(this.cy)}`,
            `L ${formatPoint(start)}`,
            `A ${formatCoordinate(this.radius)} ${formatCoordinate(this.radius)} 0 ${largeArc} 1 ${formatPoint(end)}`,
            'Z',
        ].join(' ')
    }
}

/**
 * Annular sector defined by center point, inner and outer radii, start angle, and sweep angle.
 *
 * Angles are in degrees. `0` points right, and positive values rotate
 * clockwise in SVG coordinates.
 */
export class AnnularSector extends Shape<'annular-sector'> {
    readonly type = 'annular-sector'

    constructor(
        /** Center x coordinate. */
        readonly cx: number,
        /** Center y coordinate. */
        readonly cy: number,
        /** Inner radius. */
        readonly innerRadius: number,
        /** Outer radius. */
        readonly outerRadius: number,
        /** Start angle in degrees. */
        readonly startAngle: number,
        /** Sweep angle in degrees. */
        readonly sweep: number,
    ) {
        super()
    }

    /**
     * Checks whether a point is inside or on the annular sector boundary.
     *
     * @param point Point to test.
     * @returns Whether the point is contained by the annular sector.
     */
    contains(point: Point): boolean {
        return containsSectorPoint(point, this.cx, this.cy, this.innerRadius, this.outerRadius, this.startAngle, this.sweep)
    }

    /**
     * Generates an SVG path string for the annular sector.
     *
     * @returns SVG path data.
     */
    svgPath(): string {
        if (this.innerRadius === 0) {
            return new CircularSector(this.cx, this.cy, this.outerRadius, this.startAngle, this.sweep).svgPath()
        }

        if (this.sweep >= 360) {
            return [
                new Ellipse(this.cx, this.cy, this.outerRadius, this.outerRadius).svgPath().replace(/ Z$/, ''),
                `M ${formatCoordinate(this.cx + this.innerRadius)} ${formatCoordinate(this.cy)}`,
                `A ${formatCoordinate(this.innerRadius)} ${formatCoordinate(this.innerRadius)} 0 1 0 ${formatCoordinate(this.cx - this.innerRadius)} ${formatCoordinate(this.cy)}`,
                `A ${formatCoordinate(this.innerRadius)} ${formatCoordinate(this.innerRadius)} 0 1 0 ${formatCoordinate(this.cx + this.innerRadius)} ${formatCoordinate(this.cy)}`,
                'Z',
            ].join(' ')
        }

        const outerStart = polarPoint(this.cx, this.cy, this.outerRadius, this.startAngle)
        const outerEnd = polarPoint(this.cx, this.cy, this.outerRadius, this.startAngle + this.sweep)
        const innerEnd = polarPoint(this.cx, this.cy, this.innerRadius, this.startAngle + this.sweep)
        const innerStart = polarPoint(this.cx, this.cy, this.innerRadius, this.startAngle)
        const largeArc = this.sweep > 180 ? 1 : 0

        return [
            `M ${formatPoint(outerStart)}`,
            `A ${formatCoordinate(this.outerRadius)} ${formatCoordinate(this.outerRadius)} 0 ${largeArc} 1 ${formatPoint(outerEnd)}`,
            `L ${formatPoint(innerEnd)}`,
            `A ${formatCoordinate(this.innerRadius)} ${formatCoordinate(this.innerRadius)} 0 ${largeArc} 0 ${formatPoint(innerStart)}`,
            'Z',
        ].join(' ')
    }
}

/**
 * Union of all built-in geometry shapes.
 */
export type AnyShape = Rect | Ellipse | Polygon | CircularSector | AnnularSector

function isPointOnSegment(point: Point, start: Point, end: Point) {
    const crossProduct = (point.y - start.y) * (end.x - start.x) - (point.x - start.x) * (end.y - start.y)
    if (Math.abs(crossProduct) > Number.EPSILON) return false

    const dotProduct = (point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)
    if (dotProduct < 0) return false

    const segmentLengthSquared = (end.x - start.x) ** 2 + (end.y - start.y) ** 2
    return dotProduct <= segmentLengthSquared
}

function formatPoint(point: Point) {
    return `${formatCoordinate(point.x)} ${formatCoordinate(point.y)}`
}

function formatCoordinate(value: number) {
    if (Object.is(value, -0)) return '0'

    return Number(value.toFixed(6)).toString()
}

function polarPoint(cx: number, cy: number, radius: number, angle: number): Point {
    const radians = angle * Math.PI / 180

    return {
        x: cx + radius * Math.cos(radians),
        y: cy + radius * Math.sin(radians),
    }
}

function containsSectorPoint(
    point: Point,
    cx: number, cy: number,
    innerRadius: number, outerRadius: number,
    startAngle: number, sweep: number,
) {
    if (outerRadius <= 0 || innerRadius < 0 || innerRadius > outerRadius || sweep <= 0) return false

    const dx = point.x - cx
    const dy = point.y - cy
    const radius = Math.hypot(dx, dy)
    if (radius < innerRadius || radius > outerRadius) return false
    if (sweep >= 360) return true

    const angle = normalizeAngle(Math.atan2(dy, dx) * 180 / Math.PI)
    const start = normalizeAngle(startAngle)
    const relativeAngle = normalizeAngle(angle - start)

    return relativeAngle <= sweep
}

function normalizeAngle(angle: number) {
    return (angle % 360 + 360) % 360
}
