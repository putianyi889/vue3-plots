/**
 * Data-space point consumed by plot layers.
 *
 * `x` and `y` are numeric coordinates in the data domain. When the generic
 * parameter is left as `unknown`, `data` is optional. When a concrete generic
 * type is supplied, `data` is required so callers can carry typed source data
 * alongside the plotted coordinates.
 */
export type PlotPoint<T = unknown> = {
    x: number
    y: number
} & ([unknown] extends [T] ? { data?: T } : { data: T })

/**
 * Insets between the outer SVG frame and the drawable plot area.
 */
export interface PlotPadding {
    top: number
    right: number
    bottom: number
    left: number
}

/**
 * Data-space bounds used to map coordinates into SVG space.
 */
export interface PlotDomain {
    xMin: number
    xMax: number
    yMin: number
    yMax: number
}

/**
 * Returns a new domain with the x-axis bounds reversed.
 *
 * This is useful when the same data domain should render with x increasing
 * from right to left.
 *
 * @param domain Domain to flip.
 * @returns A new domain with `xMin` and `xMax` swapped.
 */
export function flipX(domain: PlotDomain): PlotDomain {
    return {
        ...domain,
        xMin: domain.xMax,
        xMax: domain.xMin,
    }
}

/**
 * Returns a new domain with the y-axis bounds reversed.
 *
 * This is useful when the same data domain should render with y increasing
 * from top to bottom.
 *
 * @param domain Domain to flip.
 * @returns A new domain with `yMin` and `yMax` swapped.
 */
export function flipY(domain: PlotDomain): PlotDomain {
    return {
        ...domain,
        yMin: domain.yMax,
        yMax: domain.yMin,
    }
}

/**
 * Outer SVG size in pixels.
 */
export interface PlotSize {
    width: number
    height: number
}

/**
 * Drawable SVG area after padding is subtracted from the outer size.
 */
export interface PlotArea {
    x: number
    y: number
    width: number
    height: number
}

/**
 * Point in SVG coordinates.
 */
export interface SvgPoint {
    x: number
    y: number
}

/**
 * One-dimensional scale function.
 */
export type Scale = (value: number) => number

/**
 * Helper type for props that accept either one value or an array of values.
 */
export type MaybeArray<T> = T | T[]

/**
 * Default padding used by plot layers when no explicit padding is supplied.
 */
export const defaultPlotPadding: PlotPadding = {
    top: 12,
    right: 16,
    bottom: 28,
    left: 40,
}

/**
 * Returns the drawable plot area after subtracting padding from the outer size.
 *
 * Width and height are clamped to `0` when padding is larger than the outer
 * size.
 *
 * @example
 * ```ts
 * const area = getPlotArea(
 *   { width: 640, height: 360 },
 *   { top: 12, right: 16, bottom: 28, left: 40 },
 * )
 * ```
 *
 * @param size Outer SVG size.
 * @param padding Plot insets. Defaults to `defaultPlotPadding`.
 * @returns The drawable SVG area.
 */
export function getPlotArea(size: PlotSize, padding: PlotPadding = defaultPlotPadding): PlotArea {
    return {
        x: padding.left,
        y: padding.top,
        width: Math.max(0, size.width - padding.left - padding.right),
        height: Math.max(0, size.height - padding.top - padding.bottom),
    }
}

/**
 * Creates a linear mapping from a data-space domain to an SVG-space range.
 *
 * Non-finite input values map to `rangeMin`. Degenerate or non-finite domains
 * map all values to the center of the range.
 *
 * @example
 * ```ts
 * const scaleX = createLinearScale(0, 10, 40, 624)
 * scaleX(5) // 332
 * ```
 *
 * @param domainMin Lower data-space bound.
 * @param domainMax Upper data-space bound.
 * @param rangeMin Lower SVG-space bound.
 * @param rangeMax Upper SVG-space bound.
 * @returns A scale function.
 */
export function createLinearScale(domainMin: number, domainMax: number, rangeMin: number, rangeMax: number) {
    const domainSpan = domainMax - domainMin

    return (value: number) => {
        if (!Number.isFinite(value)) return rangeMin
        if (!Number.isFinite(domainSpan) || domainSpan === 0) return (rangeMin + rangeMax) / 2
        return rangeMin + (value - domainMin) / domainSpan * (rangeMax - rangeMin)
    }
}

/**
 * Maps one data-space point into SVG coordinates with precomputed scales.
 *
 * @param point Data-space point.
 * @param scaleX Scale used for the x coordinate.
 * @param scaleY Scale used for the y coordinate.
 * @returns The point in SVG coordinates.
 */
export function pointToSvg<T>(point: PlotPoint<T>, scaleX: Scale, scaleY: Scale): SvgPoint {
    return {
        x: scaleX(point.x),
        y: scaleY(point.y),
    }
}

/**
 * Filters non-finite points and maps the remaining points into SVG coordinates.
 *
 * @param points Data-space points.
 * @param scaleX Scale used for x coordinates.
 * @param scaleY Scale used for y coordinates.
 * @returns SVG-space points for finite input coordinates.
 */
