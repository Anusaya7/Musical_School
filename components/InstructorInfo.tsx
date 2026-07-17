'use client'

import React, { useState, useEffect } from 'react'

export default function InstructorInfo() {
  const [instructor, setInstructor] = useState<any>(null)
  const [courseCount, setCourseCount] = useState(0)

  useEffect(() => {
    Promise.all([
      fetch('/api/instructors').then(r => r.json()).catch(() => []),
      fetch('/api/courses').then(r => r.json()).catch(() => [])
    ]).then(([instructors, courses]) => {
      // Find the first active instructor (e.g. Ajinkya Amrule) or default to the first one
      const activeInst = instructors.find((i: any) => i.name === 'Ajinkya Amrule' || i.isActive !== false) || instructors[0]
      if (activeInst) {
        setInstructor(activeInst)
        
        // Count active courses assigned to this instructor
        const assignedCourses = courses.filter((c: any) => c.instructorId === activeInst.id || c.instructor === activeInst.name)
        setCourseCount(assignedCourses.length)
      }
    }).catch(err => console.error('Failed to load instructor info:', err))
  }, [])

  const name = instructor?.name || 'Ajinkya Amrule'
  const role = instructor?.role || 'Senior Music Instructor'
  const bio = instructor?.bio || 'Professional music educator with over 10 years of experience teaching piano, guitar, vocals, and music theory.\nPassionate about helping beginners and advanced learners build confidence, technique, and creativity through structured learning.'
  const experience = instructor?.experience || '10+ Years'
  const studentsCount = instructor?.students || 500
  const avatarPhoto = instructor?.photo || '/images/instructor_portrait.jpg'
  
  // Parse expertise tags
  const expertiseList = instructor?.expertise 
    ? instructor.expertise.split(',').map((e: string) => e.trim()) 
    : ['Piano', 'Guitar', 'Vocals', 'Music Theory']

  const getEmojiForExpertise = (name: string) => {
    const lowercase = name.toLowerCase()
    if (lowercase.includes('piano')) return '🎹'
    if (lowercase.includes('guitar')) return '🎸'
    if (lowercase.includes('vocal') || lowercase.includes('singing')) return '🎤'
    if (lowercase.includes('theory')) return '🎼'
    if (lowercase.includes('drum')) return '🥁'
    if (lowercase.includes('violin')) return '🎻'
    if (lowercase.includes('bass')) return '🎸'
    if (lowercase.includes('saxophone')) return '🎷'
    return '🎵'
  }

  const expertise = expertiseList.map((name: string) => ({
    name,
    icon: getEmojiForExpertise(name)
  }))

  const stats = [
    { title: `${experience} Experience`, icon: '⭐' },
    { title: `${studentsCount}+ Students Trained`, icon: '🎓' },
    { title: `${courseCount} Dynamic Courses`, icon: '📚' }
  ]

  return (
    <section id="instructor" className="py-[120px] bg-gradient-to-b from-[#FAFBFF] to-[#FFFFFF] relative overflow-hidden font-sans">
      {/* Decorative top soft accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#DCEEFF]/20 rounded-br-full opacity-60"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD6E8]/20 rounded-bl-full opacity-60"></div>
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#EFF6FF] px-4 py-1.5 text-xs font-semibold text-[#2563EB] border border-[#EFF6FF]">
            🎵 Expert Music Instructor
          </span>
          <h2 className="mb-4 text-4xl md:text-[48px] font-extrabold text-[#0F1E4A] tracking-tight leading-none">
            Meet Your Instructor
          </h2>
          <p className="mx-auto max-w-[700px] text-sm md:text-base text-slate-500 leading-relaxed font-medium">
            Learn from an experienced music educator passionate about helping students unlock their musical potential.
          </p>
        </div>

        {/* Instructor Card */}
        <div className="max-w-5xl mx-auto bg-white border-2 border-[#DCEEFF] rounded-[28px] p-8 md:p-12 shadow-[0_20px_50px_rgba(15,30,74,0.08)] transition-all duration-300 hover:shadow-[0_25px_60px_rgba(15,30,74,0.12)]">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
            {/* Left: Instructor Photo */}
            <div className="relative flex-shrink-0 w-[320px] h-[380px] group/photo">
              {/* Floating accent circles */}
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-[#DCEEFF] opacity-70 blur-sm pointer-events-none" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-[#FFD6E8] opacity-70 blur-sm pointer-events-none" />
              
              <img
                src={avatarPhoto}
                alt={`${name} - ${role}`}
                loading="lazy"
                className="w-full h-full rounded-[24px] object-cover shadow-md transition-transform duration-300 group-hover/photo:scale-[1.015] ease-out"
              />
            </div>

            {/* Right: Content */}
            <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Header Info */}
              <div className="mb-4 flex flex-col items-center lg:items-start gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-bold text-[#2563EB]">
                  {role}
                </span>
                <h3 className="text-3xl md:text-[34px] font-extrabold text-[#0F1E4A] leading-tight">
                  {name}
                </h3>
              </div>

              {/* Description */}
              <div className="text-slate-500 font-medium text-sm md:text-base leading-relaxed mb-8 flex flex-col gap-4">
                {bio.split('\n').map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              {/* Expertise Tags */}
              <div className="mb-8 w-full">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">Expertise</h4>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {expertise.map((tag) => (
                    <span
                      key={tag.name}
                      className="bg-[#F8FBFF] border-[1.5px] border-[#DCEEFF] rounded-full px-[18px] py-[10px] text-xs md:text-sm font-bold text-[#0F1E4A] flex items-center gap-2 hover:border-[#5EA8FF] hover:bg-white transition-colors duration-200 cursor-default"
                    >
                      <span>{tag.icon}</span>
                      <span>{tag.name}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
                {stats.map((stat) => (
                  <div
                    key={stat.title}
                    className="bg-[#FFFFFF] border border-[#DCEEFF] rounded-[16px] p-4 flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <span className="text-2xl flex-shrink-0">{stat.icon}</span>
                    <span className="text-xs md:text-sm font-bold text-[#0F1E4A] leading-tight">
                      {stat.title}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start w-full">
                <a
                  href="/contact"
                  className="btn-premium-base btn-premium-gradient px-8 py-3.5 text-sm"
                >
                  Book a Trial Class &rarr;
                </a>
                <a
                  href="/instructor-profile"
                  className="btn-premium-base btn-premium-secondary px-8 py-3.5 text-sm"
                >
                  View Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
