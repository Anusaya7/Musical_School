import { redirect } from 'next/navigation'

interface PageProps {
  params: {
    instrument: string
  }
}

export default function FallbackCoursePage({ params }: PageProps) {
  const { instrument } = params

  if (!instrument) {
    redirect('/courses')
  }

  // Parse legacy URL slug format (e.g. "piano-beginner" or "music-theory" to instrument and level)
  const parts = instrument.toLowerCase().split('-')
  const levels = ['beginner', 'intermediate', 'advanced']

  let parsedInstrument = instrument.toLowerCase()
  let level = 'beginner'

  const lastPart = parts[parts.length - 1]
  if (levels.includes(lastPart)) {
    level = lastPart
    parsedInstrument = parts.slice(0, parts.length - 1).join('-')
  }

  redirect(`/courses/${parsedInstrument}/${level}`)
}
