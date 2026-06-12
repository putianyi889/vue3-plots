import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import MouseDraw from '../../src/components/MouseDraw.vue'
import { mockSvgBounds, size } from './helpers'

describe('MouseDraw', () => {
  it('emits drawn rectangles from click gestures', async () => {
    const wrapper = mount(MouseDraw, {
      props: { mode: 'rect', size },
    })

    const svg = wrapper.find('svg')
    mockSvgBounds(svg.element)

    await svg.trigger('click', { clientX: 10, clientY: 20 })
    await svg.trigger('mousemove', { clientX: 30, clientY: 50 })
    await svg.trigger('click', { clientX: 30, clientY: 50 })

    const [[shape]] = wrapper.emitted('draw') ?? []
    expect(shape).toMatchObject({ type: 'rect', x: 10, y: 20, width: 20, height: 30 })
  })

  it('normalizes reverse rectangle clicks', async () => {
    const wrapper = mount(MouseDraw, {
      props: { mode: 'rect', size },
    })

    const svg = wrapper.find('svg')
    mockSvgBounds(svg.element)

    await svg.trigger('click', { clientX: 30, clientY: 50 })
    await svg.trigger('click', { clientX: 10, clientY: 20 })

    const [[shape]] = wrapper.emitted('draw') ?? []
    expect(shape).toMatchObject({ type: 'rect', x: 10, y: 20, width: 20, height: 30 })
  })

  it('emits ellipses from click gestures', async () => {
    const wrapper = mount(MouseDraw, {
      props: { mode: 'ellipse', size, fillOpacity: 0.25, strokeOpacity: 0.75 },
    })

    const svg = wrapper.find('svg')
    mockSvgBounds(svg.element)

    await svg.trigger('click', { clientX: 10, clientY: 20 })
    await svg.trigger('mousemove', { clientX: 30, clientY: 50 })
    expect(wrapper.find('ellipse').attributes()).toMatchObject({
      cx: '20',
      cy: '35',
      'fill-opacity': '0.25',
      rx: '10',
      ry: '15',
      'stroke-opacity': '0.75',
    })

    await svg.trigger('click', { clientX: 30, clientY: 50 })

    const [[shape]] = wrapper.emitted('draw') ?? []
    expect(shape).toMatchObject({ type: 'ellipse', cx: 20, cy: 35, rx: 10, ry: 15 })
  })

  it('emits polygons from click gestures', async () => {
    const wrapper = mount(MouseDraw, {
      props: { mode: 'polygon', size },
    })

    const svg = wrapper.find('svg')
    mockSvgBounds(svg.element)

    await svg.trigger('click', { clientX: 10, clientY: 20 })
    expect(wrapper.find('polygon').exists()).toBe(false)

    await svg.trigger('click', { clientX: 30, clientY: 20 })
    await svg.trigger('mousemove', { clientX: 30, clientY: 50 })
    expect(wrapper.find('polygon').attributes('points')).toBe('10,20 30,20 30,50')

    await svg.trigger('click', { clientX: 30, clientY: 50 })
    await svg.trigger('dblclick', { clientX: 10, clientY: 50 })

    const [[shape]] = wrapper.emitted('draw') ?? []
    expect(shape).toMatchObject({
      type: 'polygon',
      points: [
        { x: 10, y: 20 },
        { x: 30, y: 20 },
        { x: 30, y: 50 },
        { x: 10, y: 50 },
      ],
    })
  })

  it('does not draw when disabled', async () => {
    const wrapper = mount(MouseDraw, {
      props: { mode: '', size },
    })

    const svg = wrapper.find('svg')
    mockSvgBounds(svg.element)

    await svg.trigger('click', { clientX: 10, clientY: 20 })
    await svg.trigger('mousemove', { clientX: 30, clientY: 50 })
    await svg.trigger('click', { clientX: 30, clientY: 50 })

    expect(svg.classes()).toContain('plot-mouse-draw--disabled')
    expect(wrapper.find('.plot-mouse-draw__shape').exists()).toBe(false)
    expect(wrapper.emitted('draw')).toBeUndefined()
  })
})
