import type { ToolKind } from './ToolGlyph'

export interface Tool {
  id: string
  kind: ToolKind
  label: string
}

export const defaultTools: Tool[] = [
  { id: 'pen', kind: 'pen', label: 'Pen' },
  { id: 'pencil', kind: 'pencil', label: 'Pencil' },
  { id: 'marker', kind: 'marker', label: 'Marker' },
  { id: 'brush', kind: 'brush', label: 'Brush' },
  { id: 'eraser', kind: 'eraser', label: 'Eraser' },
]
