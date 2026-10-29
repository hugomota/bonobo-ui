import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { OverlapGraph, TimeZoneBubble, TimeZoneCompare, type ZoneConfig } from '..'

const zones: ZoneConfig[] = [
  {
    id: 'lis',
    timeZone: 'Europe/Lisbon',
    label: 'Lisbon',
    start: 540,
    end: 1080,
    flex: 60,
    color: '#4a7dff',
  },
  {
    id: 'nyc',
    timeZone: 'America/New_York',
    label: 'New York',
    start: 540,
    end: 1020,
    flex: 60,
    color: '#ff9a3c',
  },
  {
    id: 'sao',
    timeZone: 'America/Sao_Paulo',
    label: 'São Paulo',
    start: 540,
    end: 1080,
    flex: 30,
    color: '#34c47c',
  },
  {
    id: 'tyo',
    timeZone: 'Asia/Tokyo',
    label: 'Tokyo',
    start: 540,
    end: 1080,
    flex: 120,
    color: '#8a5cf6',
  },
]

const meta = {
  title: 'Time zones/TimeZoneCompare',
  component: TimeZoneCompare,
  args: { zones, onZonesChange: fn(), onShare: fn() },
} satisfies Meta<typeof TimeZoneCompare>

export default meta
type Story = StoryObj<typeof meta>

function Live(args: Parameters<typeof TimeZoneCompare>[0]) {
  const [list, setList] = useState(args.zones)
  return (
    <div style={{ maxWidth: 640, paddingBottom: 80 }}>
      <TimeZoneCompare {...args} zones={list} onZonesChange={setList} />
    </div>
  )
}
/** Swipe the list sideways; long-press a zone to collapse it; tap to edit. */
export const WorldClock: Story = { render: (args) => <Live {...args} /> }

export const Bubbles: Story = {
  render: () => {
    const at = new Date()
    return (
      <div style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
        {zones.map((z) => (
          <TimeZoneBubble key={z.id} zone={z} at={at} detail={z.timeZone} />
        ))}
        <TimeZoneBubble zone={{ ...zones[0], collapsed: true }} at={at} />
      </div>
    )
  },
}

export const Graph: Story = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <OverlapGraph zones={zones.slice(0, 2)} at={new Date()} homeTimeZone="Europe/Lisbon" />
    </div>
  ),
}
