import { describe, expect, it } from 'vitest'

import {
    createLinearScale,
    formatTick,
    getDataDomain,
    getNiceTicks,
    getPlotArea,
    pointToSvg,
    pointsToSvg,
    getMaybeArray,
} from '../../src/components/utils'

describe('plot utilities', () => {
    it('computes the drawable plot area from size and padding', () => {
        expect(getPlotArea({ width: 100, height: 80 }, { top: 10, right: 20, bottom: 30, left: 40 })).toEqual({
            x: 40,
            y: 10,
            width: 40,
            height: 40,
        })
    })

    it('scales finite values and centers degenerate domains', () => {
        expect(createLinearScale(0, 10, 100, 200)(5)).toBe(150)
        expect(createLinearScale(1, 1, 100, 200)(1)).toBe(150)
        expect(createLinearScale(0, 10, 100, 200)(Number.NaN)).toBe(100)
    })

    it('maps data points into SVG coordinates', () => {
        const area = { x: 40, y: 10, width: 40, height: 40 }
        const domain = { xMin: 0, xMax: 10, yMin: 0, yMax: 10 }
        const scaleX = createLinearScale(domain.xMin, domain.xMax, area.x, area.x + area.width)
        const scaleY = createLinearScale(domain.yMin, domain.yMax, area.y + area.height, area.y)

        expect(pointToSvg({ x: 5, y: 5 }, scaleX, scaleY)).toEqual({ x: 60, y: 30 })
        expect(pointsToSvg([{ x: 0, y: 0 }, { x: Number.NaN, y: 1 }, { x: 10, y: 10 }], scaleX, scaleY)).toEqual([
            { x: 40, y: 50 },
            { x: 80, y: 10 },
        ])
    })

    it('derives padded domains with fallbacks for empty data', () => {
        expect(getDataDomain([{ x: 10, y: 20 }], 0.1)).toEqual({
            xMin: 9,
            xMax: 11,
            yMin: 18,
            yMax: 22,
        })
        expect(getDataDomain([])).toEqual({ xMin: 0, xMax: 1, yMin: 0, yMax: 1 })
    })

    it('creates readable tick values and labels', () => {
        expect(getNiceTicks(0, 10, 6)).toEqual([0, 2, 4, 6, 8, 10])
        expect(formatTick(1234)).toBe('1.23e+3')
        expect(formatTick(0.00012)).toBe('1.20e-4')
        expect(formatTick(12.345678)).toBe('12.3457')
    })

    it('reads scalar or indexed array values', () => {
        expect(getMaybeArray('blue', 2)).toBe('blue')
        expect(getMaybeArray(['red', 'blue'], 1)).toBe('blue')
    })
})
