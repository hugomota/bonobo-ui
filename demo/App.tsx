import { useRef, useState } from 'react'
import {
  AgendaDay,
  Button,
  Card,
  Checkbox,
  ColorSwatches,
  DisplayNumber,
  EmptyState,
  EventItem,
  Eyebrow,
  Fab,
  IconButton,
  ListTile,
  MonthHeatmap,
  ProgressRing,
  SegmentedControl,
  Sheet,
  Sketchpad,
  Switch,
  TabBar,
  Tag,
  TaskRow,
  TextField,
  TimeZoneCompare,
  ThemeProvider,
  Title,
  ToastProvider,
  ToolPalette,
  WeekStrip,
  defaultTools,
  themeSwatches,
  themes,
  useToast,
  type SketchpadHandle,
  type Theme,
  type ToolKind,
  type ZoneConfig,
} from '../src'

const LOCALE = 'pt-PT'

const colors = {
  red: '#ff5d5d',
  orange: '#ff9a3c',
  yellow: '#ffcc33',
  green: '#34c47c',
  teal: '#1fb8b0',
  blue: '#4a7dff',
  violet: '#8a5cf6',
  pink: '#ff6fb1',
}

const tabs = [
  { id: 'tasks', label: 'Tarefas', icon: 'list' as const },
  { id: 'calendar', label: 'Calendário', icon: 'calendar' as const },
  { id: 'draw', label: 'Desenho', icon: 'pen' as const },
  { id: 'zones', label: 'Fusos', icon: 'globe' as const },
  { id: 'basics', label: 'Básicos', icon: 'star' as const },
]

// The theme swatch colours double as the theme picker (bg of each theme).
const themeByBg = Object.fromEntries(themes.map((t) => [themeSwatches[t].bg, t]))

export function App() {
  const [theme, setTheme] = useState<Theme>('paper')
  const [tab, setTab] = useState('tasks')
  const swatch = theme === 'auto' ? themeSwatches.paper.bg : themeSwatches[theme].bg

  return (
    <ThemeProvider theme={theme} className="demo">
      <ToastProvider>
        <div className="demo__inner">
          <header className="demo__head">
            <div>
              <Eyebrow>Biblioteca de componentes React</Eyebrow>
              <Title as="h1" size="xl">
                Bonobo UI
              </Title>
              <p className="demo__note">
                Inspirada no estilo das apps Timepage, Actions e Flow. Sem ligação à Bonobo Labs.
              </p>
            </div>
            <ColorSwatches
              label="Tema"
              size="sm"
              colors={themes.map((t) => themeSwatches[t].bg)}
              value={swatch}
              onChange={(bg) => setTheme(themeByBg[bg])}
            />
          </header>

          {tab === 'tasks' && <TasksDemo />}
          {tab === 'calendar' && <CalendarDemo />}
          {tab === 'draw' && <DrawDemo />}
          {tab === 'zones' && <ZonesDemo />}
          {tab === 'basics' && <BasicsDemo />}
        </div>
        <TabBar items={tabs} value={tab} onChange={setTab} position="fixed" />
      </ToastProvider>
    </ThemeProvider>
  )
}

/* ---------- Tarefas (estilo Actions) ---------- */

interface Task {
  id: number
  title: string
  note?: string
  done: boolean
  due?: string
  tags?: { label: string; color: string }[]
}

const lists = [
  { id: 'casa', title: 'Casa', color: colors.orange, icon: 'inbox' as const },
  { id: 'trabalho', title: 'Trabalho', color: colors.blue, icon: 'flag' as const },
  { id: 'compras', title: 'Compras', color: colors.green, icon: 'star' as const },
  { id: 'ideias', title: 'Ideias', color: colors.violet, icon: 'book' as const },
]

