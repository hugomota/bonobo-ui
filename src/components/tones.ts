/** Colours a component can take (see "Tones" in components.css). */
export const tones = [
  'red',
  'tomato',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'violet',
  'pink',
  'graphite',
] as const

export type Tone = (typeof tones)[number]

/** Class that gives an element (and what's inside) a tone. */
export const toneClass = (tone?: Tone) => (tone ? `bn-tone-${tone}` : undefined)