export function pointsToSvg<T>(points: PlotPoint<T>[], scaleX: Scale, scaleY: Scale): SvgPoint[] {
    return points.filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y)).map((point) => pointToSvg(point, scaleX, scaleY))
}

/**
 * Calculates a padded domain from finite point coordinates.
 *
 * When no finite values are available, the fallback range is `0` to `1` for
 * each axis. When all values on an axis are equal, the range expands around
 * that value.
 *
 * @param points Data points used to calculate bounds.
 * @param paddingRatio Fraction of each axis range to add as padding.
 * @returns A padded plot domain.
 */
export function getDataDomain<T>(points: PlotPoint<T>[], paddingRatio = 0.05): PlotDomain {
    const xs = points.map((point) => point.x).filter(Number.isFinite)
    const ys = points.map((point) => point.y).filter(Number.isFinite)
    const xRange = padRange(Math.min(...xs), Math.max(...xs), paddingRatio, 0, 1)
    const yRange = padRange(Math.min(...ys), Math.max(...ys), paddingRatio, 0, 1)

    return {
        xMin: xRange.min,
        xMax: xRange.max,
        yMin: yRange.min,
        yMax: yRange.max,
    }
}

/**
 * Generates readable tick values between `min` and `max`.
 *
 * Returns an empty array for non-finite inputs or non-positive `count`.
 * Returns `[min]` when `min === max`.
 *
 * @param min Lower data-space bound.
 * @param max Upper data-space bound.
 * @param count Preferred tick count.
 * @returns Nice tick values.
 */
export function getNiceTicks(min: number, max: number, count = 5): number[] {
    if (!Number.isFinite(min) || !Number.isFinite(max) || count <= 0) return []
    if (min === max) return [min]

    const span = niceNumber(max - min, false)
    const step = niceNumber(span / Math.max(1, count - 1), true)
    const tickMin = Math.ceil(min / step) * step
    const tickMax = Math.floor(max / step) * step
    const ticks: number[] = []

    for (let tick = tickMin; tick <= tickMax + step / 2; tick += step) {
        ticks.push(roundToPrecision(tick, step))
    }

    return ticks
}

/**
 * Formats a tick label for display.
 *
 * Large and very small non-zero values use exponential notation. Other finite
 * values use up to six significant digits. Non-finite values format to an
 * empty string.
 *
 * @param value Tick value.
 * @returns A display label.
 */
export function formatTick(value: number): string {
    if (!Number.isFinite(value)) return ''
    if (Math.abs(value) >= 1000 || (Math.abs(value) < 0.001 && value !== 0)) return value.toExponential(2)
    return Number(value.toPrecision(6)).toString()
}

/**
 * Reads either a scalar value or an indexed array value.
 *
 * Components use this for props that accept `T | T[]`.
 *
 * @example
 * ```ts
 * getMaybeArray('blue', 2) // 'blue'
 * getMaybeArray(['red', 'blue'], 1) // 'blue'
 * ```
 *
 * @param value Scalar or array value.
 * @param index Array index to read when `value` is an array.
 * @returns The resolved value.
 */
export function getMaybeArray<T>(value: MaybeArray<T>, index: number): T {
    return Array.isArray(value) ? value[index] : value
}

/**
 * Converts a polar coordinate into an SVG-space cartesian point.
 *
 * Angles are in degrees. `0` points right, and positive values rotate
 * clockwise in SVG coordinates.
 *
 * @example
 * ```ts
 * polarToCartesian(10, 90) // { x: 0, y: 10 }
 * ```
 *
 * @param radius Distance from the origin.
 * @param angle Angle in degrees.
 * @returns The cartesian point.
 */
export function polarToCartesian(radius: number, angle: number): SvgPoint {
    const radians = angle * Math.PI / 180

    return {
        x: radius * Math.cos(radians),
        y: radius * Math.sin(radians),
    }
}

function padRange(
    min: number,
    max: number,
    paddingRatio: number,
    fallbackMin: number,
    fallbackMax: number,
) {
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
        return {
            min: fallbackMin,
            max: fallbackMax,
        }
    }

    if (min === max) {
        const halfSpan = Math.max(Math.abs(min) * paddingRatio, 1)

        return {
            min: min - halfSpan,
            max: max + halfSpan,
        }
    }

    const padding = (max - min) * paddingRatio

    return {
        min: min - padding,
        max: max + padding,
    }
}

function niceNumber(value: number, round: boolean): number {
    const exponent = Math.floor(Math.log10(value))
    const fraction = value / 10 ** exponent
    let niceFraction = 10

    if (round) {
        if (fraction < 1.5) niceFraction = 1
        else if (fraction < 3) niceFraction = 2
        else if (fraction < 7) niceFraction = 5
    } else if (fraction <= 1) niceFraction = 1
    else if (fraction <= 2) niceFraction = 2
    else if (fraction <= 5) niceFraction = 5

    return niceFraction * 10 ** exponent
}

function roundToPrecision(value: number, step: number): number {
    const precision = Math.max(0, -Math.floor(Math.log10(step)) + 2)
    return Number(value.toFixed(precision))
}
