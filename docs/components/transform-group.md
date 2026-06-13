# TransformGroup

`TransformGroup` provides a shared `domain`, `size`, and `padding` to plot components in its default slot.

## Import

```ts
import { TransformGroup } from '@putianyi888/vue3-plots'
```

## Example

```vue
<TransformGroup :domain="domain" :size="{ width: 640, height: 360 }">
  <Grid :x-ticks="xTicks" :y-ticks="yTicks" />
  <Line :points="points" />
  <Scatter :points="points" />
  <XAxis :ticks="xTicks" />
  <YAxis :ticks="yTicks" />
</TransformGroup>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `domain` | `PlotDomain` | Required | Data-space bounds provided to child plot layers. |
| `size` | `PlotSize` | `{ width: 320, height: 200 }` | Outer SVG size provided to child plot layers. |
| `padding` | `PlotPadding` | `defaultPlotPadding` | Insets provided to child plot layers. |

## Notes

Child components can still pass their own `domain`, `size`, or `padding` props. Explicit child props override the values from `TransformGroup`.
