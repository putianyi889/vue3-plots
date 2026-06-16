import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import MiniPie from '../../src/components/MiniPie.vue'

describe('MiniPie', () => {
    it('renders pie slices from data values and colors', () => {
        const wrapper = mount(MiniPie, {
            props: {
                data: [
                    { value: 1, color: 'red' },
                    { value: 3, color: 'blue' },
                ],
                radius: 10,
            },
        })
        const paths = wrapper.findAll('path')

        expect(wrapper.find('svg').attributes()).toMatchObject({
            height: '20',
            viewBox: '-10 -10 20 20',
            width: '20',
        })
        expect(paths).toHaveLength(2)
        expect(paths[0].attributes()).toMatchObject({
            d: 'M 0 0 L 10 0 A 10 10 0 0 1 0 10 Z',
            fill: 'red',
        })
        expect(paths[1].attributes('fill')).toBe('blue')
    })

    it('uses total and startAngle to control slice proportions and rotation', () => {
        const wrapper = mount(MiniPie, {
            props: {
                data: [{ value: 25, color: '#2563eb' }],
                radius: 8,
                startAngle: -90,
                total: 100,
            },
        })

        expect(wrapper.find('path').attributes()).toMatchObject({
            d: 'M 0 0 L 0 -8 A 8 8 0 0 1 8 0 Z',
            fill: '#2563eb',
        })
    })

    it('renders a full circle when one slice fills the total', () => {
        const wrapper = mount(MiniPie, {
            props: {
                data: [{ value: 1, color: 'currentColor' }],
                radius: 6,
            },
        })

        expect(wrapper.find('path').attributes()).toMatchObject({
            d: 'M 6 0 A 6 6 0 1 1 -6 0 A 6 6 0 1 1 6 0 Z',
            fill: 'currentColor',
        })
    })

    it('passes class and style attributes to the root svg element', () => {
        const wrapper = mount(MiniPie, {
            attrs: {
                class: 'status-pie',
                style: 'width: 1.25rem; vertical-align: middle;',
            },
            props: {
                data: [{ value: 1, color: 'green' }],
            },
        })
        const svg = wrapper.find('svg')

        expect(svg.classes()).toContain('status-pie')
        expect(svg.attributes('style')).toContain('width: 1.25rem')
        expect(svg.attributes('style')).toContain('vertical-align: middle')
    })
})