const firstTasks: Task[] = [
  {
    id: 1,
    title: 'Regar as plantas',
    done: false,
    due: 'Hoje',
    tags: [{ label: 'Jardim', color: colors.green }],
  },
  { id: 2, title: 'Marcar revisão do carro', note: 'Oficina abre às 9h', done: false, due: 'Sex' },
  {
    id: 3,
    title: 'Ligar à avó',
    done: true,
    tags: [{ label: 'Família', color: colors.pink }],
  },
  { id: 4, title: 'Trocar a lâmpada da cozinha', done: false },
]

function TasksDemo() {
  const toast = useToast()
  const [list, setList] = useState(lists[0])
  const [tasks, setTasks] = useState(firstTasks)
  const [draft, setDraft] = useState('')
  const nextId = useRef(100)

  const done = tasks.filter((t) => t.done).length
  const open = tasks.length - done

  const remove = (task: Task) => {
    setTasks((all) => all.filter((t) => t.id !== task.id))
    toast(`"${task.title}" apagada`, {
      action: { label: 'Anular', onClick: () => setTasks((all) => [...all, task]) },
    })
  }

  return (
    <section className="demo__section">
      <div className="demo__grid">
        {lists.map((l) => (
          <ListTile
            key={l.id}
            title={l.title}
            color={l.color}
            icon={l.icon}
            count={l.id === list.id ? open : 3}
            onClick={() => setList(l)}
          />
        ))}
      </div>

      <div className="demo__split">
        <div>
          <Eyebrow>Lista</Eyebrow>
          <Title>{list.title}</Title>
        </div>
        <ProgressRing
          value={tasks.length ? done / tasks.length : 0}
          color={list.color}
          label="Feitas"
        />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!draft.trim()) return
          setTasks((all) => [{ id: nextId.current++, title: draft.trim(), done: false }, ...all])
          setDraft('')
        }}
      >
        <TextField
          variant="title"
          placeholder="Nova tarefa…"
          aria-label="Nova tarefa"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          hint="Enter para juntar. Deslize uma tarefa para a direita (feita) ou esquerda (apagar)."
        />
      </form>

      {tasks.length === 0 ? (
        <EmptyState
          title="Tudo feito!"
          action={<Button onClick={() => setTasks(firstTasks)}>Repor</Button>}
        >
          Não há nada nesta lista. Aproveite o dia.
        </EmptyState>
      ) : (
        <div className="demo__stack">
          {tasks.map((t) => (
            <TaskRow
              key={t.id}
              title={t.title}
              note={t.note}
              done={t.done}
              color={list.color}
              meta={t.due}
              onToggle={(d) =>
                setTasks((all) => all.map((x) => (x.id === t.id ? { ...x, done: d } : x)))
              }
              onDelete={() => remove(t)}
            >
              {t.tags?.map((tag) => (
                <Tag key={tag.label} color={tag.color}>
                  {tag.label}
                </Tag>
              ))}
            </TaskRow>
          ))}
        </div>
      )}
    </section>
  )
}

/* ---------- Calendário (estilo Timepage) ---------- */

// Made-up busy days for the heatmap.
function busyness(year: number, month: number): Record<number, number> {
  const out: Record<number, number> = {}
  for (let d = 1; d <= 31; d++) out[d] = (d * 7 + month * 3 + year) % 9 < 4 ? (d * 5) % 8 : 0
  return out
}

const sampleEvents = [
  {
    time: '08:30',
    until: '09:00',
    title: 'Café com a Rita',
    place: 'Pastelaria Central',
    color: colors.orange,
  },
  { time: '10:00', until: '11:30', title: 'Reunião de equipa', color: colors.blue },
  { time: '18:30', title: 'Natação', place: 'Piscina municipal', color: colors.teal },
]

