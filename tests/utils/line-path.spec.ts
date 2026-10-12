import { describe, expect, it } from 'vitest'

import { createLinePath } from '../../src/components/line-path'
import { createLinearScale } from '../../src/components/utils'
import type { PlotPoint } from '../../src/components/utils'

const identity = (value: number) => value

describe('line path generation', () => {
    const points = [
        { x: 1.1, y: 0 },
        { x: 1.2, y: 9 },
        { x: 1.3, y: -8 },
        { x: 1.4, y: 2 },
        { x: 1.5, y: 1 },
        { x: 2.1, y: 3 },
        { x: 2.2, y: 4 },
    ]

    it('keeps every finite point in full-resolution mode', () => {
        expect(createLinePath(points, identity, identity, 'none')).toBe(
            'M 1.1 0 L 1.2 9 L 1.3 -8 L 1.4 2 L 1.5 1 L 2.1 3 L 2.2 4',
        )
    })

    it('retains column endpoints and both extrema in their original order', () => {
        const snapshot = structuredClone(points)

        expect(createLinePath(points, identity, identity, 'min-max')).toBe(
            'M 1.1 0 L 1.2 9 L 1.3 -8 L 1.5 1 L 2.1 3 L 2.2 4',
        )
        expect(points).toEqual(snapshot)
    })

    it('handles decreasing x without reversing the path', () => {
        expect(createLinePath([...points].reverse(), identity, identity, 'min-max')).toBe(
            'M 2.2 4 L 2.1 3 L 1.5 1 L 1.3 -8 L 1.2 9 L 1.1 0',
        )
    })

    it('preserves extrema and endpoints for repeated x values', () => {
        const vertical = [1, 5, 3, -5, 0].map((y) => ({ x: 1, y }))

        expect(createLinePath(vertical, identity, identity, 'min-max')).toBe('M 1 1 L 1 5 L 1 -5 L 1 0')
    })

    it('keeps loops intact even when the reversal is inside one column', () => {
        const loop = [{ x: 1.1, y: 0 }, { x: 1.8, y: 2 }, { x: 1.4, y: 1 }, { x: 1.2, y: -2 }]

        expect(createLinePath(loop, identity, identity, 'min-max')).toBe('M 1.1 0 L 1.8 2 L 1.4 1 L 1.2 -2')
    })

    it('supports flipped axes', () => {
        expect(createLinePath(points, (x) => -x, (y) => -y, 'min-max')).toBe(
            'M -1.1 0 L -1.2 -9 L -1.3 8 L -1.5 -1 L -2.1 -3 L -2.2 -4',
        )
    })

    it.each(['none', 'min-max'] as const)('filters non-finite points and sparse entries in %s mode', (sampling) => {
        const sparse: PlotPoint[] = []
        sparse[1] = { x: 0, y: 0 }
        sparse[2] = { x: Number.NaN, y: 1 }
        sparse[3] = { x: 1, y: Number.POSITIVE_INFINITY }
        sparse[5] = { x: 2, y: 3 }

        expect(createLinePath(sparse, identity, identity, sampling)).toBe('M 0 0 L 2 3')
        expect(createLinePath([], identity, identity, sampling)).toBe('')
        expect(createLinePath([{ x: Number.NaN, y: 0 }], identity, identity, sampling)).toBe('')
        expect(createLinePath([{ x: 1, y: 2 }], identity, identity, sampling)).toBe('M 1 2')
    })

    it('samples a million points to at most four per column while retaining narrow spikes', () => {
        const largePoints = Array.from({ length: 1_000_001 }, (_, x) => ({
            x,
            y: x === 500_001 ? 10 : x === 500_002 ? -10 : Math.sin(x / 10_000),
        }))
        const scaleX = createLinearScale(0, 1_000_000, 0, 640)
        const path = createLinePath(largePoints, scaleX, identity, 'min-max')

        expect(path.split(' ').length / 3).toBeLessThanOrEqual(4 * 641)
        expect(path).toContain(`L ${scaleX(500_001)} 10 L ${scaleX(500_002)} -10`)
        expect(path.startsWith('M 0 0 ')).toBe(true)
        expect(path.endsWith(`L 640 ${Math.sin(100)}`)).toBe(true)
    })
})
