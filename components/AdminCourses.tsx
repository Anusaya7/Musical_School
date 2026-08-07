'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Edit,
  Sliders,
  Trash2,
  Plus,
  Search,
  CornerUpLeft
} from 'lucide-react'

interface AdminCoursesProps {
  courses: any[]
  instruments: any[]
  students: any[]
  loadDatabaseData: () => Promise<void>
  handleDuplicateCourse: (course: any) => Promise<void>
  handleDeleteCourse: (id: string) => Promise<void>
  setIsAddCourseOpen: (open: boolean) => void
  setEditingCourse: (course: any) => void
  setCourseTitle: (val: string) => void
  setCourseCategory: (val: string) => void
  setCourseLevel: (val: string) => void
  setCoursePrice: (val: number) => void
  setCourseDuration: (val: string) => void
  setCourseDescription: (val: string) => void
  setCourseInstructorName: (val: string) => void
  setCourseDiscountPrice: (val: number) => void
  setCourseHasCertificate: (val: boolean) => void
  setCourseFeatured: (val: boolean) => void
  setCourseUpcoming: (val: boolean) => void
  setCourseDemoVideo: (val: string) => void
  setCourseSeoTitle: (val: string) => void
  setCourseSeoDescription: (val: string) => void
  setCourseMaxStudents: (val: number) => void
  setCourseDifficulty: (val: string) => void
  setCourseLanguage: (val: string) => void
  setCourseStatus: (val: string) => void
  setCourseThumbnail: (val: string) => void
  setCatId: (val: string) => void
  setCatName: (val: string) => void
  setCatDescription: (val: string) => void
  setCatImage: (val: string) => void
  setCatIcon: (val: string) => void
  setCatStatus: (val: 'Active' | 'Upcoming' | 'Inactive') => void
  setCatIsVisible: (val: boolean) => void
  setCatStartingPrice: (val: number) => void
  setCatLevels: (val: string[]) => void
  setEditingCategory: (cat: any) => void
  setIsAddCategoryOpen: (open: boolean) => void
}

