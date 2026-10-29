export const themes = [
  'paper',
  'ink',
  'tomato',
  'lagoon',
  'moss',
  'plum',
  'sun',
  'midnight',
] as const

export type Theme = (typeof themes)[number] | 'auto'

/** Background / text colour of each theme, for theme pickers. */
export const themeSwatches: Record<(typeof themes)[number], { bg: string; fg: string }> = {
  paper: { bg: '#faf8f4', fg: '#1e1c19' },
  ink: { bg: '#141519', fg: '#f2efe9' },
  tomato: { bg: '#f2533b', fg: '#fff7f1' },
  lagoon: { bg: '#12707f', fg: '#effbfb' },
  moss: { bg: '#3f6e35', fg: '#f4f7ea' },
  plum: { bg: '#4d2461', fg: '#fbf0ff' },
  sun: { bg: '#ffc23a', fg: '#2a1f05' },
  midnight: { bg: '#18224a', fg: '#eef1ff' },
}
