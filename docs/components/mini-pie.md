# MiniPie

`MiniPie` renders a small inline SVG pie chart. Unlike plot layers, it behaves like a regular DOM element: pass `class`, `style`, or other SVG attributes to tune its size, alignment, and surrounding layout.

## Import

```ts
import { MiniPie } from '@putianyi888/vue3-plots'
```

## Example

```vue
<MiniPie
  class="summary-icon"
  :data="[
    { value: 2, color: '#2563eb' },
    { value: 1, color: '#dc2626' },
  ]"
  :radius="8"
  style="width: 1rem; vertical-align: middle;"
/>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `Array<{ value: number; color: string }>` | Required | Pie segments in drawing order. Non-positive and non-finite values are skipped. |
| `radius` | `number` | `8` | Circle radius in SVG units. Also controls the intrinsic SVG width and height. |
| `total` | `number` | Sum of positive finite values | Total value used to normalize segment angles. |
| `startAngle` | `number` | `0` | Start angle in degrees. Zero degrees points right, and positive values rotate clockwise in SVG coordinates. |

## Notes

Use CSS when you want the rendered element to occupy a different layout size than its intrinsic SVG size.
