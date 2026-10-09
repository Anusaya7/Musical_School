/** Parse display times like "10:00 AM" / "12:00 PM" into minutes from midnight. */
export function parseSlotToMinutes(slot: string): number | null {
  const match = slot.trim().match(/^(0?[1-9]|1[0-2]):([0-5]\d)\s*(AM|PM)$/i)
  if (!match) return null
  let hour = Number(match[1])
  const minute = Number(match[2])
  const period = match[3].toUpperCase()
  if (period === 'AM') {
    if (hour === 12) hour = 0
  } else if (hour !== 12) {
    hour += 12
  }
  return hour * 60 + minute
}

/** Local calendar date as YYYY-MM-DD */
export function localDateString(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function isSlotInPast(date: string, slot: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  if (date > localDateString(now)) return false
  if (date < localDateString(now)) return true
  const mins = parseSlotToMinutes(slot)
  if (mins === null) return false
  const nowMins = now.getHours() * 60 + now.getMinutes()
  return mins <= nowMins
}

export function filterFutureSlots(date: string, slots: string[], now = new Date()) {
  return slots.filter(slot => !isSlotInPast(date, slot, now))
}

export function defaultMorningSlots() {
  return ['04:00 AM', '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM']
}

export function defaultEveningSlots() {
  return ['03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM']
}

export function batchHasFutureSlots(
  date: string,
  batch: 'morning' | 'evening',
  schedules: { id: string; timeSlots: string[] }[],
  now = new Date()
) {
  const fromDb = schedules.find(s => s.id === batch)?.timeSlots
  const slots = fromDb?.length
    ? fromDb
    : batch === 'morning'
      ? defaultMorningSlots()
      : defaultEveningSlots()
  return filterFutureSlots(date, slots, now).length > 0
}
