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
        expect(wrapper.classes()).toContain('plot-x-label')
        expect(wrapper.attributes('style')).toContain('height: 80px')
        expect(wrapper.attributes('style')).toContain('width: 100px')
        expect(wrapper.text()).toBe('Sample')
    })
})

describe('YLabel', () => {
    it('renders default slot content centered and rotated', () => {
        const wrapper = mount(YLabel, {
            props: { size },
            slots: { default: 'Value' },
        })
        expect(wrapper.classes()).toContain('plot-y-label')
        expect(wrapper.attributes('style')).toContain('height: 80px')
        expect(wrapper.attributes('style')).toContain('width: 100px')
        expect(wrapper.text()).toBe('Value')
    })
})
