# TransformGroup

`TransformGroup` provides a shared `domain`, `size`, and `padding` to plot components in its default slot.

## Import

```ts
import { TransformGroup } from '@putianyi888/vue3-plots'
```

## Example

```vue
<TransformGroup ref="transformGroup" :domain="domain" :size="{ width: 640, height: 360 }">
  <Grid :x-ticks="xTicks" :y-ticks="yTicks" />
  <Line :points="points" />
  <Scatter :points="points" />
  <XAxis :ticks="xTicks" />
  <YAxis :ticks="yTicks" />
</TransformGroup>
```

<!-- @include: ../.generated/api/transform-group.md -->

## Notes

Child components can still pass their own `domain`, `size`, or `padding` props. Explicit child props override the values from `TransformGroup`.

Use a template ref to access the exposed `scaleX` and `scaleY` functions when custom code needs the same coordinate transform as the plot layers.
