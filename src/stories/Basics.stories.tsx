import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import {
  Button,
  Card,
  Checkbox,
  DisplayNumber,
  EmptyState,
  Eyebrow,
  Fab,
  Icon,
  IconButton,
  iconNames,
  SegmentedControl,
  Switch,
  Tag,
  TextField,
  Title,
} from '..'

const meta = {
  title: 'Basics/Button',
  component: Button,
  args: { children: 'Add', variant: 'solid', size: 'md', onClick: fn() },
  argTypes: { icon: { control: 'select', options: [undefined, ...iconNames] } },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Solid: Story = { args: { icon: 'plus' } }
export const Soft: Story = { args: { variant: 'soft', children: 'Cancel' } }
export const Ghost: Story = { args: { variant: 'ghost', children: 'Later' } }
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
      <Button {...args} size="sm" />
      <Button {...args} size="md" />
      <Button {...args} size="lg" />
    </div>
  ),
}
export const IconButtons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <IconButton icon="more" label="More" />
      <IconButton icon="share" label="Share" variant="soft" />
      <IconButton icon="trash" label="Delete" variant="solid" />
      <Fab label="New" onClick={fn()} />
    </div>
  ),
}
export const Icons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
        gap: 16,
      }}
    >
      {iconNames.map((n) => (
        <div key={n} style={{ display: 'grid', justifyItems: 'center', gap: 6, fontSize: 12 }}>
          <Icon name={n} size={28} />
          {n}
        </div>
      ))}
    </div>
  ),
}

function ChoicesDemo() {
  const [check, setCheck] = useState(true)
  const [on, setOn] = useState(false)
  const [view, setView] = useState<'day' | 'week' | 'month'>('week')
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <Checkbox checked={check} onChange={setCheck} label="Round check" />
      <Checkbox
        checked={!check}
        onChange={(c) => setCheck(!c)}
        color="#ff6fb1"
        label="List colour"
      />
      <Switch checked={on} onChange={setOn} label="Notifications" />
      <SegmentedControl
        label="View"
        value={view}
        onChange={setView}
        options={[
          { value: 'day', label: 'Day' },
          { value: 'week', label: 'Week' },
          { value: 'month', label: 'Month' },
        ]}
      />
    </div>
  )
}
export const Choices: Story = { render: () => <ChoicesDemo /> }

export const Fields: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 420 }}>
      <TextField label="Name" placeholder="Ana" hint="How you want to be called." />
      <TextField variant="title" placeholder="New task…" aria-label="New task" />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <Tag color="#ff9a3c">Home</Tag>
        <Tag color="#ff5d5d" onRemove={fn()}>
          Urgent
        </Tag>
        <Tag>No colour</Tag>
      </div>
    </div>
  ),
}

export const Typography: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <div>
        <Eyebrow>Thursday</Eyebrow>
        <Title as="h1" size="xl">
          October
        </Title>
      </div>
      <DisplayNumber>29</DisplayNumber>
      <Card>
        <Title size="md">Flat card</Title>
      </Card>
      <Card variant="raised">
        <Title size="md">Raised card</Title>
      </Card>
      <EmptyState title="All done!" action={<Button>Add a task</Button>}>
        Nothing left in this list.
      </EmptyState>
    </div>
  ),
}
