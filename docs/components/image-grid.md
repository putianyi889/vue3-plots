<script setup>
import ImageGridMinimal from '../../examples/ImageGridMinimal.vue'
</script>

# ImageGrid

`ImageGrid` renders a rectangular grid of images with canvas. It is intended for large grids where creating one DOM or SVG node per cell would be too expensive.

The component is a plain DOM canvas and does not add default classes or styles.

## Import

```ts
import { ImageGrid } from '@putianyi888/vue3-plots'
```

## Example

<ImageGridMinimal />

<<< ../../examples/ImageGridMinimal.vue

<!-- @include: ../.generated/api/image-grid.md -->

## Notes

`cells` is a two-dimensional array of image keys. `images` maps those keys to image URLs. Missing keys are skipped.

If the grid is small, a regular CSS grid with `<img>` elements is usually simpler and more flexible. Use `ImageGrid` when the grid is large enough that many DOM nodes become expensive.

Images are pre-rendered to offscreen canvases using `cell-width` and `cell-height`, then copied into the visible canvas for each matching cell.

`ImageGrid` deep-watches `cells`, so changing a key inside the two-dimensional array triggers a redraw.

Use a template ref to read the exposed `cellIndex`, which contains the current mouse position as `{ rowIndex, columnIndex }`. It is `undefined` when the mouse is outside a valid cell.
