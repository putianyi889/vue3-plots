export interface Point {
  x: number
  y: number
}

export type ShapeType = 'rect' | 'ellipse' | 'polygon'

export abstract class Shape<TType extends ShapeType> {
  abstract readonly type: TType

  abstract contains(point: Point): boolean
}

export class Rect extends Shape<'rect'> {
  readonly type = 'rect'

  constructor(
    readonly x: number,
    readonly y: number,
    readonly width: number,
    readonly height: number,
  ) {
    super()
  }

  contains(point: Point): boolean {
    return point.x >= this.x
      && point.x <= this.x + this.width
      && point.y >= this.y
      && point.y <= this.y + this.height
  }
}

export class Ellipse extends Shape<'ellipse'> {
  readonly type = 'ellipse'

  constructor(
    readonly cx: number,
    readonly cy: number,
    readonly rx: number,
    readonly ry: number,
  ) {
    super()
  }

  contains(point: Point): boolean {
    if (this.rx <= 0 || this.ry <= 0) return false

    const dx = (point.x - this.cx) / this.rx
    const dy = (point.y - this.cy) / this.ry

    return dx * dx + dy * dy <= 1
  }
}

export class Polygon extends Shape<'polygon'> {
  readonly type = 'polygon'

  constructor(readonly points: Point[]) {
    super()
  }

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

export type AnyShape = Rect | Ellipse | Polygon

function isPointOnSegment(point: Point, start: Point, end: Point) {
  const crossProduct = (point.y - start.y) * (end.x - start.x) - (point.x - start.x) * (end.y - start.y)
  if (Math.abs(crossProduct) > Number.EPSILON) return false

  const dotProduct = (point.x - start.x) * (end.x - start.x) + (point.y - start.y) * (end.y - start.y)
  if (dotProduct < 0) return false

  const segmentLengthSquared = (end.x - start.x) ** 2 + (end.y - start.y) ** 2
  return dotProduct <= segmentLengthSquared
}
