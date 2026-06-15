import { h } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Grid from '../../src/components/Grid.vue'
import TransformGroup from '../../src/components/TransformGroup.vue'
import XLabel from '../../src/components/XLabel.vue'
import { domain, padding, size } from './helpers'

describe('TransformGroup', () => {
    it('provides domain, size, and padding to plot layers in its slot', () => {
        const wrapper = mount(TransformGroup, {
            props: { domain, size, padding },
            slots: {
                default: [
                    '<Grid :x-ticks="[0, 10]" :y-ticks="[0, 10]" />',
                    '<XLabel>Shared size</XLabel>',
                ].join(''),
            },
            global: {
                components: { Grid, XLabel },
            },
        })

        const grid = wrapper.find('.plot-grid')
        const label = wrapper.find('.plot-x-label')

        expect(grid.attributes()).toMatchObject({ height: '80', width: '100', viewBox: '0 0 100 80' })
        expect(grid.find('line').attributes()).toMatchObject({ x1: '40', x2: '40', y1: '10', y2: '50' })
        expect(label.attributes()).toMatchObject({ height: '80', width: '100', viewBox: '0 0 100 80' })
        expect(label.find('text').text()).toBe('Shared size')
    })

    it('lets explicit child props override provided context', () => {
        const overrideDomain = { xMin: 0, xMax: 5, yMin: 0, yMax: 5 }
        const wrapper = mount(TransformGroup, {
            props: { domain, size, padding },
            slots: {
                default: () => h(Grid, { domain: overrideDomain, xTicks: [5] }),
            },
        })

        expect(wrapper.find('line').attributes()).toMatchObject({ x1: '80', x2: '80' })
    })
})
