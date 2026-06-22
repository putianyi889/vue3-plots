import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Bar from '../../src/components/Bar.vue'
import { domain, padding, size } from './helpers'

describe('Bar', () => {
    it('renders vertical bars from the minimum y domain value by default', () => {
        const wrapper = mount(Bar, {
            props: { values: [2, 6], domain, padding, size, fill: '#2563eb', rx: 2 },
        })
        const bars = wrapper.findAll('rect')

        expect(bars).toHaveLength(2)
        expect(bars[0].attributes()).toMatchObject({
            x: '42', y: '42', width: '16', height: '8', fill: '#2563eb', rx: '2',
        })
        expect(bars[1].attributes()).toMatchObject({ x: '62', y: '26', width: '16', height: '24' })
    })

    it('uses the supplied baseline and skips non-finite values', () => {
        const wrapper = mount(Bar, {
            props: { values: [2, Number.NaN, 6], baseline: 4, domain, padding, size },
        })
        const bars = wrapper.findAll('rect')

        expect(bars).toHaveLength(2)
        expect(bars[0].attributes()).toMatchObject({ x: '41.333333333333336', y: '34', width: '10.666666666666668', height: '8' })
        expect(bars[1].attributes()).toMatchObject({ x: '68', y: '26', width: '10.666666666666668', height: '8' })
    })

    it('lays side-by-side series out using gap and sub-gap', () => {
        const firstSeries = mount(Bar, {
            props: { values: [10], seriesCount: 2, domain, padding, size },
        })
        const secondSeries = mount(Bar, {
            props: { values: [10], seriesCount: 2, seriesIndex: 1, domain, padding, size },
        })

        expect(firstSeries.find('rect').attributes()).toMatchObject({ x: '44', width: '15.2' })
        expect(secondSeries.find('rect').attributes()).toMatchObject({ x: '60.8', width: '15.2' })
    })

    it('renders horizontal bars from the minimum x domain value by default', () => {
        const wrapper = mount(Bar, {
            props: { values: [2, 6], direction: 'horizontal', domain, padding, size },
        })
        const bars = wrapper.findAll('rect')

        expect(bars[0].attributes()).toMatchObject({ x: '40', y: '32', width: '8', height: '16' })
        expect(bars[1].attributes()).toMatchObject({ x: '40', y: '12', width: '24', height: '16' })
    })

    it('exposes data-space category centers and rendered rectangles', () => {
        const wrapper = mount(Bar, {
            props: { values: [2, 6], domain, padding, size },
        })

        expect(wrapper.vm.positions).toEqual([2.5, 7.5])
        expect(wrapper.vm.bars).toMatchObject([
            { index: 0, position: 2.5, value: 2, x: 42, y: 42, width: 16, height: 8 },
            { index: 1, position: 7.5, value: 6, x: 62, y: 26, width: 16, height: 24 },
        ])
    })
})
