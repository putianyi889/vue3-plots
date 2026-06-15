export const domain = { xMin: 0, xMax: 10, yMin: 0, yMax: 10 }
export const size = { width: 100, height: 80 }
export const padding = { top: 10, right: 20, bottom: 30, left: 40 }

export function mockSvgBounds(element: Element, width = 100, height = 80) {
    element.getBoundingClientRect = () => ({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: width,
        bottom: height,
        width,
        height,
        toJSON: () => ({}),
    })
}
