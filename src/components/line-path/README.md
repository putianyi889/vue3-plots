# Line path generation and sampling

`Line` defaults to a full-resolution path. Both modes skip points with any
non-finite coordinate, connect the remaining points
in input order, and leave the source array untouched.

## Existing solutions investigated

- [Chart.js Min/Max decimation](https://www.chartjs.org/docs/latest/configuration/decimation.html)
  retains peaks with up to four points per pixel. Its
  [implementation](https://github.com/chartjs/Chart.js/blob/master/src/plugins/plugin.decimation.js)
  is an internal chart plugin, coupled to Chart.js scales and mutable datasets,
  rather than a standalone sampler. We use the same established Min/Max strategy
  in a small streaming adapter for this library's scales and SVG path output.
  The adapter keeps original x coordinates and emits selected points in input order.
- LTTB is intended to preserve trends with a fixed sample count, but does not
  guarantee that each column's minimum and maximum survive. It does not meet the
  peak-preservation requirement as directly as Min/Max.
- [Simplify.js](https://mourner.github.io/simplify-js/) supports general 2D paths
  using radial-distance and Douglas–Peucker simplification. Its
  [recursive Douglas–Peucker implementation](https://github.com/mourner/simplify-js/blob/master/simplify.js)
  can have deep recursion on adversarial input, and its tolerance can discard
  local extrema. We do not use it for the million-point peak-preserving mode.

## Contract and limits

`sampling="min-max"` groups consecutive finite points by
`Math.floor(scaleX(point.x))`. Each column retains its first point, last point,
minimum y and maximum y, without duplicates. This is an approximation: interior
points other than these representatives can be omitted.

The scan accepts increasing, decreasing and constant x coordinates. If x changes
direction, it falls back to the full path so loops are not silently simplified.
Axis flips, repeated x values and non-finite-point filtering retain their meaning.

Sampling takes O(n) time and O(k) output space, where k is the number of occupied
SVG pixel columns. It allocates no intermediate million-element coordinate array.
Points outside the domain are not clipped; their columns also contribute to k.
Resizing or changing the domain recomputes the path at the new scale.

One pixel here means one SVG coordinate unit, determined by `size` and `viewBox`.
External CSS scaling and device pixel ratio do not change the sampling grid.

Large source arrays should normally live in `shallowRef`, with updates made by
replacing the array, as recommended in the
[Vue performance guide](https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures).
Sampling does not eliminate the O(n) scan or guarantee a browser frame rate.
