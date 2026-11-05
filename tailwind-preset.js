// Tailwind 3 preset for apps that use bonobo-ui and Tailwind for layout.
// The colours are the library's: theme colours read the --bn-* variables
// (so they follow the ThemeProvider), and the palette scales are built from
// the list colours in src/styles/tokens.css (500 ≈ the list colour, 600+ for
// white text, 50-200 for soft fills).
//
//   // tailwind.config.js
//   import bonobo from './vendor/bonobo-ui/tailwind-preset.js'
//   export default { presets: [bonobo], content: [...] }

// A --bn-* variable with Tailwind's opacity modifier (bg-bn-bg/90).
const v = (name) => `color-mix(in srgb, var(${name}) calc(<alpha-value> * 100%), transparent)`

export const palette = {
  // Warm paper / ink neutrals.
  ink: {
    50: '#faf8f4',
    100: '#f2efe9',
    200: '#e6e1d6',
    300: '#d4cec2',
    400: '#a8a196',
    500: '#7a746b',
    600: '#5c574f',
    700: '#45413b',
    800: '#2e2b27',
    900: '#1e1c19',
    950: '#141210',
  },
  green: {
    50: '#eafaf1',
    100: '#cdf3df',
    200: '#9de6bf',
    300: '#66d59b',
    400: '#34c47c',
    500: '#26ad6a',
    600: '#1f9e5f',
    700: '#177a49',
    800: '#145f3a',
    900: '#114c2f',
  },
  blue: {
    50: '#eef3ff',
    100: '#dbe5ff',
    200: '#bccdff',
    300: '#8fabff',
    400: '#6b91ff',
    500: '#4a7dff',
    600: '#3463e6',
    700: '#2a4fbd',
    800: '#263f93',
    900: '#233873',
  },
  orange: {
    50: '#fff8e6',
    100: '#ffefc2',
    200: '#ffe08a',
    300: '#ffcc33',
    400: '#ffb21f',
    500: '#ff9a3c',
    600: '#e07a1a',
    700: '#b35b10',
    800: '#8f4712',
    900: '#733a12',
  },
  violet: {
    50: '#f4f0ff',
    100: '#ebe3ff',
    200: '#d9caff',
    300: '#bea3fc',
    400: '#a37cf9',
    500: '#8a5cf6',
    600: '#7744e8',
    700: '#6334c9',
    800: '#522ca3',
    900: '#442884',
  },
  tomato: {
    50: '#fff2ef',
    100: '#ffe1da',
    200: '#ffc4b6',
    300: '#ff9d87',
    400: '#ff7558',
    500: '#ff5a3c',
    600: '#ec3f20',
    700: '#c63016',
    800: '#a32a16',
    900: '#862818',
  },
  red: {
    50: '#fff1f1',
    100: '#ffdfdf',
    200: '#ffc5c5',
    300: '#ff9d9d',
    400: '#ff7676',
    500: '#ff5d5d',
    600: '#e53535',
    700: '#c22525',
    800: '#a12222',
    900: '#852323',
  },
  teal: {
    50: '#e9f9f8',
    100: '#c9f0ee',
    200: '#95e1dd',
    300: '#5ccdc7',
    400: '#2fbdb5',
    500: '#1fb8b0',
    600: '#138a84',
    700: '#0e6f6a',
    800: '#0e5955',
    900: '#0d4946',
  },
  pink: {
    50: '#fff0f7',
    100: '#ffdced',
    200: '#ffbadb',
    300: '#ff94c6',
    400: '#ff6fb1',
    500: '#f2559c',
    600: '#e0458f',
    700: '#b8306f',
    800: '#962a5c',
    900: '#7a264d',
  },
}

export default {
  theme: {
    extend: {
      colors: {
        ...palette,
        // Theme colours (follow the ThemeProvider).
        'bn-bg': v('--bn-bg'),
        'bn-fg': v('--bn-fg'),
        'bn-fg-muted': v('--bn-fg-muted'),
        'bn-fg-subtle': v('--bn-fg-subtle'),
        'bn-surface': v('--bn-surface'),
        'bn-surface-2': v('--bn-surface-2'),
        'bn-line': v('--bn-line'),
        'bn-paper': v('--bn-paper'),
        'bn-accent': v('--bn-accent'),
        'bn-accent-fg': v('--bn-accent-fg'),
        // Bold theme colours, for a filled block in another theme.
        'bn-sun': { DEFAULT: '#ffc23a', fg: '#2a1f05' },
        'bn-midnight': { DEFAULT: '#18224a', fg: '#eef1ff' },
      },
      fontFamily: {
        sans: ['Outfit Variable', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'bn-sm': '8px',
        'bn-md': '14px',
        'bn-lg': '22px',
      },
      // Flat look: no drop shadows on everyday things (lg/xl stay for overlays).
      boxShadow: {
        sm: 'none',
        DEFAULT: 'none',
        md: 'none',
      },
    },
  },
}
