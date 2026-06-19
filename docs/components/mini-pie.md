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
  stroke-color="#ffffff"
  :stroke-width="1"
  style="width: 1rem; vertical-align: middle;"
/>
```

<!-- @include: ../.generated/api/mini-pie.md -->

## Notes

Use CSS when you want the rendered element to occupy a different layout size than its intrinsic SVG size.

`MiniPie` does not validate radius values. Pass a positive finite `radius`; invalid SVG radius values are passed through to the generated path data and may not render.
