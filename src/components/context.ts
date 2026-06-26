import { computed, inject, provide } from 'vue'
import type { ComputedRef, InjectionKey } from 'vue'

import { defaultPlotPadding } from './utils'
import type { PlotDomain, PlotPadding, PlotSize } from './utils'

type PlotContext = {
    domain: ComputedRef<PlotDomain>
    padding: ComputedRef<PlotPadding>
    size: ComputedRef<PlotSize>
}

type OptionalPlotContextProps = {
    domain?: PlotDomain
    padding?: PlotPadding
    size?: PlotSize
}

const defaultPlotSize: PlotSize = { width: 320, height: 200 }
const plotContextKey: InjectionKey<PlotContext> = Symbol('vue3-plots-context')

export function providePlotContext(props: Required<OptionalPlotContextProps>) {
    provide(plotContextKey, {
        domain: computed(() => props.domain),
        padding: computed(() => props.padding),
        size: computed(() => props.size),
    })
}

export function usePlotContext(props: OptionalPlotContextProps) {
    const context = inject(plotContextKey, undefined)
    const domain = computed(() => {
        const value = props.domain ?? context?.domain.value

        if (value === undefined) {
            throw new Error('Plot domain is required. Pass a domain prop or wrap the component in TransformGroup.')
        }

        return value
    })
    const size = computed(() => props.size ?? context?.size.value ?? defaultPlotSize)
    const padding = computed(() => props.padding ?? context?.padding.value ?? defaultPlotPadding)

    return { domain, padding, size }
}

export function usePlotSize(props: { size?: PlotSize }) {
    const context = inject(plotContextKey, undefined)

    return computed(() => props.size ?? context?.size.value ?? defaultPlotSize)
}

export function useOptionalPlotSize(props: { size?: PlotSize }) {
    const context = inject(plotContextKey, undefined)

    return computed(() => props.size ?? context?.size.value)
}

export function usePlotFrame(props: { padding?: PlotPadding, size?: PlotSize }) {
    const context = inject(plotContextKey, undefined)
    const size = computed(() => props.size ?? context?.size.value ?? defaultPlotSize)
    const padding = computed(() => props.padding ?? context?.padding.value ?? defaultPlotPadding)

    return { padding, size }
}
