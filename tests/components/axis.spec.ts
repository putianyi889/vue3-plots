import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import XAxis from '../../src/components/XAxis.vue'
import YAxis from '../../src/components/YAxis.vue'
import { domain, padding, size } from './helpers'

describe('XAxis', () => {
  it('renders x-axis ticks and tick labels at the default bottom position', () => {
    const wrapper = mount(XAxis, {
      props: { domain, size, padding, ticks: [0, 10] },
    })

    expect(wrapper.findAll('.plot-x-axis__tick')).toHaveLength(2)
    expect(wrapper.find('line').attributes()).toMatchObject({ stroke: 'none', 'stroke-opacity': '1', 'stroke-width': '1', y1: '50', y2: '50' })
    expect(wrapper.find('text').attributes()).toMatchObject({ y: '66', 'text-anchor': 'middle', 'dominant-baseline': 'hanging' })
  })

  it('uses custom y, offset, and text anchor', () => {
    const wrapper = mount(XAxis, {
      props: { domain, size, padding, ticks: [5], y: 20, offset: 12, textAnchor: 'start' },
    })
    const tickLine = wrapper.findAll('line')[1]
    const tickText = wrapper.find('text')

    expect(tickLine.attributes()).toMatchObject({ x1: '60', x2: '60', y1: '20', y2: '24' })
    expect(tickText.attributes()).toMatchObject({ x: '60', y: '32', 'text-anchor': 'start', 'dominant-baseline': 'hanging' })
  })

  it('renders custom tick slot with scaled coordinates', () => {
    const wrapper = mount(XAxis, {
      props: { domain, size, padding, ticks: [5] },
      slots: {
        tick: '<tspan class="custom-x">x:{{ tick }}@{{ x }},{{ y }}</tspan>',
      },
    })

    expect(wrapper.find('.custom-x').text()).toBe('x:5@60,66')
  })
})

describe('YAxis', () => {
  it('renders y-axis ticks and tick labels at the default left position', () => {
    const wrapper = mount(YAxis, {
      props: { domain, size, padding, ticks: [0, 10] },
    })

    expect(wrapper.findAll('.plot-y-axis__tick')).toHaveLength(2)
    expect(wrapper.find('line').attributes()).toMatchObject({ stroke: 'none', 'stroke-opacity': '1', 'stroke-width': '1', x1: '40', x2: '40' })
    expect(wrapper.find('text').attributes()).toMatchObject({ x: '24', 'text-anchor': 'end', 'dominant-baseline': 'middle' })
  })

  it('uses custom x, offset, and text anchor', () => {
    const wrapper = mount(YAxis, {
      props: { domain, size, padding, ticks: [5], x: 80, offset: 12, textAnchor: 'middle' },
    })
    const tickLine = wrapper.findAll('line')[1]
    const tickText = wrapper.find('text')

    expect(tickLine.attributes()).toMatchObject({ x1: '80', x2: '76', y1: '30', y2: '30' })
    expect(tickText.attributes()).toMatchObject({ x: '92', y: '30', 'text-anchor': 'middle', 'dominant-baseline': 'middle' })
  })

  it('applies array-valued tick styles by tick index', () => {
    const wrapper = mount(YAxis, {
      props: {
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
    expect(tickText.attributes()).toMatchObject({ x: '24', 'text-anchor': 'end' })
  })
})
