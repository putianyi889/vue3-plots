import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Grid from '../../src/components/Grid.vue'
import { domain, padding, size } from './helpers'

describe('Grid', () => {
    it('renders grid lines for x and y ticks', () => {
        const wrapper = mount(Grid, {
            props: { domain, size, padding, xTicks: [0, 10], yTicks: [0, 10] },
        })

        expect(wrapper.findAll('line')).toHaveLength(4)
        expect(wrapper.find('line').attributes()).toMatchObject({
            stroke: 'none',
            'stroke-dasharray': 'none',
            'stroke-opacity': '1',
            'stroke-width': '1',
        })
    })

    it('applies stroke and dash styling to grid lines', () => {
        const wrapper = mount(Grid, {
            props: {
                domain,
                size,
                padding,
                xTicks: [0],
                yTicks: [10],
                dashArray: ['4 4', '2 2'],
                strokeColor: ['#eee', '#ddd'],
                strokeOpacity: [0.3, 0.7],
                strokeWidth: [1, 2],
            },
        })
        const lines = wrapper.findAll('line')

        expect(lines[0].attributes()).toMatchObject({ 'stroke-dasharray': '4 4', 'stroke-opacity': '0.3', stroke: '#eee', 'stroke-width': '1' })
        expect(lines[1].attributes()).toMatchObject({ 'stroke-dasharray': '2 2', 'stroke-opacity': '0.7', stroke: '#ddd', 'stroke-width': '2' })
    })
})
