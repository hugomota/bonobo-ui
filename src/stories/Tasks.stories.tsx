import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { ListTile, ProgressRing, Tag, TaskRow } from '..'

const meta = {
  title: 'Tasks/TaskRow',
  component: TaskRow,
  args: {
    title: 'Water the plants',
    note: 'The ones on the balcony',
    done: false,
    color: '#34c47c',
    meta: 'Today',
    onToggle: fn(),
    onDelete: fn(),
  },
  argTypes: { color: { control: 'color' } },
} satisfies Meta<typeof TaskRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Done: Story = { args: { done: true } }
export const WithTags: Story = {
  args: {
    children: (
      <>
        <Tag color="#34c47c">Garden</Tag>
        <Tag color="#ff6fb1">Family</Tag>
      </>
    ),
  },
}

function ListDemo() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Book the car service', done: false },
    { id: 2, title: 'Call grandma', done: true },
    { id: 3, title: 'Change the kitchen bulb', done: false },
  ])
  const done = tasks.filter((t) => t.done).length
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <ProgressRing value={tasks.length ? done / tasks.length : 0} color="#4a7dff" />
      <div style={{ display: 'grid', gap: 2 }}>
        {tasks.map((t) => (
          <TaskRow
            key={t.id}
            title={t.title}
            done={t.done}
            color="#4a7dff"
            onToggle={(d) =>
              setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done: d } : x)))
            }
            onDelete={() => setTasks((all) => all.filter((x) => x.id !== t.id))}
          />
        ))}
      </div>
    </div>
  )
}
/** Swipe right to tick, left to delete (or hover for the trash button). */
export const SwipeList: Story = { render: () => <ListDemo /> }

export const ListTiles: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 12,
      }}
    >
      <ListTile title="Home" color="#ff9a3c" icon="inbox" count={4} />
      <ListTile title="Work" color="#4a7dff" icon="flag" count={12} />
      <ListTile title="Shopping" color="#34c47c" icon="star" count={2} />
      <ListTile title="Ideas" color="#8a5cf6" icon="book" count={7} />
    </div>
  ),
}

export const Progress: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <ProgressRing value={0.25} />
      <ProgressRing value={0.6} color="#34c47c" size={88} thickness={8} />
      <ProgressRing value={1} color="#8a5cf6">
        ✓
      </ProgressRing>
    </div>
  ),
}
