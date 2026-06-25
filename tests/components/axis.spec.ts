import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'

import Axis from '../../src/components/Axis.vue'
import { domain, padding, size } from './helpers'

describe('Axis', () => {
    it('renders horizontal axis ticks and tick labels at the default bottom position', () => {
        const wrapper = mount(Axis, {
            props: { direction: 'horizontal', domain, size, padding, ticks: [0, 10] },
        })

        expect(wrapper.findAll('.plot-axis__tick')).toHaveLength(2)
        expect(wrapper.find('svg').classes()).toContain('plot-axis--horizontal')
        expect(wrapper.find('line').attributes()).toMatchObject({ stroke: 'none', 'stroke-opacity': '1', 'stroke-width': '1', y1: '50', y2: '50' })
        expect(wrapper.find('text').attributes()).toMatchObject({ y: '74', 'text-anchor': 'middle', 'dominant-baseline': 'middle' })
    })

    it('uses custom horizontal position, offset, and text anchor', () => {
        const wrapper = mount(Axis, {
            props: { direction: 'horizontal', domain, size, padding, ticks: [5], position: 5, offset: 12, textAnchor: 'start' },
        })
        const tickLine = wrapper.findAll('line')[1]
        const tickText = wrapper.find('text')

        expect(tickLine.attributes()).toMatchObject({ x1: '60', x2: '60', y1: '30', y2: '34' })
        expect(tickText.attributes()).toMatchObject({ x: '60', y: '42', 'text-anchor': 'start', 'dominant-baseline': 'middle' })
    })

    it('renders custom tick slot with scaled coordinates', () => {
        const wrapper = mount(Axis, {
            props: { direction: 'horizontal', domain, size, padding, ticks: [5] },
            slots: {
                tick: '<tspan class="custom-x">x:{{ tick }}@{{ x }},{{ y }}</tspan>',
            },
        })

        expect(wrapper.find('.custom-x').text()).toBe('x:5@60,74')
    })

    it('renders vertical axis ticks and tick labels at the default left position', () => {
        const wrapper = mount(Axis, {
            props: { direction: 'vertical', domain, size, padding, ticks: [0, 10] },
        })

        expect(wrapper.findAll('.plot-axis__tick')).toHaveLength(2)
        expect(wrapper.find('svg').classes()).toContain('plot-axis--vertical')
        expect(wrapper.find('line').attributes()).toMatchObject({ stroke: 'none', 'stroke-opacity': '1', 'stroke-width': '1', x1: '40', x2: '40' })
        expect(wrapper.find('text').attributes()).toMatchObject({ x: '16', 'text-anchor': 'middle', 'dominant-baseline': 'middle' })
    })

    it('uses custom vertical position, offset, and text anchor', () => {
        const wrapper = mount(Axis, {
            props: { direction: 'vertical', domain, size, padding, ticks: [5], position: 5, offset: 12, textAnchor: 'middle' },
        })
        const tickLine = wrapper.findAll('line')[1]
        const tickText = wrapper.find('text')

        expect(tickLine.attributes()).toMatchObject({ x1: '60', x2: '56', y1: '30', y2: '30' })
        expect(tickText.attributes()).toMatchObject({ x: '72', y: '30', 'text-anchor': 'middle', 'dominant-baseline': 'middle' })
    })

    it('applies array-valued tick styles by tick index', () => {
        const wrapper = mount(Axis, {
            props: {
                direction: 'vertical',
                domain,
                size,
                padding,
                ticks: [10],
                tickSize: [8],
                strokeColor: ['blue'],
                strokeOpacity: [0.8],
                strokeWidth: [2],
            },
        })
        const tickLine = wrapper.findAll('line')[1]
        const tickText = wrapper.find('text')

        expect(tickLine.attributes()).toMatchObject({ stroke: 'blue', 'stroke-opacity': '0.8', 'stroke-width': '2', x2: '32' })
        expect(tickText.attributes()).toMatchObject({ x: '16', 'text-anchor': 'middle' })
    })

    it('renders duplicate tick values without duplicate key warnings', async () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
        const wrapper = mount(Axis, {
            props: { direction: 'horizontal', domain, size, padding, ticks: [5, 5] },
        })

        await wrapper.setProps({ ticks: [5, 5, 5] })

        expect(wrapper.findAll('.plot-axis__tick')).toHaveLength(3)
        expect(wrapper.findAll('text').map((text) => text.text())).toEqual(['5', '5', '5'])
        expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('Duplicate keys found during update'))

        warn.mockRestore()
    })
})
