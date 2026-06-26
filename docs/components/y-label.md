# YLabel

`YLabel` renders a rotated y-axis title as a DOM layer. By default it uses the shared plot-layer classes, so it is absolutely positioned over the plot container like the SVG layers.

## Import

```ts
import { YLabel } from '@putianyi888/vue3-plots'
```

## Example

```vue
<YLabel :size="{ width: 640, height: 360 }">
  Value
</YLabel>
```

<!-- @include: ../.generated/api/y-label.md -->

## Notes

The default absolute positioning is only a starting point. Because `YLabel` is regular DOM, you can override its `position`, `width`, and `height` with a class or inline style and place it in an external CSS grid or flex layout. See the [responsive ResizeObserver example](/examples#responsive-plot-with-resizeobserver), where `YLabel` participates in DOM layout and the SVG plot measures the remaining area.
