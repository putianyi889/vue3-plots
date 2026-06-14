import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import Scatter from '../../src/components/Scatter.vue'
import { domain, padding, size } from './helpers'

describe('Scatter', () => {
  it('renders points and emits point click events', async () => {
    const points = [{ x: 0, y: 0, data: 'a' }, { x: 10, y: 10, data: 'b' }]
    const wrapper = mount(Scatter, {
      props: {
        points,
        domain,
        size,
        padding,
        radius: [3, 6],
        fillColor: ['red', 'blue'],
      },
    })

    const groups = wrapper.findAll('.plot-scatter__point')
    const circles = wrapper.findAll('circle')
    expect(groups[0].attributes()).toMatchObject({ transform: 'translate(40, 50)' })
    expect(circles).toHaveLength(2)
    expect(circles[0].attributes()).toMatchObject({ cx: '0', cy: '0', r: '3', fill: 'red' })
    expect(circles[1].attributes()).toMatchObject({ r: '6', fill: 'blue' })

    await groups[1].trigger('click')
    expect(wrapper.emitted('pointClick')).toEqual([[points[1]]])
  })

  it('uses SVG presentation defaults', () => {
    const wrapper = mount(Scatter, {
      props: {
        points: [{ x: 0, y: 0 }],
        domain,
        size,
        padding,
      },
    })

    expect(wrapper.find('circle').attributes()).toMatchObject({
      r: '0',
      fill: 'black',
      'fill-opacity': '1',
      stroke: 'none',
      'stroke-opacity': '1',
      'stroke-width': '1',
    })
  })

  it('applies array styles by original point index', () => {
    const points = [
      { x: 0, y: 0, data: 'first' },
      { x: Number.NaN, y: 5, data: 'skipped' },
      { x: 10, y: 10, data: 'last' },
    ]
    const wrapper = mount(Scatter, {
      props: {
        points,
        domain,
        size,
        padding,
        fillColor: ['red', 'gray', 'blue'],
        fillOpacity: [0.2, 0.5, 0.8],
        strokeColor: ['black', 'gray', 'white'],
        strokeOpacity: [0.4, 0.6, 0.9],
        strokeWidth: [1, 2, 3],
      },
    })

    const circles = wrapper.findAll('circle')
    expect(circles).toHaveLength(2)
    expect(circles[1].attributes()).toMatchObject({
      fill: 'blue',
      'fill-opacity': '0.8',
      stroke: 'white',
      'stroke-opacity': '0.9',
      'stroke-width': '3',
    })
  })

  it('emits point hover events', async () => {
    const points = [{ x: 10, y: 10, data: 'last' }]
    const wrapper = mount(Scatter, {
      props: { points, domain, size, padding },
    })
    const point = wrapper.find('.plot-scatter__point')

    await point.trigger('mouseenter')
    await point.trigger('mouseleave')

    expect(wrapper.emitted('pointEnter')).toEqual([[points[0]]])
    expect(wrapper.emitted('pointLeave')).toEqual([[points[0]]])
  })

  it('renders a custom point slot with svg coordinates, source point, and original index', () => {
    const points = [{ x: 10, y: 10, data: 'custom' }]
    const wrapper = mount(Scatter, {
      props: { points, domain, size, padding, radius: 4 },
      slots: {
        point: '<rect class="custom-point" x="-3" y="-3" width="6" height="6">{{ index }}:{{ x }},{{ y }}:{{ point.data }}</rect>',
      },
    })

    expect(wrapper.find('.plot-scatter__point').attributes()).toMatchObject({ transform: 'translate(80, 10)' })
    expect(wrapper.find('circle').exists()).toBe(false)
    expect(wrapper.find('.custom-point').text()).toBe('0:80,10:custom')
  })
})
