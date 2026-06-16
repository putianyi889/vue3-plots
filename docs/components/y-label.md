# YLabel

`YLabel` renders a rotated y-axis title as an absolutely positioned SVG layer. Place it inside the same relatively positioned plot container as the other layers.

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

## Props


<!-- @include-props y-label -->

## Slots

| Slot | Props | Description |
| --- | --- | --- |
| `default` | None | Label content. |
