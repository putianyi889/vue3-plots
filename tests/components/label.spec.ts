import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import XLabel from '../../src/components/XLabel.vue'
import YLabel from '../../src/components/YLabel.vue'
import TransformGroup from '../../src/components/TransformGroup.vue'
import { domain, padding, size } from './helpers'

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

    it('renders as a normal DOM element when no size is available', () => {
        const wrapper = mount(XLabel, {
            slots: { default: 'Sample' },
        })

        expect(wrapper.classes()).toContain('plot-x-label')
        expect(wrapper.classes()).not.toContain('plot-layer')
        expect(wrapper.classes()).not.toContain('plot-layer--passive')
        expect(wrapper.attributes('style')).toBeUndefined()
        expect(wrapper.text()).toBe('Sample')
    })

    it('uses TransformGroup size when available', () => {
        const wrapper = mount(TransformGroup, {
            props: { domain, padding, size },
            slots: {
                default: '<XLabel>Sample</XLabel>',
            },
            global: {
                components: { XLabel },
            },
        })
        const label = wrapper.find('.plot-x-label')

        expect(label.classes()).toContain('plot-layer')
        expect(label.attributes('style')).toContain('height: 80px')
        expect(label.attributes('style')).toContain('width: 100px')
        expect(label.text()).toBe('Sample')
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

    it('renders as a normal DOM element when no size is available', () => {
        const wrapper = mount(YLabel, {
            slots: { default: 'Value' },
        })

        expect(wrapper.classes()).toContain('plot-y-label')
        expect(wrapper.classes()).not.toContain('plot-layer')
        expect(wrapper.classes()).not.toContain('plot-layer--passive')
        expect(wrapper.attributes('style')).toBeUndefined()
        expect(wrapper.text()).toBe('Value')
    })
})
