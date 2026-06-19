import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Pie from '../../src/components/Pie.vue'
import TransformGroup from '../../src/components/TransformGroup.vue'
import { domain, padding, size } from './helpers'

describe('Pie', () => {
    it('renders pie slices centered in the plot area with a default outer radius', () => {
        const wrapper = mount(Pie, {
            props: {
                data: [
                    { value: 1, color: 'red' },
                    { value: 3, color: 'blue' },
                ],
                size,
                padding,
            },
        })
        const paths = wrapper.findAll('path')

        expect(wrapper.find('svg').attributes()).toMatchObject({
            height: '80',
            width: '100',
            viewBox: '0 0 100 80',
        })
        expect(wrapper.find('g').attributes('transform')).toBe('translate(60, 30)')
        expect(paths).toHaveLength(2)
        expect(paths[0].attributes()).toMatchObject({
            d: 'M 0 0 L 10 0 A 10 10 0 0 1 0 10 Z',
            fill: 'red',
            stroke: 'none',
            'stroke-width': '1',
        })
        expect(paths[1].attributes('fill')).toBe('blue')
    })

    it('supports inner and outer radius arrays for donut slices', () => {
        const wrapper = mount(Pie, {
            props: {
                data: [
                    { value: 1, color: 'red' },
                    { value: 1, color: 'blue' },
                ],
                size,
                padding,
                innerRadius: [4, 6],
                outerRadius: [10, 12],
            },
        })
        const paths = wrapper.findAll('path')

        expect(paths[0].attributes('d')).toBe('M 10 0 A 10 10 0 0 1 -10 0 L -4 0 A 4 4 0 0 0 4 0 Z')
        expect(paths[1].attributes('d')).toBe('M -12 0 A 12 12 0 0 1 12 0 L 6 0 A 6 6 0 0 0 -6 0 Z')
    })

    it('applies stroke styles by original slice index', () => {
        const wrapper = mount(Pie, {
            props: {
                data: [
                    { value: 1, color: 'red' },
                    { value: 1, color: 'blue' },
                ],
                size,
                padding,
                strokeColor: ['white', 'black'],
                strokeWidth: [2, 3],
            },
        })
        const paths = wrapper.findAll('path')

        expect(paths[0].attributes()).toMatchObject({ stroke: 'white', 'stroke-width': '2' })
        expect(paths[1].attributes()).toMatchObject({ stroke: 'black', 'stroke-width': '3' })
    })

    it('does not emit piece events when not interactive', async () => {
        const wrapper = mount(Pie, {
            props: {
                data: [{ value: 1, color: 'red' }],
                size,
                padding,
            },
        })
        const path = wrapper.find('path')

        expect(wrapper.find('svg').classes()).toContain('plot-layer--passive')
        expect(wrapper.find('svg').classes()).not.toContain('plot-layer--interactive')
        expect(path.classes()).not.toContain('plot-pie__piece--interactive')

        await path.trigger('click')
        await path.trigger('mouseenter')
        await path.trigger('mouseleave')

        expect(wrapper.emitted('click')).toBeUndefined()
        expect(wrapper.emitted('mouseEnter')).toBeUndefined()
        expect(wrapper.emitted('mouseLeave')).toBeUndefined()
    })

    it('emits piece events when interactive', async () => {
        const data = [
            { value: 1, color: 'red' },
            { value: 1, color: 'blue' },
        ]
        const wrapper = mount(Pie, {
            props: {
                data,
                size,
                padding,
                interactive: true,
            },
        })
        const paths = wrapper.findAll('path')

        expect(wrapper.find('svg').classes()).toContain('plot-layer--interactive')
        expect(wrapper.find('svg').classes()).not.toContain('plot-layer--passive')
        expect(paths[1].classes()).toContain('plot-pie__piece--interactive')

        await paths[1].trigger('click')
        await paths[1].trigger('mouseenter')
        await paths[1].trigger('mouseleave')

        expect(wrapper.emitted('click')?.[0]?.[0]).toMatchObject({ index: 1, data: data[1] })
        expect(wrapper.emitted('mouseEnter')?.[0]?.[0]).toMatchObject({ index: 1, data: data[1] })
        expect(wrapper.emitted('mouseLeave')?.[0]?.[0]).toMatchObject({ index: 1, data: data[1] })
    })

    it('uses provided values without filtering data', () => {
        const wrapper = mount(Pie, {
            props: {
                data: [
                    { value: 0, color: 'transparent' },
                    { value: 1, color: 'green' },
                ],
                size,
                padding,
            },
        })
        const paths = wrapper.findAll('path')

        expect(paths).toHaveLength(2)
        expect(paths[0].attributes('d')).toBe('M 0 0 L 10 0 A 10 10 0 0 1 10 0 Z')
        expect(paths[1].attributes('d')).toBe('M 10 0 A 10 10 0 1 1 -10 0 A 10 10 0 1 1 10 0 Z')
    })

    it('uses total and startAngle to control slice proportions and rotation', () => {
        const wrapper = mount(Pie, {
            props: {
                data: [{ value: 25, color: '#2563eb' }],
                size,
                padding,
                outerRadius: 8,
                startAngle: -90,
                total: 100,
            },
        })

        expect(wrapper.find('path').attributes()).toMatchObject({
            d: 'M 0 0 L 0 -8 A 8 8 0 0 1 8 0 Z',
            fill: '#2563eb',
        })
    })

    it('uses size and padding from TransformGroup context', () => {
        const wrapper = mount(TransformGroup, {
            props: { domain, size, padding },
            slots: {
                default: '<Pie :data="[{ value: 1, color: \'green\' }]" />',
            },
            global: {
                components: { Pie },
            },
        })

        expect(wrapper.find('.plot-pie').attributes()).toMatchObject({ height: '80', width: '100' })
        expect(wrapper.find('g').attributes('transform')).toBe('translate(60, 30)')
    })
})
