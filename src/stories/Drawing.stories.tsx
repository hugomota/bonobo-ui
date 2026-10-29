import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import {
  ColorSwatches,
  defaultTools,
  IconButton,
  Sketchpad,
  ToolPalette,
  type SketchpadHandle,
  type ToolKind,
} from '..'

const inks = ['#1e1c19', '#4a7dff', '#ff5d5d', '#34c47c', '#ffcc33', '#8a5cf6']

const meta = {
  title: 'Drawing/Sketchpad',
  component: Sketchpad,
  args: { tool: 'pen', color: '#1e1c19', size: 4, paper: 'dots' },
  argTypes: {
    tool: { control: 'inline-radio', options: ['pen', 'pencil', 'marker', 'brush', 'eraser'] },
    color: { control: 'color' },
    paper: { control: 'inline-radio', options: ['dots', 'lines', 'plain'] },
  },
} satisfies Meta<typeof Sketchpad>

export default meta
type Story = StoryObj<typeof meta>

export const Paper: Story = {}

function Notebook() {
  const pad = useRef<SketchpadHandle>(null)
  const [tool, setTool] = useState('pen')
  const [ink, setInk] = useState(inks[0])
  const kind = (defaultTools.find((t) => t.id === tool)?.kind ?? 'pen') as ToolKind
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 640 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton icon="undo" label="Undo" onClick={() => pad.current?.undo()} />
        <IconButton icon="trash" label="Clear" onClick={() => pad.current?.clear()} />
      </div>
      <Sketchpad ref={pad} tool={kind} color={ink} size={4} />
      <div>
        <ToolPalette value={tool} onChange={setTool} color={ink} />
        <div
          style={{ padding: 12, background: 'var(--bn-surface-2)', borderRadius: '0 0 22px 22px' }}
        >
          <ColorSwatches colors={inks} value={ink} onChange={setInk} size="sm" />
        </div>
      </div>
    </div>
  )
}
/** Tools tray + colours + paper together. */
export const NotebookPage: Story = { render: () => <Notebook /> }
