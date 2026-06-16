# Geometry

Geometry exports model shapes emitted by `MouseDraw` and provide point containment checks for selection workflows.

The detailed API pages are generated from JSDoc in `src/components/geometry.ts`. Use this page as a map to the generated reference.

## Types

| Export | Description |
| --- | --- |
| [`Point`](/api/geometry/interfaces/Point) | Coordinate pair: `{ x, y }`. |
| [`ShapeType`](/api/geometry/type-aliases/ShapeType) | Shape discriminator union: `'rect' \| 'ellipse' \| 'polygon'`. |
| [`AnyShape`](/api/geometry/type-aliases/AnyShape) | Union of `Rect \| Ellipse \| Polygon`. |

## Classes

| Export | Description |
| --- | --- |
| [`Shape<TType>`](/api/geometry/classes/Shape) | Abstract base class implemented by all geometry classes. |
| [`Rect`](/api/geometry/classes/Rect) | Axis-aligned rectangle. |
| [`Ellipse`](/api/geometry/classes/Ellipse) | Axis-aligned ellipse. |
| [`Polygon`](/api/geometry/classes/Polygon) | Polygon defined by ordered vertices. |

## Selection Workflow

Use the `type` discriminator to narrow emitted shapes.

```ts
function handleShape(shape: AnyShape) {
  if (shape.type === 'rect') {
    console.log(shape.width)
  }
}
```

All built-in shapes expose `contains(point)`. Boundary points are included for rectangles, ellipses, and polygons. Ellipses with non-positive radii reject all points, and polygons with fewer than three vertices reject all points.

## Recommended Companion Packages

The built-in geometry classes are intentionally lightweight: they model selection shapes and answer simple containment questions. For robust computational geometry, spatial indexing, or geospatial workflows, use a specialized package and convert results to `Rect`, `Ellipse`, `Polygon`, or your own application shape type at the boundary.

| Package | Use it for | Notes |
| --- | --- | --- |
| [`polygon-clipping`](https://github.com/mfogel/polygon-clipping) | Polygon union, intersection, difference, and xor. | Use for boolean operations on polygons and multipolygons. |
| [`geometric`](https://github.com/HarryStevens/geometric) | Lightweight point, line, polygon, and angle utilities. | Good when you want plain JavaScript array geometry primitives with TypeScript declarations. |
| [`@turf/turf`](https://turfjs.org/) or individual Turf modules | Geospatial analysis with GeoJSON. | Best when coordinates represent geographic data rather than plain SVG/data-space geometry. |
| [`rbush`](https://github.com/mourner/rbush) | Fast 2D spatial indexing for points and rectangles. | Useful when hit-testing many shapes or filtering candidates before exact `contains` checks. |
| [`d3-delaunay`](https://github.com/d3/d3-delaunay) | Delaunay triangulation, Voronoi diagrams, and nearest-point lookup. | Useful for nearest-neighbor interactions on scatter plots. |
| [`d3-polygon`](https://d3js.org/d3-polygon) | Polygon area, centroid, hull, length, and containment helpers. | Good for lightweight planar polygon math in the D3 ecosystem. |

Prefer these libraries when correctness around self-intersections, holes, topology, projections, or large shape sets matters.
