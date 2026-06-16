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

## Props


<!-- @include-props line -->

## Notes

`Line` renders nothing when no finite points remain after filtering.
