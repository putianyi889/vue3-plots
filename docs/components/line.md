# Line

`Line` renders finite data points as a connected SVG path. It preserves the input point order and scales point coordinates from the provided `domain`.

## Import

```ts
import { Line } from '@putianyi888/vue3-plots'
```

## Example

```vue
<Line
  :points="points"
  :domain="domain"
  :size="{ width: 640, height: 360 }"
  stroke-color="#2563eb"
  :stroke-width="2"
/>
```

<!-- @include: ../.generated/api/line.md -->

## Notes

`Line` renders nothing when no finite points remain after filtering.

## Large datasets

Enable `sampling="min-max"` for dense lines with monotonic x coordinates:

```vue
<Line :points="points" sampling="min-max" stroke-color="#2563eb" />
```

The sampler retains the first point, last point, minimum y and maximum y in
each occupied SVG pixel column, in input order. This preserves narrow peaks
and valleys while reducing the path to at most four points per column. It
supports increasing, decreasing and repeated x values. Curves whose x values
change direction automatically retain their full path.

Sampling is optional and defaults to `none`. It does not mutate the data or
change the domain. It omits other interior points, so it approximates the curve.
Changing `size`, `padding`, `domain` or the points recomputes the path.

The sampling grid uses SVG coordinate units from `size` and `viewBox`, rather
than device pixels. Points outside the domain are still rendered and their
columns also count toward the output size. Sampling still scans all points;
it does not guarantee smooth interaction for every million-point dataset.

For large arrays, use Vue's `shallowRef` and replace the array when updating
it to avoid deep reactivity overhead. See the [large line example](/examples#large-line)
and [Vue's performance guide](https://vuejs.org/guide/best-practices/performance.html#reduce-reactivity-overhead-for-large-immutable-structures).
