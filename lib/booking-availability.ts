/** School timezone — all slot availability is evaluated in IST. */
export const SCHOOL_TIMEZONE = 'Asia/Kolkata'

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

/**
 * Current date/time parts in Asia/Kolkata (IST), independent of server or browser TZ.
 */
export function getIndiaNowParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: SCHOOL_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(now)

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find(p => p.type === type)?.value || '0'

  const year = Number(get('year'))
  const month = Number(get('month'))
  const day = Number(get('day'))
  const hour = Number(get('hour'))
  const minute = Number(get('minute'))

  const date = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  const minutesFromMidnight = hour * 60 + minute

  return { date, year, month, day, hour, minute, minutesFromMidnight }
}

/** Today's calendar date in IST as YYYY-MM-DD */
export function localDateString(now = new Date()) {
  return getIndiaNowParts(now).date
}

export function isSlotInPast(date: string, slot: string, now = new Date()) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const india = getIndiaNowParts(now)
  if (date > india.date) return false
  if (date < india.date) return true
  const mins = parseSlotToMinutes(slot)
  if (mins === null) return false
  return mins <= india.minutesFromMidnight
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
