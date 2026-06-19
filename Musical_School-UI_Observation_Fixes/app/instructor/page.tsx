'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Plus,
  Upload,
  Clock,
  Sparkles,
  ChevronRight,
  Send,
  CheckCircle,
  Award,
  Video,
  Eye,
  Trash2,
  Calendar,
  Star,
  Bell,
  Sliders,
  Menu,
  X
} from 'lucide-react'

export default function InstructorDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Interactive Dynamic States
  const [courses, setCourses] = useState([
    { id: 'c1', title: 'Complete Piano Mastery', category: 'Piano', price: 4999, students: 45, rating: 4.9, lessons: 12, status: 'Published', duration: '3 Months' },
    { id: 'c2', title: 'Guitar Fundamentals', category: 'Guitar', price: 3999, students: 38, rating: 4.8, lessons: 8, status: 'Published', duration: '3 Months' },
    { id: 'c3', title: 'Advanced Piano Techniques', category: 'Piano', price: 5999, students: 37, rating: 4.7, lessons: 10, status: 'Published', duration: '3 Months' },
  ])

  const [students, setStudents] = useState([
    { id: 's1', name: 'Rahul Sharma', email: 'rahul@gmail.com', course: 'Complete Piano Mastery', progress: 85, lastActive: '2 hours ago', status: 'Active' },
    { id: 's2', name: 'Priya Patel', email: 'priya@patel.com', course: 'Guitar Fundamentals', progress: 72, lastActive: '1 day ago', status: 'Active' },
    { id: 's3', name: 'Amit Kumar', email: 'amit.k@yahoo.com', course: 'Advanced Piano Techniques', progress: 90, lastActive: '3 hours ago', status: 'Active' },
    { id: 's4', name: 'Sneha Reddy', email: 'sneha@reddy.me', course: 'Complete Piano Mastery', progress: 45, lastActive: '5 days ago', status: 'Inactive' },
    { id: 's5', name: 'Vikram Singh', email: 'vikram.s@outlook.com', course: 'Guitar Fundamentals', progress: 95, lastActive: '1 hour ago', status: 'Active' }
  ])

  const [assignments, setAssignments] = useState([
    { id: 'as1', title: 'Piano Scale Practice', course: 'Complete Piano Mastery', dueDate: '2026-06-25', submissions: 12, status: 'Active' },
    { id: 'as2', title: 'Guitar Chord Progression', course: 'Guitar Fundamentals', dueDate: '2026-06-28', submissions: 9, status: 'Active' },
    { id: 'as3', title: 'Advanced Finger Independence', course: 'Advanced Piano Techniques', dueDate: '2026-07-02', submissions: 0, status: 'Upcoming' },
  ])

  const [recentActivities, setRecentActivities] = useState([
    { id: 'a1', desc: 'New Student Joined', detail: 'Aarav Mehta registered for Piano Mastery', time: '10 mins ago', icon: '👨‍🎓' },
    { id: 'a2', desc: 'Assignment Submitted', detail: 'Isha Sharma submitted scales homework', time: '1 hour ago', icon: '📝' },
    { id: 'a3', desc: 'New Review Received', detail: '5-star review from Rohan Sen', time: '3 hours ago', icon: '⭐' },
    { id: 'a4', desc: 'Lesson Uploaded', detail: 'Uploaded Lesson 4: Finger Posture video', time: '1 day ago', icon: '🎥' },
    { id: 'a5', desc: 'Course Updated', detail: 'Guitar Fundamentals syllabus updated', time: '2 days ago', icon: '📚' }
  ])

  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'Rahul Sharma', text: 'Can you explain the 7th chord progression in more detail?', time: '2 hours ago', unread: true, avatar: 'RS' },
    { id: 'm2', sender: 'Priya Patel', text: 'Thank you for the feedback on my assignment!', time: '1 day ago', unread: false, avatar: 'PP' },
    { id: 'm3', sender: 'Amit Kumar', text: 'When will the next lesson be available?', time: '3 days ago', unread: false, avatar: 'AK' },
  ])

  // Chat Interface state
  const [selectedStudentChat, setSelectedStudentChat] = useState<string>('s1')
  const [newMessageText, setNewMessageText] = useState('')
  const [chatMessages, setChatMessages] = useState<{ [key: string]: any[] }>({
    s1: [
      { id: 'c1', sender: 'Rahul Sharma', text: 'Can you explain the 7th chord progression in more detail?', time: '2 hours ago' },
      { id: 'c2', sender: 'Ajinkya Amrule', text: 'Sure! Let\'s discuss this in our class today, or you can practice playing the major 7th chord using your index, middle, ring, and pinky fingers.', time: '1 hour ago' },
    ],
    s2: [
      { id: 'c3', sender: 'Priya Patel', text: 'Thank you for the feedback on my assignment!', time: '1 day ago' },
    ],
    s3: [
      { id: 'c4', sender: 'Amit Kumar', text: 'When will the next lesson be available?', time: '3 days ago' },
    ],
    s4: [
      { id: 'c5', sender: 'Sneha Reddy', text: 'Hello Sir, I won\'t be able to make it to the class tomorrow.', time: '4 days ago' },
    ],
    s5: [
      { id: 'c6', sender: 'Vikram Singh', text: 'I completed the assignment. Please check.', time: '5 days ago' }
    ]
  })

  // Quick Action Modal states
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false)
  const [isUploadLessonOpen, setIsUploadLessonOpen] = useState(false)
  const [isCreateAssignmentOpen, setIsCreateAssignmentOpen] = useState(false)

  // Form input states
  const [courseTitle, setCourseTitle] = useState('')
  const [courseCategory, setCourseCategory] = useState('Piano')
  const [coursePrice, setCoursePrice] = useState(3999)
  const [courseLevel, setCourseLevel] = useState('Beginner')
  const [courseDuration, setCourseDuration] = useState('3 Months')

  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonCourseId, setLessonCourseId] = useState('c1')
  const [lessonUrl, setLessonUrl] = useState('')
  const [lessonDesc, setLessonDesc] = useState('')

  const [assignmentTitle, setAssignmentTitle] = useState('')
  const [assignmentCourseId, setAssignmentCourseId] = useState('c1')
  const [assignmentDueDate, setAssignmentDueDate] = useState('')

  // Profile Form states
  const [profileName, setProfileName] = useState('Ajinkya Amrule')
  const [profileEmail, setProfileEmail] = useState('ajinkya@2ndinversionmusic.com')
  const [profileBio, setProfileBio] = useState('Senior Music Instructor at 2nd Inversion. Over 10 years of experience teaching classical piano, acoustic guitar, and vocals. Trinity College London certified.')
  const [expertise, setExpertise] = useState('Piano, Guitar, Vocals')
  const [experience, setExperience] = useState('10+ Years')

  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [pushNotifications, setPushNotifications] = useState(true)

  // Today's Classes List (static requested list)
  const todayClasses = [
    { id: 'tc1', time: '10:00 AM', course: 'Piano Mastery', instrument: '🎹' },
    { id: 'tc2', time: '12:30 PM', course: 'Guitar Fundamentals', instrument: '🎸' },
    { id: 'tc3', time: '04:00 PM', course: 'Vocal Training', instrument: '🎤' }
  ]

  // Dynamic Statistics
  const totalCourses = courses.length
  const totalStudents = 120
  const totalAssignmentsCount = 15 + (assignments.length - 3)
  const averageRating = 4.8

  // Logout Handler
  const handleLogout = async () => {
    localStorage.removeItem('user')
    await signOut({ redirect: true, callbackUrl: '/login' })
  }

  // Create Course Action
  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseTitle) return
    const newCourse = {
      id: `course-${Date.now()}`,
      title: courseTitle,
      category: courseCategory,
      price: Number(coursePrice),
      students: 0,
      rating: 5.0,
      lessons: 0,
      status: 'Draft',
      duration: courseDuration
    }
    setCourses(prev => [...prev, newCourse])
    
    // Add to recent activity
    const newAct = {
      id: `act-${Date.now()}`,
      desc: 'Course Created',
      detail: `New course draft: "${courseTitle}" created`,
      time: 'Just now',
      icon: '📚'
    }
    setRecentActivities(prev => [newAct, ...prev.slice(0, 4)])

    setIsCreateCourseOpen(false)
    setCourseTitle('')
    setActiveTab('courses')
  }

  // Upload Lesson Action
  const handleUploadLesson = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lessonTitle) return
    
    setCourses(prev => prev.map(c => c.id === lessonCourseId ? { ...c, lessons: c.lessons + 1 } : c))

    const targetCourse = courses.find(c => c.id === lessonCourseId)
    const newAct = {
      id: `act-${Date.now()}`,
      desc: 'Lesson Uploaded',
      detail: `Lesson "${lessonTitle}" uploaded to ${targetCourse?.title || 'Course'}`,
      time: 'Just now',
      icon: '🎥'
    }
    setRecentActivities(prev => [newAct, ...prev.slice(0, 4)])

    setIsUploadLessonOpen(false)
    setLessonTitle('')
    setLessonUrl('')
    setLessonDesc('')
    setActiveTab('courses')
  }

  // Create Assignment Action
  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!assignmentTitle || !assignmentDueDate) return

    const targetCourse = courses.find(c => c.id === assignmentCourseId)
    const newAssignment = {
      id: `as-${Date.now()}`,
      title: assignmentTitle,
      course: targetCourse?.title || 'General Course',
      dueDate: assignmentDueDate,
      submissions: 0,
      status: 'Active'
    }
    setAssignments(prev => [...prev, newAssignment])

    const newAct = {
      id: `act-${Date.now()}`,
      desc: 'Assignment Created',
      detail: `New assignment: "${assignmentTitle}" assigned`,
      time: 'Just now',
      icon: '📝'
    }
    setRecentActivities(prev => [newAct, ...prev.slice(0, 4)])

    setIsCreateAssignmentOpen(false)
    setAssignmentTitle('')
    setAssignmentDueDate('')
    setActiveTab('assignments')
  }

  // Send Chat message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessageText.trim()) return

    const newMsg = {
      id: `chat-${Date.now()}`,
      sender: 'Ajinkya Amrule',
      text: newMessageText,
      time: 'Just now'
    }

    setChatMessages(prev => ({
      ...prev,
      [selectedStudentChat]: [...(prev[selectedStudentChat] || []), newMsg]
    }))

    // Update messages preview
    const targetStudent = students.find(s => s.id === selectedStudentChat)
    if (targetStudent) {
      setMessages(prev => [
        {
          id: `m-${Date.now()}`,
          sender: targetStudent.name,
          text: `You: ${newMessageText}`,
          time: 'Just now',
          unread: false,
          avatar: targetStudent.name.split(' ').map(n => n[0]).join('')
        },
        ...prev.filter(m => m.sender !== targetStudent.name).slice(0, 2)
      ])
    }

    setNewMessageText('')
  }

  // Navigation config
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#0F1E4A] font-sans flex flex-col xl:flex-row">
      
      {/* Mobile Top Header Bar */}
      <div className="xl:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-[#E6EEFF] z-30">
        <Link 
          href="/" 
          className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#F8FBFF] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
        >
          <span className="text-xl">🎵</span>
          <div>
            <span className="font-extrabold text-sm text-[#0F1E4A] leading-tight block">
              2nd Inversion
            </span>
            <span className="text-[9px] text-[#5EA8FF] font-extrabold uppercase tracking-wider block mt-0.5">Instructor Portal</span>
          </div>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 border border-[#E6EEFF] rounded-xl text-[#0F1E4A] hover:bg-[#FAFBFF] focus:outline-none"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* SIDEBAR PANEL */}
      <aside className={`
        fixed xl:sticky top-0 bottom-0 left-0 w-[280px] bg-white border-r border-[#E6EEFF] p-6 
        flex flex-col justify-between overflow-y-auto z-40 transition-transform duration-300 ease-out h-screen
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Header Branding */}
          <div className="pb-3 border-b border-[#E6EEFF]">
            <Link 
              href="/" 
              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-[#F8FBFF] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
            >
              <span className="text-2xl">🎵</span>
              <div>
                <h1 className="text-sm font-extrabold text-[#0F1E4A] leading-tight">
                  2nd Inversion
                </h1>
                <p className="text-[10px] text-[#5EA8FF] font-extrabold uppercase tracking-wider mt-0.5">Instructor Portal</p>
              </div>
            </Link>
          </div>

          {/* Instructor Profile Details */}
          <div className="bg-white border-2 border-[#E6EEFF] rounded-[20px] p-4 shadow-[0_10px_30px_rgba(94,168,255,0.04)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]" />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white font-black text-sm shadow-sm select-none">
                AA
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-[#0F1E4A] leading-tight">{profileName}</h4>
                <p className="text-[9px] font-bold text-slate-400 mt-0.5">{expertise.split(',')[0]} Instructor</p>
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-[#5EA8FF] mt-1 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  🟢 Online
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsSidebarOpen(false)
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all border border-transparent ${
                  activeTab === item.id 
                    ? 'bg-[#FAFBFF] border-[#E6EEFF] text-[#5EA8FF] shadow-sm font-extrabold' 
                    : 'text-[#0F1E4A] hover:bg-[#FAFBFF] hover:border-[#E6EEFF]'
                }`}
              >
                <item.icon className={`w-4 h-4 ${activeTab === item.id ? 'text-[#5EA8FF]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="border-t border-[#E6EEFF] pt-4 mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-extrabold text-[#FF6FAF] hover:bg-red-50/50 hover:border-red-100 border border-transparent transition-all"
          >
            <LogOut className="w-4 h-4 text-[#FF6FAF]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto flex flex-col gap-8 bg-[#FAFBFF]">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6EEFF] pb-6">
          <div>
            <h1 className="text-2xl font-black text-[#0F1E4A] tracking-tight">
              Welcome Back, Ajinkya 👋
            </h1>
            <p className="text-xs text-slate-500 font-bold mt-1">
              Manage your classes and students from one place.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md border border-[#E6EEFF] px-4 py-2.5 rounded-2xl shadow-sm">
            <span className="text-xs font-extrabold text-slate-500">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white font-extrabold text-xs shadow-sm">
              AA
            </div>
          </div>
        </div>

        {/* TAB: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* 4 OVERVIEW CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: Courses */}
              <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">📚 My Courses</span>
                </div>
                <h3 className="text-3xl font-black text-[#0F1E4A] tracking-tight">{totalCourses}</h3>
              </div>

              {/* Card 2: Students */}
              <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">👨‍🎓 Students</span>
                </div>
                <h3 className="text-3xl font-black text-[#0F1E4A] tracking-tight">{totalStudents}</h3>
              </div>

              {/* Card 3: Assignments */}
              <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">📝 Assignments</span>
                </div>
                <h3 className="text-3xl font-black text-[#0F1E4A] tracking-tight">{totalAssignmentsCount}</h3>
              </div>

              {/* Card 4: Rating */}
              <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">⭐ Rating</span>
                </div>
                <h3 className="text-3xl font-black text-[#0F1E4A] tracking-tight">{averageRating}</h3>
              </div>
            </div>

            {/* SECONDARY ROW GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Today's Classes */}
              <div className="lg:col-span-5 bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                <h3 className="text-base font-extrabold text-[#0F1E4A] mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#5EA8FF]" /> Today's Classes
                </h3>
                <p className="text-xs text-slate-400 font-medium mb-6">Your teaching sessions scheduled for today.</p>
                <div className="space-y-4">
                  {todayClasses.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-[#FAFBFF] border border-[#E6EEFF] rounded-2xl hover:border-[#5EA8FF] transition-all">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl p-2 bg-white rounded-xl border border-[#E6EEFF] shadow-sm select-none">{item.instrument}</span>
                        <div>
                          <h4 className="text-xs font-extrabold text-[#0F1E4A]">{item.course}</h4>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Ajinkya Amrule</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#5EA8FF] bg-[#E6EEFF] px-3.5 py-1.5 rounded-xl">{item.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="lg:col-span-7 bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F1E4A] mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FF6FAF]" /> Quick Actions
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mb-6">Shortcuts to manage your courses and tasks.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setIsCreateCourseOpen(true)}
                    className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span className="text-[11px] font-extrabold">Create Course</span>
                  </button>
                  <button
                    onClick={() => setIsUploadLessonOpen(true)}
                    className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-[11px] font-extrabold">Upload Lesson</span>
                  </button>
                  <button
                    onClick={() => setIsCreateAssignmentOpen(true)}
                    className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-[11px] font-extrabold">Create Assignment</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('students')}
                    className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                  >
                    <Users className="w-5 h-5" />
                    <span className="text-[11px] font-extrabold">View Students</span>
                  </button>
                </div>
              </div>

            </div>

            {/* THIRD ROW GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Recent Activity */}
              <div className="lg:col-span-6 bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                <h3 className="text-base font-extrabold text-[#0F1E4A] mb-2">⏱️ Recent Activity</h3>
                <p className="text-xs text-slate-400 font-medium mb-6">Latest classroom updates.</p>
                <div className="space-y-4">
                  {recentActivities.map((act) => (
                    <div key={act.id} className="flex gap-4 items-start text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                      <span className="text-base shrink-0 bg-slate-50 p-2.5 rounded-xl">{act.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-[#0F1E4A] leading-tight">{act.desc}</p>
                        <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{act.detail}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold shrink-0 mt-0.5">{act.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Messages Preview */}
              <div className="lg:col-span-6 bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] flex flex-col justify-between gap-6">
                <div>
                  <h3 className="text-base font-extrabold text-[#0F1E4A] mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#5EA8FF]" /> Messages Preview
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mb-4">Unresolved conversations with students.</p>
                  <div className="space-y-3.5">
                    {messages.map((msg) => (
                      <div key={msg.id} className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-slate-50/70 border border-transparent hover:border-[#E6EEFF] transition-all">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white text-[11px] font-black shadow-sm shrink-0">
                          {msg.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <h4 className="text-xs font-black text-[#0F1E4A]">{msg.sender}</h4>
                            <span className="text-[9px] text-slate-400 font-bold">{msg.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{msg.text}</p>
                        </div>
                        {msg.unread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('messages')}
                  className="w-full py-3 bg-[#FAFBFF] border border-[#E6EEFF] hover:border-[#5EA8FF] hover:bg-[#FAFBFF] text-[#5EA8FF] text-xs font-extrabold rounded-2xl transition-all shadow-sm"
                >
                  View All Messages
                </button>
              </div>

            </div>

          </div>
        )}

        {/* TAB: MY COURSES */}
        {activeTab === 'courses' && (
          <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#E6EEFF] pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#0F1E4A]">My Teaching Courses</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Manage and preview classes and materials</p>
              </div>
              <button
                onClick={() => setIsCreateCourseOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0F1E4A] text-white hover:bg-[#1a2d61] active:scale-[0.98] transition-all text-xs font-bold rounded-2xl shadow-sm"
              >
                <Plus className="w-4 h-4" /> Create Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="border border-[#E6EEFF] rounded-[20px] overflow-hidden hover:border-[#5EA8FF] transition-all bg-[#FAFBFF]">
                  <div className="h-2 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]" />
                  <div className="p-5 space-y-4">
                    <span className="px-2.5 py-1 text-[9px] font-extrabold bg-[#E6EEFF] text-[#5EA8FF] rounded-lg uppercase">{course.category}</span>
                    <h3 className="font-extrabold text-sm text-[#0F1E4A] leading-snug">{course.title}</h3>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500 pt-2 border-t border-[#E6EEFF]">
                      <span>👥 {course.students} Learners</span>
                      <span>⭐ {course.rating}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                      <span>🎥 {course.lessons} Lessons</span>
                      <span className="text-[#FF6FAF] font-black">₹{course.price.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-lg ${
                        course.status === 'Published' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>{course.status}</span>
                      <button
                        onClick={() => {
                          setLessonCourseId(course.id)
                          setIsUploadLessonOpen(true)
                        }}
                        className="text-[10px] font-black text-[#5EA8FF] hover:underline"
                      >
                        + Upload Lesson
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: STUDENTS */}
        {activeTab === 'students' && (
          <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn">
            <div className="border-b border-[#E6EEFF] pb-4">
              <h2 className="text-lg font-extrabold text-[#0F1E4A]">Active Student Directory</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Track student progress and active levels</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Active Course</th>
                    <th className="p-4">Progress</th>
                    <th className="p-4">Last Activity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="text-xs font-extrabold text-[#0F1E4A]">{student.name}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{student.email}</p>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-600">{student.course}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-[#5EA8FF] h-1.5 rounded-full" style={{ width: `${student.progress}%` }} />
                          </div>
                          <span className="text-[10px] font-extrabold text-slate-600">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-400">{student.lastActive}</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase ${
                          student.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'
                        }`}>{student.status}</span>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedStudentChat(student.id)
                            setActiveTab('messages')
                          }}
                          className="px-3.5 py-1.5 bg-[#E6EEFF] text-[#5EA8FF] hover:bg-[#5EA8FF] hover:text-white transition-all text-[10px] font-extrabold rounded-xl"
                        >
                          Message
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: ASSIGNMENTS */}
        {activeTab === 'assignments' && (
          <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-[#E6EEFF] pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-[#0F1E4A]">Assignments & Assessments</h2>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Organize student home tasks and audio reviews</p>
              </div>
              <button
                onClick={() => setIsCreateAssignmentOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0F1E4A] text-white hover:bg-[#1a2d61] active:scale-[0.98] transition-all text-xs font-bold rounded-2xl shadow-sm"
              >
                <Plus className="w-4 h-4" /> Create Assignment
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                    <th className="p-4">Assignment Topic</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Submissions</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-xs font-extrabold text-[#0F1E4A]">{assignment.title}</td>
                      <td className="p-4 text-xs font-bold text-slate-500">{assignment.course}</td>
                      <td className="p-4 text-xs font-semibold text-slate-400">{assignment.dueDate}</td>
                      <td className="p-4 text-xs font-extrabold text-slate-600">{assignment.submissions} submitted</td>
                      <td className="p-4">
                        <span className={`inline-block px-2 py-0.5 rounded-lg text-[9px] font-extrabold uppercase ${
                          assignment.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                        }`}>{assignment.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: MESSAGES */}
        {activeTab === 'messages' && (
          <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] h-[600px] flex flex-col xl:flex-row overflow-hidden animate-fadeIn">
            {/* Chats Directory sidebar */}
            <div className="w-full xl:w-[320px] border-r border-[#E6EEFF] pr-0 xl:pr-6 flex flex-col overflow-y-auto gap-4 shrink-0 pb-4 xl:pb-0">
              <h3 className="font-extrabold text-sm text-[#0F1E4A] pb-2 border-b border-[#E6EEFF]">Conversations</h3>
              <div className="space-y-2 flex-1">
                {students.map((student) => {
                  const latestMsgArr = chatMessages[student.id] || []
                  const latestMsg = latestMsgArr[latestMsgArr.length - 1]
                  return (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudentChat(student.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 ${
                        selectedStudentChat === student.id
                          ? 'bg-[#FAFBFF] border-[#E6EEFF] shadow-sm font-extrabold'
                          : 'border-transparent hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white text-xs font-black shadow-sm shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-extrabold text-[#0F1E4A] truncate">{student.name}</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{latestMsg ? latestMsg.text : 'Start conversation...'}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Chat Box */}
            <div className="flex-1 pl-0 xl:pl-6 flex flex-col justify-between h-full min-w-0 pt-4 xl:pt-0 border-t xl:border-t-0 border-[#E6EEFF]">
              {/* Chat student details */}
              <div className="pb-3 border-b border-[#E6EEFF] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white text-xs font-black shadow-sm">
                  {students.find(s => s.id === selectedStudentChat)?.name.split(' ').map(n => n[0]).join('') || 'AA'}
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#0F1E4A]">{students.find(s => s.id === selectedStudentChat)?.name}</h4>
                  <p className="text-[9px] text-[#5EA8FF] font-bold">Classroom Student</p>
                </div>
              </div>

              {/* Message scroll container */}
              <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
                {(chatMessages[selectedStudentChat] || []).map((chat) => (
                  <div
                    key={chat.id}
                    className={`flex flex-col max-w-[70%] ${
                      chat.sender === 'Ajinkya Amrule' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div className={`p-4 rounded-3xl text-xs font-bold shadow-sm ${
                      chat.sender === 'Ajinkya Amrule'
                        ? 'bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white rounded-br-none'
                        : 'bg-[#FAFBFF] border border-[#E6EEFF] text-[#0F1E4A] rounded-bl-none'
                    }`}>
                      {chat.text}
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold mt-1.5">{chat.time}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChatMessage} className="pt-4 border-t border-[#E6EEFF] flex items-center gap-3">
                <input
                  type="text"
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-[#E6EEFF] rounded-2xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF] bg-[#FAFBFF]"
                />
                <button
                  type="submit"
                  className="p-3 bg-[#0F1E4A] hover:bg-[#1a2d61] text-white rounded-2xl shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-8 animate-fadeIn">
            <div className="border-b border-[#E6EEFF] pb-4">
              <h2 className="text-lg font-extrabold text-[#0F1E4A]">Instructor Bio & Credentials</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Configure your public teacher bio</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Profile Image & Summary */}
              <div className="lg:col-span-4 bg-[#FAFBFF] border border-[#E6EEFF] rounded-[20px] p-6 flex flex-col items-center text-center gap-4 h-fit">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white font-black text-3xl shadow-sm select-none">
                  AA
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#0F1E4A]">{profileName}</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">Senior Music Instructor</p>
                </div>
                <div className="w-full space-y-2 border-t border-[#E6EEFF] pt-4 text-left">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">Expertise:</span>
                    <span className="font-extrabold text-[#0F1E4A]">{expertise.split(',')[0]}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400">Experience:</span>
                    <span className="font-extrabold text-[#0F1E4A]">{experience}</span>
                  </div>
                </div>
              </div>

              {/* Profile Bio Editor Form */}
              <form onSubmit={(e) => { e.preventDefault(); alert('Profile bio saved successfully!'); }} className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Teaching Instruments</label>
                    <input
                      type="text"
                      value={expertise}
                      onChange={(e) => setExpertise(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Years Experience</label>
                    <input
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Biography</label>
                  <textarea
                    rows={4}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0F1E4A] hover:bg-[#1a2d61] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  Save Bio
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-8 animate-fadeIn">
            <div className="border-b border-[#E6EEFF] pb-4">
              <h2 className="text-lg font-extrabold text-[#0F1E4A]">Portal & Notification Preferences</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Customize alerts, classroom emails, and interface settings</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Notification Toggles */}
              <div className="bg-[#FAFBFF] border border-[#E6EEFF] rounded-[20px] p-6 space-y-4">
                <h3 className="font-extrabold text-[#0F1E4A] flex items-center gap-2 text-xs pb-2 border-b border-[#E6EEFF]">
                  <Sliders className="w-4 h-4 text-[#5EA8FF]" /> Notification Triggers
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Email Notification on Submissions</span>
                  <button
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`px-4 py-2 text-[10px] font-extrabold uppercase rounded-xl transition-all ${
                      emailNotifications ? 'bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {emailNotifications ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">SMS Alerts for Direct Messages</span>
                  <button
                    onClick={() => setSmsNotifications(!smsNotifications)}
                    className={`px-4 py-2 text-[10px] font-extrabold uppercase rounded-xl transition-all ${
                      smsNotifications ? 'bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {smsNotifications ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Desktop Push Notifications</span>
                  <button
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`px-4 py-2 text-[10px] font-extrabold uppercase rounded-xl transition-all ${
                      pushNotifications ? 'bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {pushNotifications ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              {/* Classroom Hours overview */}
              <div className="bg-[#FAFBFF] border border-[#E6EEFF] rounded-[20px] p-6 space-y-4">
                <h3 className="font-extrabold text-[#0F1E4A] flex items-center gap-2 text-xs pb-2 border-b border-[#E6EEFF]">
                  <Clock className="w-4 h-4 text-[#FF6FAF]" /> Operating Calendar
                </h3>
                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                  Your teaching schedule follows the school operating hours configured by the Academy administrator. If you require scheduling adjustments, please contact Ajinkya Amrule.
                </p>
                <div className="p-4 bg-white border border-[#E6EEFF] rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400">Morning Classes:</span>
                    <span className="font-extrabold text-[#0F1E4A]">04:00 AM - 12:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-400">Evening Classes:</span>
                    <span className="font-extrabold text-[#0F1E4A]">03:00 PM - 09:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* ==================================== MODALS ==================================== */}

      {/* 1. Create Course Modal */}
      {isCreateCourseOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6EEFF] rounded-[24px] max-w-md w-full p-6 space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center border-b border-[#E6EEFF] pb-3">
              <h3 className="font-black text-base text-[#0F1E4A]">Create New Course</h3>
              <button onClick={() => setIsCreateCourseOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Course Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master Classical Guitar"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Category</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  >
                    <option>Piano</option>
                    <option>Guitar</option>
                    <option>Vocals</option>
                    <option>Drums</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Price (INR)</label>
                  <input
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Level</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Duration</label>
                  <input
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white font-extrabold text-xs rounded-xl"
              >
                Create Draft Course
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Upload Lesson Modal */}
      {isUploadLessonOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6EEFF] rounded-[24px] max-w-md w-full p-6 space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center border-b border-[#E6EEFF] pb-3">
              <h3 className="font-black text-base text-[#0F1E4A]">Upload Lesson Material</h3>
              <button onClick={() => setIsUploadLessonOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUploadLesson} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Select Target Course</label>
                <select
                  value={lessonCourseId}
                  onChange={(e) => setLessonCourseId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Lesson Title</label>
                <input
                  type="text"
                  placeholder="e.g. Lesson 5: C-Major Scales and posture"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Video Resource URL</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={lessonUrl}
                  onChange={(e) => setLessonUrl(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Explain practice timings or homework guidelines..."
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white font-extrabold text-xs rounded-xl"
              >
                Upload Lesson
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Create Assignment Modal */}
      {isCreateAssignmentOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6EEFF] rounded-[24px] max-w-md w-full p-6 space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex justify-between items-center border-b border-[#E6EEFF] pb-3">
              <h3 className="font-black text-base text-[#0F1E4A]">Create Audio Assignment</h3>
              <button onClick={() => setIsCreateAssignmentOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAssignment} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Select Course</label>
                <select
                  value={assignmentCourseId}
                  onChange={(e) => setLessonCourseId(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Assignment Title</label>
                <input
                  type="text"
                  placeholder="e.g. Record 2 mins acoustic strumming"
                  value={assignmentTitle}
                  onChange={(e) => setAssignmentTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 uppercase mb-1">Due Date</label>
                <input
                  type="date"
                  value={assignmentDueDate}
                  onChange={(e) => setAssignmentDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white font-extrabold text-xs rounded-xl"
              >
                Assign to Students
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
