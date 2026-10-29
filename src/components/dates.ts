export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Short weekday names starting on `weekStartsOn` (0 = Sunday, 1 = Monday). */
export function weekdayNames(
  locale: string | undefined,
  weekStartsOn: number,
  style: 'narrow' | 'short',
) {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: style })
  // 2024-01-07 was a Sunday.
  return Array.from({ length: 7 }, (_, i) =>
    fmt.format(new Date(2024, 0, 7 + ((i + weekStartsOn) % 7))),
  )
}

export function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}
