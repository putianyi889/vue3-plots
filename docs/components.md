# Components

Vue3 Plots exposes small visual components for building charts. SVG plot layers can be stacked inside the same relatively positioned container; components that render data in that coordinate system should receive the same `size`, `padding`, and `domain` values so their coordinates align. Use `TransformGroup` to provide those values once to the layers inside it.

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

- [Axis](components/axis.md)
- [TransformGroup](components/transform-group.md)
- [Grid](components/grid.md)
- [ImageGrid](components/image-grid.md)
- [Line](components/line.md)
- [Bar](components/bar.md)
- [Scatter](components/scatter.md)
- [Pie](components/pie.md)
- [MiniPie](components/mini-pie.md)
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
4. `Axis`
5. `XLabel` and `YLabel`

`MouseDraw` is interactive and usually goes above visual layers when selection or annotation drawing is enabled.