export default function AdminCourses({
  courses,
  instruments,
  students,
  loadDatabaseData,
  handleDuplicateCourse,
  handleDeleteCourse,
  setIsAddCourseOpen,
  setEditingCourse,
  setCourseTitle,
  setCourseCategory,
  setCourseLevel,
  setCoursePrice,
  setCourseDuration,
  setCourseDescription,
  setCourseInstructorName,
  setCourseDiscountPrice,
  setCourseHasCertificate,
  setCourseFeatured,
  setCourseUpcoming,
  setCourseDemoVideo,
  setCourseSeoTitle,
  setCourseSeoDescription,
  setCourseMaxStudents,
  setCourseDifficulty,
  setCourseLanguage,
  setCourseStatus,
  setCourseThumbnail,
  setCatId,
  setCatName,
  setCatDescription,
  setCatImage,
  setCatIcon,
  setCatStatus,
  setCatIsVisible,
  setCatStartingPrice,
  setCatLevels,
  setEditingCategory,
  setIsAddCategoryOpen
}: AdminCoursesProps) {
  const [courseSearch, setCourseSearch] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [expandedInstrument, setExpandedInstrument] = useState<string | null>('piano')

  // 1. Calculations for Statistics
  const totalInstruments = instruments.length
  const publishedInstruments = instruments.filter(i => i.status === 'Active' || i.status === 'ACTIVE').length
  const upcomingInstruments = instruments.filter(i => i.status === 'Upcoming' || i.status === 'COMING_SOON').length
  const publishedCourses = courses.filter(c => c.status === 'Published' || c.status === 'PUBLISHED').length
  const draftCourses = courses.filter(c => c.status === 'Draft' || c.status === 'DRAFT').length

  // 2. Filtered Instruments according to search and selectedFilter
  const query = courseSearch.toLowerCase().trim()
  const filteredInstruments = instruments.filter(inst => {
    // Filter by Status (Published/Upcoming)
    if (selectedFilter === 'Published') {
      return inst.status === 'Active' || inst.status === 'ACTIVE'
    }
    if (selectedFilter === 'Upcoming') {
      return inst.status === 'Upcoming' || inst.status === 'COMING_SOON'
    }
    
    // If filter is a level, we check if this instrument has courses of that level
    if (['Beginner', 'Intermediate', 'Advanced'].includes(selectedFilter)) {
      const instCourses = courses.filter(c => c.category === inst.id)
      const hasLevel = instCourses.some(c => c.level.toLowerCase() === selectedFilter.toLowerCase())
      if (!hasLevel) return false
    }
    
    // Search query filter
    if (query) {
      const matchInstName = inst.name.toLowerCase().includes(query)
      const instCourses = courses.filter(c => c.category === inst.id)
      const matchCourse = instCourses.some(c => 
        c.level.toLowerCase().includes(query) ||
        (c.instructor || '').toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query)
      )
      return matchInstName || matchCourse
    }
    
    return true
  })

  // 3. Helper to get and filter courses under an instrument
  const getInstrumentCourses = (instId: string) => {
    let instCourses = courses.filter(c => c.category === instId)
    
    // Apply Level Filter if selected
    if (['Beginner', 'Intermediate', 'Advanced'].includes(selectedFilter)) {
      instCourses = instCourses.filter(c => c.level.toLowerCase() === selectedFilter.toLowerCase())
    }
    
    // Apply Search query
    if (query) {
      instCourses = instCourses.filter(c => 
        c.level.toLowerCase().includes(query) ||
        (c.instructor || '').toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        instId.toLowerCase().includes(query)
      )
    }
    
    return instCourses
  }

  // 4. Archive Course
  const handleArchiveCourse = async (id: string) => {
    const course = courses.find(c => c.id === id)
    if (!course) return
    if (!confirm('Are you sure you want to archive this course?')) return
    try {
      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...course,
          status: 'Archived'
        })
      })
      if (res.ok) {
        alert('Course archived successfully!')
        await loadDatabaseData()
      } else {
        alert('Failed to archive course')
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn font-sans">
      <div className="flex justify-between items-center border-b border-[#E6EEFF] pb-4">
        <div>
          <h2 className="text-lg font-extrabold text-[#0F1E4A]">LMS Program & Course Levels Redesign</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Manage instruments categories, course levels, and metadata specs</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setCatId('')
              setCatName('')
              setCatDescription('')
              setCatImage('')
              setCatIcon('M9 19V6l12-3v13')
              setCatStatus('Active')
              setCatIsVisible(true)
              setCatStartingPrice(4999)
              setCatLevels(['Beginner', 'Intermediate', 'Advanced'])
              setEditingCategory(null)
              setIsAddCategoryOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#0F1E4A] text-[#0F1E4A] hover:bg-[#FAFBFF] active:scale-[0.98] transition-all text-xs font-bold rounded-2xl shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Instrument
          </button>
          <button
            onClick={() => {
              setEditingCourse(null)
              setCourseTitle('')
              setCoursePrice(4999)
              setCourseDescription('')
              setCourseDiscountPrice(0)
              setCourseHasCertificate(true)
              setCourseFeatured(false)
              setCourseUpcoming(false)
              setCourseDemoVideo('')
              setCourseSeoTitle('')
              setCourseSeoDescription('')
              setCourseMaxStudents(30)
              setCourseDifficulty('Medium')
              setCourseLanguage('English')
              setCourseStatus('Published')
              setCourseThumbnail('')
              setIsAddCourseOpen(true)
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0F1E4A] text-white hover:bg-[#1a2d61] active:scale-[0.98] transition-all text-xs font-bold rounded-2xl shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Course
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mb-6 font-bold text-xs">
        <div className="bg-[#FAFBFF] border border-[#E6EEFF] rounded-[20px] p-5 text-center space-y-1">
          <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Total Instruments</span>
          <span className="text-xl font-black text-[#0F1E4A]">{totalInstruments}</span>
        </div>
        <div className="bg-[#FAFBFF] border border-[#E6EEFF] rounded-[20px] p-5 text-center space-y-1">
          <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Published Instruments</span>
          <span className="text-xl font-black text-[#0F1E4A]">{publishedInstruments}</span>
        </div>
        <div className="bg-[#FAFBFF] border border-[#E6EEFF] rounded-[20px] p-5 text-center space-y-1">
          <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Upcoming Instruments</span>
          <span className="text-xl font-black text-[#D97706]">{upcomingInstruments}</span>
        </div>
        <div className="bg-[#FAFBFF] border border-[#E6EEFF] rounded-[20px] p-5 text-center space-y-1">
          <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Published Courses</span>
          <span className="text-xl font-black text-emerald-600">{publishedCourses}</span>
        </div>
        <div className="bg-[#FAFBFF] border border-[#E6EEFF] rounded-[20px] p-5 text-center space-y-1">
          <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Draft Courses</span>
          <span className="text-xl font-black text-slate-400">{draftCourses}</span>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-[#FAFBFF] p-5 rounded-[24px] border border-[#E6EEFF]">
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            placeholder="Search instrument, level, teacher..."
            className="w-full pl-10 pr-4 py-2.5 border border-[#E6EEFF] bg-white rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mr-2">Filters:</span>
          {['All', 'Published', 'Upcoming', 'Beginner', 'Intermediate', 'Advanced'].map((filterName) => (
            <button
              key={filterName}
              onClick={() => setSelectedFilter(filterName)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border relative ${
                selectedFilter === filterName
                  ? 'bg-[#0F1E4A] border-[#0F1E4A] text-white shadow-sm'
                  : 'bg-white border-[#E6EEFF] text-slate-600 hover:bg-[#FAFBFF]'
              }`}
            >
              {filterName}
            </button>
          ))}
        </div>
      </div>

      {/* Collapsible Accordion Instrument Cards */}
      {filteredInstruments.length === 0 ? (
        <div className="rounded-[24px] border border-gray-100 bg-[#FAFBFF] py-20 text-center shadow-sm">
          <p className="text-sm text-slate-500 font-medium">No instruments or courses found matching search/filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInstruments.map((inst) => {
            const instCourses = getInstrumentCourses(inst.id)
            const isUpcoming = inst.status === 'Upcoming' || inst.status === 'COMING_SOON'
            const isExpanded = expandedInstrument === inst.id
            
            // Emoji lookup mapping
            const emojiMap: Record<string, string> = {
              piano: '🎹',
              guitar: '🎸',
              drums: '🥁',
              vocals: '🎤',
              violin: '🎻',
              'music-theory': '📖',
              'bass-guitar': '🎸',
              saxophone: '🎷'
            }
            const emoji = emojiMap[inst.id] || '🎵'

            return (
              <div 
                key={inst.id} 
                className="border border-[#E6EEFF] rounded-[24px] overflow-hidden bg-white shadow-[0_2px_8px_rgba(94,168,255,0.02)] hover:shadow-[0_4px_16px_rgba(94,168,255,0.04)] transition-all"
              >
                {/* Header/Card Row */}
                <div 
                  onClick={() => {
                    if (!isUpcoming) {
                      setExpandedInstrument(isExpanded ? null : inst.id)
                    }
                  }}
                  className={`p-5 flex items-center justify-between gap-4 select-none ${
                    isUpcoming ? 'cursor-not-allowed bg-slate-50/40' : 'cursor-pointer hover:bg-slate-50/50'
                  } transition-all`}
                >
                  <div className="flex items-center gap-4">
                    {/* Instrument Thumbnail Image / Fallback */}
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-[#E6EEFF]">
                      {inst.image ? (
                        <img 
                          src={inst.image} 
                          alt={inst.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to emoji if image fails to load
                            (e.target as HTMLElement).style.display = 'none'
                          }}
                        />
                      ) : null}
                      <span className="absolute text-2xl">{emoji}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-extrabold text-[#0F1E4A] flex items-center gap-1.5">
                          {emoji} {inst.name}
                        </h3>
                        {isUpcoming ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-[#FACC15] bg-[#FFF7E6] text-[#D97706] inline-flex items-center gap-1">
                            🚀 Coming Soon
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border border-emerald-200 bg-emerald-50 text-emerald-700">
                            Published
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-bold mt-1">
                        {isUpcoming ? '0 Courses' : `${instCourses.length} Course${instCourses.length === 1 ? '' : 's'}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {isUpcoming ? (
                      <button
                        disabled
                        className="px-3.5 py-1.5 border border-slate-200 text-slate-400 font-bold text-xs rounded-xl opacity-50 cursor-not-allowed"
                        title="Edit Course Levels disabled for upcoming instruments"
                      >
                        Edit Levels
                      </button>
                    ) : (
                      <div className="text-slate-400">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Collapsible Accordion Content */}
                {!isUpcoming && isExpanded && (
                  <div className="bg-white border-t border-[#E6EEFF]">
                    {instCourses.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-400 font-bold">
                        No courses found for this instrument.
                      </div>
                    ) : (
                      <div className="divide-y divide-[#E6EEFF]">
                        {instCourses.map((course) => (
                          <div key={course.id} className="p-5 bg-slate-50/20 hover:bg-slate-50/50 transition-all">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                              <div className="space-y-1.5">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                    course.level === 'Beginner' ? 'bg-[#E6FDF5] border-[#A7F3D0] text-[#065F46]' :
                                    course.level === 'Intermediate' ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]' :
                                    'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]'
                                  }`}>
                                    {course.level}
                                  </span>
                                  <span className="text-xs text-[#0F1E4A] font-extrabold">
                                    {course.title}
                                  </span>
                                  <span className="text-xs text-slate-400 font-medium">
                                    | Price: ₹{course.price.toLocaleString('en-IN')}
                                  </span>
                                  <span className="text-xs text-slate-400 font-medium">
                                    | {course.duration}
                                  </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-1 text-[11px] text-slate-500 font-semibold">
                                  <div>
                                    <span className="text-slate-400 font-medium">Instructor:</span> {course.instructor || 'Ajinkya Amrule'}
                                  </div>
                                  <div>
                                    <span className="text-slate-400 font-medium">Status:</span>{' '}
                                    <span className={course.status === 'Published' ? 'text-emerald-600' : 'text-slate-500'}>
                                      {course.status || 'Published'}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 font-medium">Language:</span> {course.language || 'English'}
                                  </div>
                                  <div>
                                    <span className="text-slate-400 font-medium">Certificate:</span> {course.certificateAvailable !== false ? 'Available' : 'No'}
                                  </div>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                                <Link
                                  href={`/courses/${inst.slug}/${course.level.toLowerCase()}`}
                                  target="_blank"
                                  className="text-[#5EA8FF] hover:text-[#3b82f6] font-bold text-xs flex items-center gap-1 hover:underline"
                                >
                                  <Eye className="w-3.5 h-3.5" /> View
                                </Link>
                                <button
                                  onClick={() => {
                                    setEditingCourse(course)
                                    setCourseTitle(course.title)
                                    setCourseCategory(course.category)
                                    setCourseLevel(course.level)
                                    setCoursePrice(course.price)
                                    setCourseDuration(course.duration)
                                    setCourseDescription(course.description || '')
                                    setCourseInstructorName(course.instructor || 'Ajinkya Amrule')
                                    setCourseDiscountPrice(course.discountPrice || 0)
                                    setCourseHasCertificate(course.certificateAvailable !== false)
                                    setCourseFeatured(!!course.featured)
                                    setCourseUpcoming(!!course.upcoming)
                                    setCourseDemoVideo(course.demoVideo || '')
                                    setCourseSeoTitle(course.seoTitle || '')
                                    setCourseSeoDescription(course.seoDescription || '')
                                    setCourseMaxStudents(course.maxStudents || 30)
                                    setCourseDifficulty(course.difficulty || 'Medium')
                                    setCourseLanguage(course.language || 'English')
                                    setCourseStatus(course.status || 'Published')
                                    setCourseThumbnail(course.thumbnail || '')
                                    setIsAddCourseOpen(true)
                                  }}
                                  className="text-[#0F1E4A] hover:text-black font-bold text-xs flex items-center gap-1 hover:underline"
                                >
                                  <Edit className="w-3.5 h-3.5" /> Edit
                                </button>
                                <button
                                  onClick={() => handleDuplicateCourse(course)}
                                  className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1 hover:underline"
                                >
                                  <CornerUpLeft className="w-3.5 h-3.5" /> Duplicate
                                </button>
                                <button
                                  onClick={() => handleArchiveCourse(course.id)}
                                  className="text-amber-600 hover:text-amber-800 font-bold text-xs flex items-center gap-1 hover:underline"
                                >
                                  <Sliders className="w-3.5 h-3.5" /> Archive
                                </button>
                                <button
                                  onClick={() => handleDeleteCourse(course.id)}
                                  className="text-red-550 hover:text-red-700 font-bold text-xs flex items-center gap-1 hover:underline"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
