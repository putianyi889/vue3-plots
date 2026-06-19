import { describe, expect, it } from 'vitest'

import { AnnularSector, CircularSector, Ellipse, Polygon, Rect } from '../../src/components/geometry'

describe('geometry', () => {
    describe('Rect', () => {
        it('contains points inside and on the boundary', () => {
            const rect = new Rect(10, 20, 30, 40)

            expect(rect.type).toBe('rect')
            expect(rect.contains({ x: 10, y: 20 })).toBe(true)
            expect(rect.contains({ x: 25, y: 40 })).toBe(true)
            expect(rect.contains({ x: 40, y: 60 })).toBe(true)
        })

        it('rejects points outside the rectangle', () => {
            const rect = new Rect(10, 20, 30, 40)

            expect(rect.contains({ x: 9, y: 20 })).toBe(false)
            expect(rect.contains({ x: 41, y: 60 })).toBe(false)
            expect(rect.contains({ x: 10, y: 19 })).toBe(false)
            expect(rect.contains({ x: 40, y: 61 })).toBe(false)
        })

        it('generates an SVG path string', () => {
            expect(new Rect(10, 20, 30, 40).svgPath()).toBe('M 10 20 H 40 V 60 H 10 Z')
        })
    })

    describe('Ellipse', () => {
        it('contains points inside and on the boundary', () => {
            const ellipse = new Ellipse(10, 20, 6, 4)

            expect(ellipse.type).toBe('ellipse')
            expect(ellipse.contains({ x: 10, y: 20 })).toBe(true)
            expect(ellipse.contains({ x: 16, y: 20 })).toBe(true)
            expect(ellipse.contains({ x: 10, y: 24 })).toBe(true)
            expect(ellipse.contains({ x: 13, y: 22 })).toBe(true)
        })

        it('rejects points outside the ellipse', () => {
            const ellipse = new Ellipse(10, 20, 6, 4)

            expect(ellipse.contains({ x: 17, y: 20 })).toBe(false)
            expect(ellipse.contains({ x: 10, y: 25 })).toBe(false)
            expect(ellipse.contains({ x: 15, y: 24 })).toBe(false)
        })

        it('rejects all points when either radius is not positive', () => {
            expect(new Ellipse(10, 20, 0, 4).contains({ x: 10, y: 20 })).toBe(false)
            expect(new Ellipse(10, 20, 6, 0).contains({ x: 10, y: 20 })).toBe(false)
        })

        it('generates an SVG path string', () => {
            expect(new Ellipse(10, 20, 6, 4).svgPath()).toBe('M 16 20 A 6 4 0 1 1 4 20 A 6 4 0 1 1 16 20 Z')
        })
    })

    describe('Polygon', () => {
        const polygon = new Polygon([
            { x: 10, y: 10 },
            { x: 40, y: 10 },
            { x: 40, y: 30 },
            { x: 10, y: 30 },
        ])

        it('contains points inside and on the boundary', () => {
            expect(polygon.type).toBe('polygon')
            expect(polygon.contains({ x: 20, y: 20 })).toBe(true)
            expect(polygon.contains({ x: 10, y: 20 })).toBe(true)
            expect(polygon.contains({ x: 40, y: 30 })).toBe(true)
        })

        it('rejects points outside the polygon', () => {
            expect(polygon.contains({ x: 9, y: 20 })).toBe(false)
            expect(polygon.contains({ x: 20, y: 31 })).toBe(false)
        })

        it('rejects all points when fewer than three vertices are provided', () => {
            expect(new Polygon([{ x: 0, y: 0 }, { x: 1, y: 1 }]).contains({ x: 0, y: 0 })).toBe(false)
        })

        it('generates an SVG path string', () => {
            expect(polygon.svgPath()).toBe('M 10 10 L 40 10 L 40 30 L 10 30 Z')
            expect(new Polygon([]).svgPath()).toBe('')
        })
    })

    describe('CircularSector', () => {
        it('contains points inside and on the boundary', () => {
            const sector = new CircularSector(10, 20, 8, 0, 90)

            expect(sector.type).toBe('circular-sector')
            expect(sector.contains({ x: 10, y: 20 })).toBe(true)
            expect(sector.contains({ x: 18, y: 20 })).toBe(true)
            expect(sector.contains({ x: 10, y: 28 })).toBe(true)
        })

        it('rejects points outside the sector', () => {
            const sector = new CircularSector(10, 20, 8, 0, 90)

            expect(sector.contains({ x: 19, y: 20 })).toBe(false)
            expect(sector.contains({ x: 10, y: 11 })).toBe(false)
        })

        it('generates an SVG path string', () => {
            expect(new CircularSector(10, 20, 8, -90, 90).svgPath()).toBe('M 10 20 L 10 12 A 8 8 0 0 1 18 20 Z')
        })
    })

    describe('AnnularSector', () => {
        it('contains points inside and on the boundary', () => {
            const sector = new AnnularSector(10, 20, 4, 8, 0, 90)

            expect(sector.type).toBe('annular-sector')
            expect(sector.contains({ x: 14, y: 20 })).toBe(true)
            expect(sector.contains({ x: 18, y: 20 })).toBe(true)
            expect(sector.contains({ x: 10, y: 28 })).toBe(true)
        })

        it('rejects points outside the annular sector', () => {
            const sector = new AnnularSector(10, 20, 4, 8, 0, 90)

            expect(sector.contains({ x: 10, y: 20 })).toBe(false)
            expect(sector.contains({ x: 19, y: 20 })).toBe(false)
            expect(sector.contains({ x: 10, y: 11 })).toBe(false)
        })

        it('generates an SVG path string', () => {
            expect(new AnnularSector(10, 20, 4, 8, -90, 90).svgPath()).toBe('M 10 12 A 8 8 0 0 1 18 20 L 14 20 A 4 4 0 0 0 10 16 Z')
        })
    })
})
