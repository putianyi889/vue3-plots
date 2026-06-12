# XLabel

`XLabel` renders an x-axis title as an absolutely positioned SVG layer. Place it inside the same relatively positioned plot container as the other layers.

## Import

```ts
import { XLabel } from 'vue3-plots'
```

## Example

```vue
<XLabel :size="{ width: 640, height: 360 }">
  Time
</XLabel>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `PlotSize` | Required | Outer SVG size in pixels. |

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | None | Label content. |
