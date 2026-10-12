import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Line from '../../src/components/Line.vue'
import { domain, padding, size } from './helpers'

describe('Line', () => {
    it('renders paths from data points', () => {
        const wrapper = mount(Line, {
            props: {
                points: [{ x: 0, y: 0 }, { x: 5, y: 5 }, { x: 10, y: 10 }],
                domain,
                size,
                padding,
            },
        })

        expect(wrapper.find('path').attributes('d')).toBe('M 40 50 L 60 30 L 80 10')
    })

    it('uses SVG presentation defaults', () => {
        const wrapper = mount(Line, {
            props: {
                points: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
                domain,
                size,
                padding,
            },
        })

        expect(wrapper.find('path').attributes()).toMatchObject({
            stroke: 'none',
            'stroke-linecap': 'butt',
            'stroke-linejoin': 'miter',
            'stroke-opacity': '1',
            'stroke-width': '1',
        })
    })

    it('applies stroke opacity', () => {
        const wrapper = mount(Line, {
            props: {
                points: [{ x: 0, y: 0 }, { x: 10, y: 10 }],
                domain,
                size,
                padding,
                strokeOpacity: 0.35,
            },
        })

        expect(wrapper.find('path').attributes('stroke-opacity')).toBe('0.35')
    })

    it('skips non-finite points', () => {
        const wrapper = mount(Line, {
            props: {
                points: [{ x: 0, y: 0 }, { x: Number.NaN, y: 5 }, { x: 10, y: 10 }],
                domain,
                size,
                padding,
            },
        })

        expect(wrapper.find('path').attributes('d')).toBe('M 40 50 L 80 10')
    })

    it('hides empty paths', () => {
        const wrapper = mount(Line, {
            props: {
                points: [{ x: Number.NaN, y: 0 }],
                domain,
                size,
                padding,
            },
        })

        expect(wrapper.find('path').exists()).toBe(false)
    })

    it('resamples when the size, domain or sampling mode changes', async () => {
        const points = Array.from({ length: 201 }, (_, index) => ({ x: index / 20, y: index % 3 }))
        const wrapper = mount(Line, {
            props: { points, domain, size, padding, sampling: 'min-max' },
        })
        const getPath = () => wrapper.get('path').attributes('d') ?? ''
        const initialPath = getPath()
        const initialCount = initialPath.split(' ').length / 3

        expect(initialCount).toBeLessThan(points.length)
        expect(wrapper.findAll('path')).toHaveLength(1)

        await wrapper.setProps({ size: { ...size, width: 260 } })
        expect(getPath().split(' ').length / 3).toBe(points.length)

        await wrapper.setProps({ size, domain: { ...domain, xMax: 20 } })
        expect(getPath().split(' ').length / 3).toBeLessThan(initialCount)

        await wrapper.setProps({ sampling: 'none' })
        expect(getPath().split(' ').length / 3).toBe(points.length)
    })
})
