import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import XLabel from '../../src/components/XLabel.vue'
import YLabel from '../../src/components/YLabel.vue'
import { size } from './helpers'

describe('XLabel', () => {
    it('renders default slot content centered at the bottom', () => {
        const wrapper = mount(XLabel, {
            props: { size },
            slots: { default: 'Sample' },
        })
        const text = wrapper.find('text')

        expect(wrapper.classes()).toContain('plot-x-label')
        expect(wrapper.text()).toBe('Sample')
        expect(text.attributes()).toMatchObject({ x: '50', y: '78', 'text-anchor': 'middle' })
    })
})

describe('YLabel', () => {
    it('renders default slot content centered and rotated', () => {
        const wrapper = mount(YLabel, {
            props: { size },
            slots: { default: 'Value' },
        })
        const text = wrapper.find('text')

        expect(wrapper.classes()).toContain('plot-y-label')
        expect(wrapper.text()).toBe('Value')
        expect(text.attributes()).toMatchObject({ transform: 'translate(16, 40) rotate(-90)', 'text-anchor': 'middle' })
    })
})
