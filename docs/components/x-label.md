# XLabel

`XLabel` renders an x-axis title as a DOM element. When it receives `size` directly, or gets one from `TransformGroup`, it uses the shared plot-layer classes and is absolutely positioned over the plot container like the SVG layers. Without a size, it renders as a normal DOM element and participates in the surrounding layout.

## Import

```ts
import { XLabel } from '@putianyi888/vue3-plots'
```

## Example

```vue
<XLabel :size="{ width: 640, height: 360 }">
  Time
</XLabel>
```

<!-- @include: ../.generated/api/x-label.md -->

## Notes

The automatic absolute positioning is only a starting point. Because `XLabel` is regular DOM, you can omit `size` outside `TransformGroup` to place it in an external CSS grid or flex layout. See the [responsive ResizeObserver example](/examples#responsive-plot-with-resizeobserver), where `XLabel` participates in DOM layout and the SVG plot measures the remaining area.
