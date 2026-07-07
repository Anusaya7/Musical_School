'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Holiday {
  id: string
  date: string
  reason: string
  isRecurringWeekly: boolean
  dayOfWeek?: number
}

interface CalendarDatePickerProps {
  selectedDate: string
  onChange: (dateStr: string) => void
  holidays: Holiday[]
  accentColor?: 'pink' | 'blue' | 'purple'
  theme?: 'light' | 'dark'
}

export default function CalendarDatePicker({
  selectedDate,
  onChange,
  holidays,
  accentColor = 'pink',
  theme = 'light'
}: CalendarDatePickerProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Current viewed month and year
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  // Sync viewed month/year when a date is selected externally
  useEffect(() => {
    if (selectedDate) {
      const parsed = new Date(selectedDate)
      if (!isNaN(parsed.getTime())) {
        setCurrentMonth(parsed.getMonth())
        setCurrentYear(parsed.getFullYear())
      }
    }
  }, [selectedDate])

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  // Theme styling configurations
  const styles = {
    pink: {
      text: 'text-[#FF6FAF]',
      bg: 'bg-[#FF6FAF]',
      bgHover: 'hover:bg-[#FFD6E8]/30',
      border: 'border-[#FFD6E8]',
      ring: 'focus:ring-[#FF6FAF]/40',
      bgLight: 'bg-[#FFD6E8]/20'
    },
    blue: {
      text: 'text-[#5EA8FF]',
      bg: 'bg-[#5EA8FF]',
      bgHover: 'hover:bg-[#DCEEFF]/30',
      border: 'border-[#DCEEFF]',
      ring: 'focus:ring-[#5EA8FF]/40',
      bgLight: 'bg-[#DCEEFF]/20'
    },
    purple: {
      text: 'text-[#DFA7FF]',
      bg: 'bg-[#DFA7FF]',
      bgHover: 'hover:bg-[#F4D9FF]/30',
      border: 'border-[#F4D9FF]',
      ring: 'focus:ring-[#DFA7FF]/40',
      bgLight: 'bg-[#F4D9FF]/20'
    }
  }

  const activeStyle = styles[accentColor]

  // Calendar math
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay()

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleYearChange = (year: number) => {
    setCurrentYear(year)
  }

  const handleMonthChange = (month: number) => {
    setCurrentMonth(month)
  }

  // Generate years range (-5 to +5 years from today)
  const startYear = today.getFullYear() - 2
  const yearsRange = Array.from({ length: 8 }, (_, i) => startYear + i)

  // Check if a date is a holiday or Monday or in the past
  const isDateDisabled = (day: number) => {
    const checkDate = new Date(currentYear, currentMonth, day)
    checkDate.setHours(0, 0, 0, 0)

    // Disable past dates
    if (checkDate < today) return true

    const checkDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayOfWeek = checkDate.getDay()

    // Default Monday holiday rule (day index 1)
    if (dayOfWeek === 1) return true

    // Check custom database holidays
    const isHoliday = holidays.some((h) => {
      if (h.isRecurringWeekly) {
        return h.dayOfWeek === dayOfWeek
      }
      return h.date === checkDateStr
    })

    return isHoliday
  }

  const getHolidayReason = (day: number) => {
    const checkDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const checkDate = new Date(currentYear, currentMonth, day)
    const dayOfWeek = checkDate.getDay()

    if (dayOfWeek === 1) return 'Weekly Holiday (Monday - Closed)'

    const holiday = holidays.find((h) => {
      if (h.isRecurringWeekly) {
        return h.dayOfWeek === dayOfWeek
      }
      return h.date === checkDateStr
    })

    return holiday ? holiday.reason : ''
  }

  return (
    <div className={`p-5 rounded-[24px] border ${
      theme === 'dark'
        ? 'bg-gray-800 border-gray-700 text-white'
        : 'bg-white border-gray-100 text-[#0F1E4A]'
    } shadow-lg max-w-sm mx-auto select-none transition-all duration-300`}>
      
      {/* Month/Year Navigation Header */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-1.5">
          <select
            value={currentMonth}
            onChange={(e) => handleMonthChange(Number(e.target.value))}
            className={`px-2 py-1 text-sm font-bold rounded-lg border focus:outline-none transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-[#DFA7FF]/40'
                : 'bg-white border-gray-200 text-[#0F1E4A] focus:ring-purple-600/40'
            }`}
          >
            {months.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>

          <select
            value={currentYear}
            onChange={(e) => handleYearChange(Number(e.target.value))}
            className={`px-2 py-1 text-sm font-bold rounded-lg border focus:outline-none transition-all cursor-pointer ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white focus:ring-[#DFA7FF]/40'
                : 'bg-white border-gray-200 text-[#0F1E4A] focus:ring-purple-600/40'
            }`}
          >
            {yearsRange.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={handlePrevMonth}
            className={`p-1.5 rounded-lg border hover:scale-105 active:scale-95 transition-all ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-100 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className={`p-1.5 rounded-lg border hover:scale-105 active:scale-95 transition-all ${
              theme === 'dark'
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-100 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {daysOfWeek.map((d) => (
          <div key={d} className="text-xs font-bold text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-sm font-medium">
        {/* Leading empty slots */}
        {Array.from({ length: firstDayIndex }).map((_, idx) => (
          <div key={`empty-${idx}`} className="py-2.5"></div>
        ))}

        {/* Month days */}
        {Array.from({ length: daysInMonth }).map((_, idx) => {
          const day = idx + 1
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const disabled = isDateDisabled(day)
          const isSelected = selectedDate === dateStr
          const reason = getHolidayReason(day)

          return (
            <button
              key={`day-${day}`}
              type="button"
              disabled={disabled}
              onClick={() => onChange(dateStr)}
              title={reason || undefined}
              className={`py-2 rounded-xl text-center transition-all duration-200 outline-none relative group ${
                isSelected
                  ? `${activeStyle.bg} text-white font-bold shadow-md shadow-black/10 scale-105`
                  : disabled
                  ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed line-through opacity-50'
                  : `${activeStyle.bgHover} ${
                      theme === 'dark' ? 'text-gray-100' : 'text-[#0F1E4A]'
                    } hover:scale-105`
              }`}
            >
              {day}
              {/* Subtle underline indicator for current day */}
              {today.getDate() === day &&
                today.getMonth() === currentMonth &&
                today.getFullYear() === currentYear &&
                !isSelected && (
                  <span className={`absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${activeStyle.bg}`}></span>
                )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
