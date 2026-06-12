# Components

Vue3 Plots exposes small SVG layers that can be stacked inside the same relatively positioned container. Components that render data should receive the same `size`, `padding`, and `domain` values so their coordinates align.

Shared data types are exported from the package:

```ts
type PlotPoint<T = unknown> = { x: number; y: number; data?: T }
interface PlotDomain { xMin: number; xMax: number; yMin: number; yMax: number }
interface PlotSize { width: number; height: number }
interface PlotPadding { top: number; right: number; bottom: number; left: number }
type MaybeArray<T> = T | T[]
type Scale = (value: number) => number
type AnyShape = Rect | Ellipse | Polygon
```

## Component Docs

- [Axes](components/axes.md)
- [Grid](components/grid.md)
- [Line](components/line.md)
- [Scatter](components/scatter.md)
- [MouseDraw](components/mouse-draw.md)
- [XLabel](components/x-label.md)
- [YLabel](components/y-label.md)

## API Docs

- [Utilities](utils.md)
- [Geometry](geometry.md)

## Layer Order

A common static chart order is:

1. `Grid`
2. `Line` or other data layers
3. `Scatter`
4. `Axes`
5. `XLabel` and `YLabel`

`MouseDraw` is interactive and usually goes above visual layers when selection or annotation drawing is enabled.
