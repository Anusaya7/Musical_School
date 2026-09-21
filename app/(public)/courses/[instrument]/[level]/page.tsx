import { getCourseByInstrumentAndLevel } from '@/lib/db'
import CourseDetailsClient from './CourseDetailsClient'
import { notFound } from 'next/navigation'
import React from 'react'

interface PageProps {
  params: {
    instrument: string
    level: string
  }
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CourseLevelPage({ params }: PageProps) {
  const { instrument, level } = params

  // Fetch course details from database
  const courseDetails = await getCourseByInstrumentAndLevel(instrument, level)

  if (!courseDetails) {
    // Saxophone has status Upcoming/Coming Soon with no levels
    if (instrument.toLowerCase() === 'saxophone') {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#FAFBFF] text-[#0F1E4A]">
          <div className="text-center p-8 max-w-sm bg-white rounded-[24px] border border-gray-100 shadow-xl">
            <span className="inline-block px-4 py-1.5 rounded-full border border-amber-100 bg-amber-50 text-amber-600 text-[10px] font-bold tracking-wider uppercase mb-4">
              Coming Soon
            </span>
            <h1 className="mb-4 text-2xl font-black">Saxophone Classes</h1>
            <p className="mb-8 text-xs text-slate-500 font-semibold leading-relaxed">
              Our Saxophone program is currently under development. Stay tuned for class announcements and registration openings!
            </p>
            <a href="/courses" className="btn-premium-base btn-premium-gradient inline-flex items-center justify-center w-full h-12 text-xs font-bold">
              Browse Other Programs
            </a>
          </div>
        </div>
      )
    }

    notFound()
  }

  const levelsList = ['Beginner', 'Intermediate', 'Advanced']

  return (
    <CourseDetailsClient
      course={courseDetails}
      levelsList={levelsList}
      instrumentSlug={instrument}
    />
  )
}
