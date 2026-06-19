import type { AnnularSector } from './geometry'

/**
 * Data item rendered as one `Pie` or `MiniPie` slice.
 */
export type PieDatum = {
    /** Slice value used to calculate its sweep angle. */
    value: number
    /** Slice fill color. */
    color: string
}

/**
 * Event payload emitted by interactive `Pie` slices.
 */
export type PiePiece = {
    /** Slice index in the original `data` array. */
    index: number
    /** Source slice datum. */
    data: PieDatum
    /** Generated sector geometry for the slice. */
    sector: AnnularSector
}
