'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ExploreInstruments from '@/components/ExploreInstruments'
import WhyChooseUs from '@/components/WhyChooseUs'
import FeaturedCourses from '@/components/FeaturedCourses'
import ClassSchedule from '@/components/ClassSchedule'
import InstructorInfo from '@/components/InstructorInfo'
import BookingSystem from '@/components/BookingSystem'
import MusicSparkle from '@/components/MusicSparkle'
import MusicBackground from '@/components/MusicBackground'
import CTASection from '@/components/CTASection'
import { useTheme } from '@/contexts/ThemeContext'

export default function Home() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const { theme } = useTheme()

  return (
    <div className={`min-h-screen relative ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <MusicBackground />
      <MusicSparkle />
      <Header />
      <div className="pt-20">
        <Hero />
        <ExploreInstruments />
        <WhyChooseUs />
        <FeaturedCourses />
        <InstructorInfo />
        <ClassSchedule onClassSelect={setSelectedClass} />
        <BookingSystem selectedClass={selectedClass} />
        <CTASection />
      </div>
    </div>
  )
}
