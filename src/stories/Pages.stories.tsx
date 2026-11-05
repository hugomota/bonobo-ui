import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  ButtonLink,
  Card,
  ChipBar,
  Gallery,
  PageHeader,
  SectionTitle,
  SelectField,
  Sheet,
  Tabs,
  TextArea,
  TextField,
  tones,
  TopBar,
  WeatherIcon,
} from '..'

// Pieces for whole pages: top bar, page header, tabs, chips, notices,
// badges, forms, galleries. Placeholder content only.

const meta = {
  title: 'Pages/TopBar',
  component: TopBar,
  args: {
    label: 'Sections',
    brand: {
      href: '#',
      logo: <Logo />,
      name: 'studio',
      label: 'Studio: home',
    },
    items: [
      { href: '#a', label: 'Today', icon: '☀️', tone: 'green', current: true },
      { href: '#b', label: 'Notes', icon: '📝', tone: 'blue' },
      { href: '#c', label: 'Places', icon: '📍', tone: 'orange' },
      { href: '#d', label: 'Inbox', icon: '💬', tone: 'violet' },
    ],
  },
} satisfies Meta<typeof TopBar>

export default meta
type Story = StoryObj<typeof meta>

function Logo() {
  return (
    <svg viewBox="0 0 64 64" width="48" height="48" aria-hidden="true">
      <rect width="64" height="64" rx="15" fill="#1e1c19" />
      <circle cx="20" cy="20" r="10" fill="#34c47c" />
      <path d="M34 30V10a20 20 0 0 1 20 20z" fill="#4a7dff" />
      <rect x="10" y="34" width="20" height="20" rx="6" fill="#ffb21f" />
      <path d="M34 34h20a20 20 0 0 1-20 20z" fill="#ff5a3c" />
    </svg>
  )
}

export const Bar: Story = {}

export const WithBackButton: Story = {
  args: {
    back: (
      <Button variant="outline" size="lg">
        ‹ Back
      </Button>
    ),
  },
}

export const PageHeaders: Story = {
  render: () => (
    <div>
      <PageHeader
        title="Notes"
        sub="12 notes · updated 5 min ago"
        actions={<Button tone="blue">New note</Button>}
      />
      <SectionTitle>Pinned</SectionTitle>
      <Card>A flat card under a section title.</Card>
    </div>
  ),
}

export const Cards: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, 220px)' }}>
      <Card>flat</Card>
      <Card variant="paper">paper</Card>
      <Card variant="outline">outline</Card>
      <Card variant="raised">raised</Card>
      <Card variant="filled" tone="violet">
        filled · violet
      </Card>
      <Card as="a" href="#" variant="filled" tone="green">
        a link card
      </Card>
    </div>
  ),
}

export const ButtonTones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['solid', 'soft', 'outline'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {tones.map((tone) => (
            <Button key={tone} variant={variant} tone={tone} size="sm">
              {tone}
            </Button>
          ))}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8 }}>
        <ButtonLink href="#" variant="outline">
          A link as a button
        </ButtonLink>
        <Button square variant="soft" aria-label="Add">
          +
        </Button>
      </div>
    </div>
  ),
}

function TabsDemo() {
  const [tab, setTab] = useState<'week' | 'home' | 'papers'>('week')
  return (
    <Tabs
      label="Views"
      value={tab}
      onChange={setTab}
      items={[
        { value: 'week', label: '📅 Week', content: <Card>Week view</Card> },
        { value: 'home', label: '🏠 At home', content: <Card>At home view</Card> },
        { value: 'papers', label: '📄 Papers', content: <Card>Papers view</Card> },
      ]}
    />
  )
}
export const TabsWithPanels: Story = { render: () => <TabsDemo /> }

function ChipsDemo() {
  const [value, setValue] = useState('all')
  return (
    <ChipBar
      label="Filter"
      tone="blue"
      value={value}
      onChange={setValue}
      items={[
        { value: 'all', label: 'All', count: 40 },
        { value: 'local', label: 'Local', count: 12 },
        { value: 'world', label: 'World', count: 9 },
        { value: 'sport', label: 'Sport', count: 19 },
      ]}
    />
  )
}
export const Chips: Story = { render: () => <ChipsDemo /> }

export const Notices: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
      <Alert>Loading the latest list…</Alert>
      <Alert kind="success" icon="✓">
        Saved.
      </Alert>
      <Alert kind="warning" title="Running out">
        Only 5 left: about a week.
      </Alert>
      <Alert kind="error">Couldn't reach the server. Trying again in a minute.</Alert>
    </div>
  ),
}

export const Badges: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge>default</Badge>
      <Badge variant="muted">muted</Badge>
      <Badge variant="solid">solid</Badge>
      {tones.map((tone) => (
        <Badge key={tone} tone={tone}>
          {tone}
        </Badge>
      ))}
      <Badge variant="solid" tone="violet">
        New
      </Badge>
    </div>
  ),
}

export const Forms: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <TextField label="Name" placeholder="e.g. Ana" />
      <TextArea label="Message" placeholder="Write something…" hint="Up to 2000 characters." />
      <SelectField label="Repeat" defaultValue="week">
        <option value="day">Every day</option>
        <option value="week">Every week</option>
      </SelectField>
    </div>
  ),
}

function DialogDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Count the pills"
        description="How many are in the box right now?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button tone="green" onClick={() => setOpen(false)}>
              Save
            </Button>
          </>
        }
      >
        <TextField label="Pills" inputMode="numeric" />
      </Sheet>
    </>
  )
}
export const DialogWithDescription: Story = { render: () => <DialogDemo /> }

// Grey placeholder photos drawn as SVG (no outside images).
const photo = (fill: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="${fill}"/></svg>`,
  )}`

export const PhotoGallery: Story = {
  render: () => (
    <div style={{ maxWidth: 720 }}>
      <Gallery
        photos={[{ src: photo('#4a7dff') }, { src: photo('#34c47c') }, { src: photo('#ff9a3c') }]}
      />
    </div>
  ),
}

export const Weather: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {[
        [0, 'Clear'],
        [2, 'Partly cloudy'],
        [3, 'Cloudy'],
        [45, 'Fog'],
        [61, 'Light rain'],
        [80, 'Showers'],
        [71, 'Snow'],
        [95, 'Thunderstorm'],
      ].map(([code, label]) => (
        <figure key={code} style={{ margin: 0, textAlign: 'center' }}>
          <WeatherIcon code={code as number} label={label as string} size={64} />
          <figcaption style={{ fontSize: 12 }}>{label}</figcaption>
        </figure>
      ))}
      <figure style={{ margin: 0, textAlign: 'center' }}>
        <WeatherIcon code={0} isDay={false} label="Clear night" size={64} />
        <figcaption style={{ fontSize: 12 }}>Clear night</figcaption>
      </figure>
    </div>
  ),
}
