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
