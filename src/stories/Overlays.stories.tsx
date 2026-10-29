import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Button, Sheet, TabBar, TextField, ToastProvider, useToast } from '..'

const meta = {
  title: 'Overlays/Sheet',
  component: Sheet,
  args: { open: false, title: 'New event', onClose: () => {}, children: null },
} satisfies Meta<typeof Sheet>

export default meta
type Story = StoryObj<typeof meta>

function SheetDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="New event"
        footer={<Button onClick={() => setOpen(false)}>Create</Button>}
      >
        <TextField variant="title" placeholder="Title" aria-label="Title" />
      </Sheet>
    </>
  )
}
export const BottomSheet: Story = { render: () => <SheetDemo /> }

function ToastButton() {
  const toast = useToast()
  return (
    <Button onClick={() => toast('Task deleted', { action: { label: 'Undo', onClick: () => {} } })}>
      Show toast
    </Button>
  )
}
export const Toast: Story = {
  render: () => (
    <ToastProvider>
      <ToastButton />
    </ToastProvider>
  ),
}

function Tabs() {
  const [tab, setTab] = useState('tasks')
  return (
    <TabBar
      value={tab}
      onChange={setTab}
      items={[
        { id: 'tasks', label: 'Tasks', icon: 'list' },
        { id: 'calendar', label: 'Calendar', icon: 'calendar' },
        { id: 'draw', label: 'Draw', icon: 'pen' },
        { id: 'zones', label: 'Zones', icon: 'globe' },
      ]}
    />
  )
}
export const TabBarStory: Story = { name: 'Tab bar', render: () => <Tabs /> }
