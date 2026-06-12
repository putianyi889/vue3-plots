import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Axes from '../../src/components/Axes.vue'
import { domain, padding, size } from './helpers'

describe('Axes', () => {
  it('renders axis ticks and tick labels', () => {
    const wrapper = mount(Axes, {
      props: { domain, size, padding, xTicks: [0, 10], yTicks: [0, 10] },
    })

    expect(wrapper.findAll('.plot-axes__tick')).toHaveLength(4)
    expect(wrapper.find('line').attributes()).toMatchObject({ stroke: 'none', 'stroke-opacity': '1', 'stroke-width': '1' })
    expect(wrapper.find('text').attributes()).toMatchObject({ y: '70', 'text-anchor': 'middle' })
  })

  it('renders custom tick slots with scaled coordinates', () => {
    const wrapper = mount(Axes, {
      props: { domain, size, padding, xTicks: [5], yTicks: [5] },
      slots: {
        'x-tick': '<tspan class="custom-x">x:{{ tick }}@{{ x }},{{ y }}</tspan>',
        'y-tick': '<tspan class="custom-y">y:{{ tick }}@{{ x }},{{ y }}</tspan>',
      },
    })

    expect(wrapper.find('.custom-x').text()).toBe('x:5@60,70')
    expect(wrapper.find('.custom-y').text()).toBe('y:5@32,30')
  })

  it('applies array-valued tick styles by tick index', () => {
    const wrapper = mount(Axes, {
      props: {
        domain,
        size,
        padding,
        xTicks: [0],
        yTicks: [10],
        tickSize: [6, 8],
        strokeColor: ['red', 'blue'],
        strokeOpacity: [0.4, 0.8],
        strokeWidth: [1, 2],
      },
    })
    const tickGroups = wrapper.findAll('.plot-axes__tick')
    const xTickLine = tickGroups[0].find('line')
    const xTickText = tickGroups[0].find('text')
    const yTickLine = tickGroups[1].find('line')
    const yTickText = tickGroups[1].find('text')

    expect(xTickLine.attributes()).toMatchObject({ stroke: 'red', 'stroke-opacity': '0.4', 'stroke-width': '1', y2: '56' })
    expect(xTickText.attributes()).toMatchObject({ y: '72', 'text-anchor': 'middle' })
    expect(yTickLine.attributes()).toMatchObject({ stroke: 'blue', 'stroke-opacity': '0.8', 'stroke-width': '2', x1: '32' })
    expect(yTickText.attributes()).toMatchObject({ x: '28', 'text-anchor': 'end' })
  })
})
