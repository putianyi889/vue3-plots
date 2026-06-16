# Grid

`Grid` renders vertical and horizontal SVG grid lines aligned to a plot domain. It is an absolutely positioned layer intended to sit below data layers.

## Import

```ts
import { Grid } from '@putianyi888/vue3-plots'
```

## Example

```vue
<Grid
  :domain="domain"
  :size="{ width: 640, height: 360 }"
  :x-ticks="xTicks"
  :y-ticks="yTicks"
  stroke-color="#e4e4e7"
  dash-array="4 4"
/>
```

## Props


<!-- @include-props grid -->

## Notes

`Grid` does not render text or axis labels. Use `XLabel` and `YLabel` for axis titles.