function CalendarDemo() {
  const today = new Date()
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(today)
  const counts = busyness(month.getFullYear(), month.getMonth())

  const shift = (n: number) => setMonth(new Date(month.getFullYear(), month.getMonth() + n, 1))
  const days = Array.from(
    { length: 4 },
    (_, i) => new Date(selected.getFullYear(), selected.getMonth(), selected.getDate() + i),
  )

  return (
    <section className="demo__section">
      <div className="demo__today">
        <DisplayNumber>{selected.getDate()}</DisplayNumber>
        <div>
          <Eyebrow>{new Intl.DateTimeFormat(LOCALE, { weekday: 'long' }).format(selected)}</Eyebrow>
          <Title size="md">
            {new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' }).format(selected)}
          </Title>
        </div>
      </div>

      <WeekStrip
        date={selected}
        selected={selected}
        onSelect={setSelected}
        marked={(d) => d.getDate() % 3 !== 0}
        locale={LOCALE}
      />

      <Card>
        <div className="demo__split">
          <IconButton icon="chevronLeft" label="Mês anterior" onClick={() => shift(-1)} />
          <IconButton icon="chevronRight" label="Mês seguinte" onClick={() => shift(1)} />
        </div>
        <MonthHeatmap
          year={month.getFullYear()}
          month={month.getMonth()}
          counts={counts}
          selected={selected}
          onSelect={setSelected}
          locale={LOCALE}
        />
      </Card>

      <div>
        {days.map((d, i) => (
          <AgendaDay
            key={d.toDateString()}
            date={d}
            locale={LOCALE}
            emptyText="Dia livre"
            aside={i === 0 ? '☀️ 19°' : undefined}
          >
            {i % 2 === 0
              ? sampleEvents
                  .slice(0, 3 - i)
                  .map((e) => <EventItem key={e.title} {...e} onClick={() => {}} />)
              : []}
          </AgendaDay>
        ))}
      </div>
    </section>
  )
}

/* ---------- Desenho (estilo Flow) ---------- */

const inkColors = ['#1e1c19', '#4a7dff', '#ff5d5d', '#34c47c', '#ffcc33', '#8a5cf6', '#ff9a3c']

function DrawDemo() {
  const pad = useRef<SketchpadHandle>(null)
  const [tool, setTool] = useState('pen')
  const [ink, setInk] = useState(inkColors[0])
  const [size, setSize] = useState<'2' | '4' | '8'>('4')
  const [paper, setPaper] = useState<'dots' | 'lines' | 'plain'>('dots')
  const [strokes, setStrokes] = useState(0)
  const kind = (defaultTools.find((t) => t.id === tool)?.kind ?? 'pen') as ToolKind

  return (
    <section className="demo__section">
      <div className="demo__split">
        <div>
          <Eyebrow>Caderno</Eyebrow>
          <Title>Esboço</Title>
        </div>
        <div className="demo__row">
          <IconButton
            icon="undo"
            label="Anular"
            disabled={!strokes}
            onClick={() => pad.current?.undo()}
          />
          <IconButton
            icon="trash"
            label="Limpar"
            disabled={!strokes}
            onClick={() => pad.current?.clear()}
          />
        </div>
      </div>

      <Sketchpad
        ref={pad}
        tool={kind}
        color={ink}
        size={Number(size)}
        paper={paper}
        onChange={setStrokes}
        aria-label="Esboço"
      />

      <div>
        <ToolPalette
          label="Ferramentas"
          tools={defaultTools.map((t) => ({
            ...t,
            label: {
              pen: 'Caneta',
              pencil: 'Lápis',
              marker: 'Marcador',
              brush: 'Pincel',
              eraser: 'Borracha',
            }[t.kind],
          }))}
          value={tool}
          onChange={setTool}
          color={ink}
        />
        <div className="demo__drawbar">
          <ColorSwatches
            label="Cor da tinta"
            size="sm"
            colors={inkColors}
            value={ink}
            onChange={setInk}
          />
          <SegmentedControl
            label="Espessura"
            options={[
              { value: '2', label: 'Fina' },
              { value: '4', label: 'Média' },
              { value: '8', label: 'Grossa' },
            ]}
            value={size}
            onChange={setSize}
          />
        </div>
      </div>

      <SegmentedControl
        label="Papel"
        options={[
          { value: 'dots', label: 'Pontos' },
          { value: 'lines', label: 'Linhas' },
          { value: 'plain', label: 'Liso' },
        ]}
        value={paper}
        onChange={setPaper}
      />
    </section>
  )
}

/* ---------- Fusos (estilo Overlap) ---------- */

const ZONES_KEY = 'bonobo-ui-demo-zones'

const firstZones: ZoneConfig[] = [
  {
    id: 'lis',
    timeZone: 'Europe/Lisbon',
    label: 'Lisboa',
    start: 540,
    end: 1080,
    flex: 60,
    color: colors.blue,
  },
  {
    id: 'nyc',
    timeZone: 'America/New_York',
    label: 'Nova Iorque',
    start: 540,
    end: 1020,
    flex: 60,
    color: colors.orange,
  },
  {
    id: 'sao',
    timeZone: 'America/Sao_Paulo',
    label: 'São Paulo',
    start: 540,
    end: 1080,
    flex: 30,
    color: colors.green,
  },
  {
    id: 'tyo',
    timeZone: 'Asia/Tokyo',
    label: 'Tóquio',
    start: 540,
    end: 1080,
    flex: 120,
    color: colors.violet,
  },
]

// Portuguese names for the search (the browser only knows IANA names).
const ptAliases: Record<string, string> = {
  Lisboa: 'Europe/Lisbon',
  Porto: 'Europe/Lisbon',
  Açores: 'Atlantic/Azores',
  Madeira: 'Atlantic/Madeira',
  Londres: 'Europe/London',
  Madrid: 'Europe/Madrid',
  Paris: 'Europe/Paris',
  Berlim: 'Europe/Berlin',
  Genebra: 'Europe/Zurich',
  Luxemburgo: 'Europe/Luxembourg',
  'Nova Iorque': 'America/New_York',
  Toronto: 'America/Toronto',
  'Los Angeles': 'America/Los_Angeles',
  'São Paulo': 'America/Sao_Paulo',
  'Rio de Janeiro': 'America/Sao_Paulo',
  Luanda: 'Africa/Luanda',
  Maputo: 'Africa/Maputo',
  'Cabo Verde': 'Atlantic/Cape_Verde',
  Bissau: 'Africa/Bissau',
  'São Tomé': 'Africa/Sao_Tome',
  Dubai: 'Asia/Dubai',
  'Nova Deli': 'Asia/Kolkata',
  Macau: 'Asia/Macau',
  Pequim: 'Asia/Shanghai',
  Díli: 'Asia/Dili',
  Tóquio: 'Asia/Tokyo',
  Sydney: 'Australia/Sydney',
}

function loadZones(): ZoneConfig[] {
  try {
    const saved = localStorage.getItem(ZONES_KEY)
    if (saved) return JSON.parse(saved) as ZoneConfig[]
  } catch {
    // Private window or blocked storage: start with the defaults.
  }
  return firstZones
}

function ZonesDemo() {
  const toast = useToast()
  const [zones, setZones] = useState(loadZones)

  const change = (next: ZoneConfig[]) => {
    setZones(next)
    try {
      localStorage.setItem(ZONES_KEY, JSON.stringify(next))
    } catch {
      // Not saved; fine for a demo.
    }
  }

  return (
    <section className="demo__section">
      <div className="demo__split">
        <div>
          <Eyebrow>Relógio mundial</Eyebrow>
          <Title>Fusos horários</Title>
        </div>
        <Button variant="soft" size="sm" onClick={() => change(firstZones)}>
          Repor
        </Button>
      </div>
      <TimeZoneCompare
        zones={zones}
        onZonesChange={change}
        aliases={ptAliases}
        locale={LOCALE}
        onShare={(text) => {
          navigator.clipboard
            ?.writeText(text)
            .then(() => toast('Horas copiadas'))
            .catch(() => toast('Não foi possível copiar'))
        }}
        labels={{
          now: 'Agora',
          fromNow: 'desde agora',
          add: 'Juntar fuso',
          search: 'Cidade ou fuso',
          graph: 'Sobreposição',
          date: 'Data',
          share: 'Copiar horas',
          edit: 'Editar fuso',
          name: 'Nome',
          from: 'Disponível das',
          to: 'às',
          flex: 'Margem',
          none: 'Nenhuma',
          home: 'Fuso de casa',
          remove: 'Remover',
          done: 'Feito',
          noOverlap: 'Não há nenhuma hora boa para todos',
          hint: 'Deslize para os lados para andar no tempo. Mantenha carregado num fuso para o encolher.',
        }}
      />
    </section>
  )
}

/* ---------- Básicos ---------- */

function BasicsDemo() {
  const toast = useToast()
  const [sheet, setSheet] = useState(false)
  const [check, setCheck] = useState(true)
  const [notify, setNotify] = useState(true)
  const [view, setView] = useState<'day' | 'week' | 'month'>('week')
  const [tags, setTags] = useState(['Casa', 'Urgente', 'Ideias'])
  const tagColors = [colors.orange, colors.red, colors.violet]

  return (
    <section className="demo__section">
      <Card variant="raised">
        <p className="demo__label">Botões</p>
        <div className="demo__row">
          <Button icon="plus">Juntar</Button>
          <Button variant="soft">Cancelar</Button>
          <Button variant="ghost">Mais tarde</Button>
          <Button size="sm" variant="soft" icon="clock">
            Lembrar
          </Button>
          <IconButton icon="more" label="Mais" variant="soft" />
          <Fab label="Nova tarefa" onClick={() => toast('Botão + carregado')} />
        </div>
      </Card>

      <Card variant="raised">
        <p className="demo__label">Escolhas</p>
        <div className="demo__section">
          <Checkbox checked={check} onChange={setCheck} label="Visto redondo" />
          <Checkbox
            checked={!check}
            onChange={(c) => setCheck(!c)}
            color={colors.pink}
            label="Com a cor da lista"
          />
          <Switch checked={notify} onChange={setNotify} label="Notificações" />
          <SegmentedControl
            label="Vista"
            options={[
              { value: 'day', label: 'Dia' },
              { value: 'week', label: 'Semana' },
              { value: 'month', label: 'Mês' },
            ]}
            value={view}
            onChange={setView}
          />
        </div>
      </Card>

      <Card variant="raised">
        <p className="demo__label">Campos e etiquetas</p>
        <div className="demo__section">
          <TextField label="Nome" placeholder="Ex.: Ana" hint="Como quer ser chamado." />
          <div className="demo__row">
            {tags.map((t, i) => (
              <Tag
                key={t}
                color={tagColors[i]}
                onRemove={() => setTags(tags.filter((x) => x !== t))}
              >
                {t}
              </Tag>
            ))}
            <Tag>Sem cor</Tag>
          </div>
        </div>
      </Card>

      <Card variant="raised">
        <p className="demo__label">Folha e avisos</p>
        <div className="demo__row">
          <Button onClick={() => setSheet(true)}>Abrir folha</Button>
          <Button variant="soft" onClick={() => toast('Guardado')}>
            Mostrar aviso
          </Button>
        </div>
      </Card>

      <ThemeProvider theme="lagoon">
        <Card>
          <Eyebrow>Temas dentro de temas</Eyebrow>
          <Title size="md">Este cartão usa sempre o tema “lagoon”.</Title>
        </Card>
      </ThemeProvider>

      <Sheet
        open={sheet}
        onClose={() => setSheet(false)}
        title="Novo evento"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSheet(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                setSheet(false)
                toast('Evento criado')
              }}
            >
              Criar
            </Button>
          </>
        }
      >
        <div className="demo__section">
          <TextField variant="title" placeholder="Título" aria-label="Título" />
          <TextField label="Local" placeholder="Opcional" />
          <Switch checked={notify} onChange={setNotify} label="Avisar 10 min antes" />
        </div>
      </Sheet>
    </section>
  )
}
