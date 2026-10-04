const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const SLOT_PATTERN = /^(0?[1-9]|1[0-2]):[0-5]\d (AM|PM)$/

export type BookingSelection = {
  courseId: string
  date: string
  batch: 'morning' | 'evening'
  slot: string
}

export function bookingReturnPath(
  pathname: string,
  selection: { courseId: string; date: string; batch: string; slot: string }
) {
  const params = new URLSearchParams()
  if (selection.courseId) params.set('course', selection.courseId)
  if (DATE_PATTERN.test(selection.date)) params.set('date', selection.date)
  if (selection.batch === 'morning' || selection.batch === 'evening') params.set('batch', selection.batch)
  if (SLOT_PATTERN.test(selection.slot)) params.set('slot', selection.slot)
  const query = params.toString()
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return query ? `${path}?${query}` : path
}

export function readBookingSelection(search: string, courseId: string): BookingSelection | null {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const requestedCourse = params.get('course')
  if (requestedCourse && requestedCourse !== courseId) return null

  const date = params.get('date') ?? ''
  const batch = params.get('batch') ?? ''
  const slot = params.get('slot') ?? ''
  if (!DATE_PATTERN.test(date)) return null
  if (batch !== 'morning' && batch !== 'evening') return null
  if (!SLOT_PATTERN.test(slot)) return null

  return { courseId, date, batch, slot }
}
