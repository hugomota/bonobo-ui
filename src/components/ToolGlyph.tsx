export type ToolKind = 'pen' | 'pencil' | 'marker' | 'brush' | 'eraser'

export interface ToolGlyphProps {
  kind: ToolKind
  /** Ink colour (tip and band). */
  color: string
}

/** A drawing tool seen from the side, tip up. 40 × 120 viewBox. */
export function ToolGlyph({ kind, color }: ToolGlyphProps) {
  return (
    <svg viewBox="0 0 40 120" className="bn-toolglyph" aria-hidden="true">
      {kind === 'pen' && (
        <>
          <rect className="bn-toolglyph__body" x="9" y="36" width="22" height="90" rx="5" />
          <path className="bn-toolglyph__metal" d="M9 37 L20 8 L31 37 Z" />
          <path d="M16.5 17 L20 8 L23.5 17 Z" fill={color} />
          <rect x="9" y="44" width="22" height="5" fill={color} />
        </>
      )}
      {kind === 'pencil' && (
        <>
          <rect className="bn-toolglyph__body" x="9" y="36" width="22" height="90" rx="2" />
          <path d="M9 37 L20 6 L31 37 Z" fill="#e9c995" />
          <path d="M15.6 18.5 L20 6 L24.4 18.5 Z" fill={color} />
          <rect x="9" y="36" width="22" height="3" fill={color} opacity="0.9" />
        </>
      )}
      {kind === 'marker' && (
        <>
          <rect className="bn-toolglyph__body" x="6" y="40" width="28" height="86" rx="6" />
          <path className="bn-toolglyph__metal" d="M10 41 L13 22 H27 L30 41 Z" />
          <path d="M14 22 L16 10 H26 L26 22 Z" fill={color} />
          <rect x="6" y="50" width="28" height="7" fill={color} />
        </>
      )}
      {kind === 'brush' && (
        <>
          <rect className="bn-toolglyph__body" x="12" y="44" width="16" height="82" rx="8" />
          <rect className="bn-toolglyph__metal" x="11" y="28" width="18" height="18" rx="2" />
          <path d="M11 29 C11 18 16 10 20 4 C24 10 29 18 29 29 Z" fill={color} />
        </>
      )}
      {kind === 'eraser' && (
        <>
          <rect className="bn-toolglyph__body" x="7" y="36" width="26" height="90" rx="5" />
          <rect x="7" y="12" width="26" height="30" rx="7" fill="#f6b8c4" />
          <rect className="bn-toolglyph__metal" x="7" y="34" width="26" height="8" />
        </>
      )}
    </svg>
  )
}
