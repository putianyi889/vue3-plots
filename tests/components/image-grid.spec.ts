import { mount } from '@vue/test-utils'
import { nextTick, ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ImageGrid from '../../src/components/ImageGrid.vue'

const context = {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
}
const tileContext = {
    clearRect: vi.fn(),
    drawImage: vi.fn(),
}
let getContext: ReturnType<typeof vi.spyOn>

class TestImage {
    static instances: TestImage[] = []

    complete = false
    naturalWidth = 0
    private loadListener?: () => void

    constructor() {
        TestImage.instances.push(this)
    }

    addEventListener(event: string, listener: () => void) {
        if (event === 'load') {
            this.loadListener = listener
        }
    }

    set src(_value: string) {}

    load() {
        this.complete = true
        this.naturalWidth = 1
        this.loadListener?.()
    }
}

afterEach(() => {
    getContext?.mockRestore()
    TestImage.instances = []
    vi.unstubAllGlobals()
    vi.clearAllMocks()
})

describe('ImageGrid', () => {
    it('renders a plain canvas sized from cells and cell dimensions', () => {
        getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

        const wrapper = mount(ImageGrid, {
            props: {
                cells: [['a', 'b'], ['a']],
                images: { a: '/a.png', b: '/b.png' },
                cellWidth: 12,
                cellHeight: 8,
            },
        })

        expect(wrapper.element.tagName).toBe('CANVAS')
        expect(wrapper.attributes()).toMatchObject({ width: '24', height: '16' })
        expect(wrapper.classes()).toEqual([])
        expect(wrapper.attributes('style')).toBeUndefined()
    })

    it('draws images by grid cell', async () => {
        mockCanvasContexts()
        vi.stubGlobal('Image', TestImage)

        mount(ImageGrid, {
            props: {
                cells: [['a', 'b'], ['missing', 'a']],
                images: { a: '/a.png', b: '/b.png' },
                cellWidth: 10,
                cellHeight: 20,
            },
        })

        TestImage.instances.forEach((image) => image.load())
        await Promise.resolve()

        expect(context.clearRect).toHaveBeenCalledWith(0, 0, 20, 40)
        expect(tileContext.drawImage).toHaveBeenCalledTimes(2)
        expect(tileContext.drawImage).toHaveBeenCalledWith(expect.any(TestImage), 0, 0, 10, 20)
        expect(context.drawImage).toHaveBeenCalledTimes(3)
        expect(context.drawImage).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 0, 0)
        expect(context.drawImage).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 10, 0)
        expect(context.drawImage).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 10, 20)
    })

    it('redraws only the changed cell when a cell value changes in place', async () => {
        mockCanvasContexts()
        vi.stubGlobal('Image', TestImage)
        const cells = ref([['a']])
        mount(ImageGrid, {
            props: {
                cells: cells.value,
                images: { a: '/a.png', b: '/b.png' },
                cellWidth: 10,
                cellHeight: 20,
            },
        })

        TestImage.instances.forEach((image) => image.load())
        await Promise.resolve()
        vi.clearAllMocks()

        cells.value[0][0] = 'b'
        await nextTick()
        TestImage.instances.forEach((image) => image.load())
        await Promise.resolve()

        expect(context.clearRect).toHaveBeenCalledTimes(1)
        expect(context.clearRect).toHaveBeenCalledWith(0, 0, 10, 20)
        expect(context.drawImage).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 0, 0)
    })

    it('uses changed cell coordinates for partial redraws', async () => {
        mockCanvasContexts()
        vi.stubGlobal('Image', TestImage)
        const cells = ref([['a', 'a']])
        mount(ImageGrid, {
            props: {
                cells: cells.value,
                images: { a: '/a.png', b: '/b.png' },
                cellWidth: 10,
                cellHeight: 20,
            },
        })

        TestImage.instances.forEach((image) => image.load())
        await Promise.resolve()
        vi.clearAllMocks()

        cells.value[0][1] = 'b'
        await nextTick()
        TestImage.instances.forEach((image) => image.load())
        await Promise.resolve()

        expect(context.clearRect).toHaveBeenCalledWith(10, 0, 10, 20)
        expect(context.drawImage).toHaveBeenCalledWith(expect.any(HTMLCanvasElement), 10, 0)
    })

    it('exposes the cell index under the mouse', async () => {
        getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
        const wrapper = mount(ImageGrid, {
            props: {
                cells: [['a', 'b'], ['c', 'd']],
                images: { a: '/a.png', b: '/b.png', c: '/c.png', d: '/d.png' },
                cellWidth: 10,
                cellHeight: 20,
            },
        })
        const canvas = wrapper.find('canvas')

        vi.spyOn(canvas.element, 'getBoundingClientRect').mockReturnValue({
            bottom: 40,
            height: 40,
            left: 0,
            right: 20,
            top: 0,
            width: 20,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        })

        await canvas.trigger('mousemove', { clientX: 15, clientY: 25 })

        expect(wrapper.vm.cellIndex).toEqual({ rowIndex: 1, columnIndex: 1 })

        await canvas.trigger('mouseleave')

        expect(wrapper.vm.cellIndex).toBeUndefined()
    })

    it('keeps the same exposed cell index object while the mouse stays in one cell', async () => {
        getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
        const wrapper = mount(ImageGrid, {
            props: {
                cells: [['a', 'b']],
                images: { a: '/a.png', b: '/b.png' },
                cellWidth: 10,
                cellHeight: 20,
            },
        })
        const canvas = wrapper.find('canvas')

        vi.spyOn(canvas.element, 'getBoundingClientRect').mockReturnValue({
            bottom: 20,
            height: 20,
            left: 0,
            right: 20,
            top: 0,
            width: 20,
            x: 0,
            y: 0,
            toJSON: () => ({}),
        })

        await canvas.trigger('mousemove', { clientX: 2, clientY: 2 })
        const firstIndex = wrapper.vm.cellIndex

        await canvas.trigger('mousemove', { clientX: 8, clientY: 18 })

        expect(wrapper.vm.cellIndex).toBe(firstIndex)
    })
})

function mockCanvasContexts() {
    getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function getContextMock(this: HTMLCanvasElement) {
        return (this.parentElement === null ? tileContext : context) as unknown as CanvasRenderingContext2D
    })
}
