# Bonobo UI

React components inspired by the look of Bonobo Labs' apps (Timepage,
Actions, Flow). Original code, icons and colours: no assets copied, and
**not affiliated with Bonobo**. Private, for Hugo's own projects.

- **Themes** (Timepage idea): one bold colour fills the screen, text in a
  second colour, everything else mixed from those two. `paper`, `ink`,
  `tomato`, `lagoon`, `moss`, `plum`, `sun`, `midnight`, or `auto`
  (paper/ink following the device). Themes can be nested.
- **Lists and tasks** (Actions): `ListTile`, `TaskRow` (round check, swipe
  right = done, swipe left = delete), `ProgressRing`, `Tag`, `Fab`.
- **Calendar** (Timepage): `MonthHeatmap` (days shaded by how busy they are),
  `WeekStrip`, `AgendaDay`, `EventItem`, `DisplayNumber`.
- **Drawing** (Flow): `ToolPalette` (pen, pencil, marker, brush, eraser; the
  chosen one slides up), `ColorSwatches`, `Sketchpad` (canvas, undo/clear,
  PNG export).
- **Basics**: `Button`, `IconButton`, `Checkbox`, `Switch`,
  `SegmentedControl`, `TextField`, `Card`, `Eyebrow`, `Title`, `Sheet`,
  `ToastProvider` + `useToast`, `TabBar`, `EmptyState`, `Icon`.

## Use

```tsx
import { ThemeProvider, TaskRow } from 'bonobo-ui'
import 'bonobo-ui/styles.css'

;<ThemeProvider theme="tomato">
  <TaskRow title="Regar as plantas" done={done} onToggle={setDone} />
</ThemeProvider>
```

Everything must be inside a `ThemeProvider` (it holds the design tokens,
`src/styles/tokens.css`). React 19 is a peer dependency. CSS uses
`color-mix()` and `:has()` (Chrome 111+, Safari 16.2+, Firefox 121+).

Another local project can use it with `"bonobo-ui": "file:../bonobo-ui"`
after `npm run build:lib`.

## Demo

`https://ui.hmota.duckdns.org` (home network only, `lan-only`). Container
`bonobo-ui` = Vite build of `demo/` served by nginx:

```bash
docker compose up -d --build     # after every change
```

## Develop

No Node on the host: npm runs in a throwaway container.

```bash
docker run --rm -u "$(id -u):$(id -g)" -e HOME=/tmp -v "$PWD:/app" -w /app \
  node:24.11.0-slim npm run check      # or: npm run format / npm run build
```

`npm run build:lib` → `dist/` (ES module, `styles.css`, `.d.ts` types).
`npm run build:demo` → `dist-demo/`.
