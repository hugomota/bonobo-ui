import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { AgendaDay, EventItem, MonthHeatmap, WeekStrip } from '..'

const today = new Date()
const counts = Object.fromEntries(Array.from({ length: 31 }, (_, i) => [i + 1, (i * 5) % 8]))

const meta = {
  title: 'Calendar/MonthHeatmap',
  component: MonthHeatmap,
  args: {
    year: today.getFullYear(),
    month: today.getMonth(),
    counts,
    locale: 'pt-PT',
    weekStartsOn: 1,
  },
} satisfies Meta<typeof MonthHeatmap>

export default meta
type Story = StoryObj<typeof meta>

function Selectable(args: Parameters<typeof MonthHeatmap>[0]) {
  const [selected, setSelected] = useState(today)
  return (
    <div style={{ maxWidth: 420 }}>
      <MonthHeatmap {...args} selected={selected} onSelect={setSelected} />
    </div>
  )
}
/** Darker days are busier. */
export const Heatmap: Story = { render: (args) => <Selectable {...args} /> }

function WeekDemo() {
  const [selected, setSelected] = useState(today)
  return (
    <div style={{ maxWidth: 480 }}>
      <WeekStrip
        date={selected}
        selected={selected}
        onSelect={setSelected}
        marked={(d) => d.getDate() % 3 !== 0}
        locale="pt-PT"
      />
    </div>
  )
}
export const Week: Story = { render: () => <WeekDemo /> }

export const Agenda: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <AgendaDay date={today} locale="pt-PT" aside="☀️ 19°">
        <EventItem
          time="08:30"
          until="09:00"
          title="Coffee with Rita"
          place="Café Central"
          color="#ff9a3c"
        />
        <EventItem
          time="10:00"
          until="11:30"
          title="Team meeting"
          color="#4a7dff"
          onClick={() => {}}
        />
        <EventItem time="18:30" title="Swimming" place="Municipal pool" color="#1fb8b0" />
      </AgendaDay>
      <AgendaDay
        date={new Date(today.getTime() + 86_400_000)}
        locale="pt-PT"
        emptyText="Free day"
      />
    </div>
  ),
}
