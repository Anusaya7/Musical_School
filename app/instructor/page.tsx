'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import Header from '@/components/Header'
import { 
  Plus, 
  Upload, 
  Users, 
  BookOpen, 
  Video, 
  FileText, 
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  Download,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Award,
  Target,
  Play,
  Pause,
  Filter,
  LayoutDashboard,
  Star,
  CreditCard,
  MessageSquare,
  User,
  LogOut,
  Search,
  X,
  Settings,
  Bell,
  ChevronRight,
  VideoOff,
  UserCheck
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

// Indian Currency Formatter
const formatIndianCurrency = (amount: number) => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
  return formatter.format(amount)
}

// Mock Data
const mockCourses = [
  { 
    id: 1, 
    title: 'Complete Piano Mastery', 
    category: 'Piano', 
    price: 1650, 
    students: 45230, 
    revenue: 74629500, 
    rating: 4.9, 
    status: 'Published',
    avatar: 'CP',
    progress: 85,
    lessons: 120,
    duration: '24 hours'
  },
  { 
    id: 2, 
    title: 'Guitar Fundamentals', 
    category: 'Guitar', 
    price: 1490, 
    students: 32180, 
    revenue: 47948200, 
    rating: 4.8, 
    status: 'Published',
    avatar: 'GF',
    progress: 92,
    lessons: 85,
    duration: '18 hours'
  },
  { 
    id: 3, 
    title: 'Advanced Piano Techniques', 
    category: 'Piano', 
    price: 2050, 
    students: 12890, 
    revenue: 26424500, 
    rating: 4.9, 
    status: 'Published',
    avatar: 'AP',
    progress: 78,
    lessons: 95,
    duration: '20 hours'
  },
  { 
    id: 4, 
    title: 'Electric Guitar Mastery', 
    category: 'Guitar', 
    price: 1650, 
    students: 18920, 
    revenue: 31218000, 
    rating: 4.7, 
    status: 'Draft',
    avatar: 'EG',
    progress: 45,
    lessons: 60,
    duration: '15 hours'
  },
]

const mockStudents = [
  { id: 1, name: 'Rahul Sharma', course: 'Complete Piano Mastery', progress: 85, lastActive: '2 hours ago', status: 'Active', avatar: 'RS' },
  { id: 2, name: 'Priya Patel', course: 'Guitar Fundamentals', progress: 72, lastActive: '1 day ago', status: 'Active', avatar: 'PP' },
  { id: 3, name: 'Amit Kumar', course: 'Advanced Piano Techniques', progress: 90, lastActive: '3 hours ago', status: 'Active', avatar: 'AK' },
  { id: 4, name: 'Sneha Reddy', course: 'Electric Guitar Mastery', progress: 45, lastActive: '5 days ago', status: 'Inactive', avatar: 'SR' },
  { id: 5, name: 'Vikram Singh', course: 'Complete Piano Mastery', progress: 95, lastActive: '1 hour ago', status: 'Active', avatar: 'VS' },
]

const mockAssignments = [
  { id: 1, title: 'Piano Scale Practice', course: 'Complete Piano Mastery', dueDate: '2024-04-20', submissions: 45, status: 'Active' },
  { id: 2, title: 'Guitar Chord Progression', course: 'Guitar Fundamentals', dueDate: '2024-04-18', submissions: 32, status: 'Active' },
  { id: 3, title: 'Advanced Techniques Assessment', course: 'Advanced Piano Techniques', dueDate: '2024-04-25', submissions: 12, status: 'Upcoming' },
]

const mockReviews = [
  { id: 1, student: 'Rahul Sharma', course: 'Complete Piano Mastery', rating: 5, comment: 'Excellent course! Very comprehensive and well-structured.', date: '2024-04-14' },
  { id: 2, student: 'Priya Patel', course: 'Guitar Fundamentals', rating: 4, comment: 'Great content, but could use more practice exercises.', date: '2024-04-13' },
  { id: 3, student: 'Amit Kumar', course: 'Advanced Piano Techniques', rating: 5, comment: 'Amazing instructor! Learned so much from this course.', date: '2024-04-12' },
  { id: 4, student: 'Sneha Reddy', course: 'Electric Guitar Mastery', rating: 4, comment: 'Good course, but some videos need better audio quality.', date: '2024-04-11' },
]

const mockMessages = [
  { id: 1, student: 'Rahul Sharma', message: 'Can you explain the 7th chord progression in more detail?', time: '2 hours ago', unread: true, avatar: 'RS' },
  { id: 2, student: 'Priya Patel', message: 'Thank you for the feedback on my assignment!', time: '1 day ago', unread: false, avatar: 'PP' },
  { id: 3, student: 'Amit Kumar', message: 'When will the next lesson be available?', time: '3 days ago', unread: false, avatar: 'AK' },
  { id: 4, student: 'Rohan Gupta', message: 'I submitted the practice audio recording for review.', time: '4 days ago', unread: true, avatar: 'RG' },
  { id: 5, student: 'Ananya Rao', message: 'The finger exercises are helping a lot.', time: '5 days ago', unread: false, avatar: 'AR' }
]

const earningsData = [
  { month: 'Jan', earnings: 400000, students: 120 },
  { month: 'Feb', earnings: 650000, students: 150 },
  { month: 'Mar', earnings: 900000, students: 180 },
  { month: 'Apr', earnings: 1200000, students: 220 },
  { month: 'May', earnings: 1800000, students: 280 },
  { month: 'Jun', earnings: 2450000, students: 320 },
]

const satisfactionData = [
  { rating: '5 Stars', count: 180 },
  { rating: '4 Stars', count: 45 },
  { rating: '3 Stars', count: 12 },
  { rating: '2 Stars', count: 3 },
  { rating: '1 Star', count: 1 },
]

const studentGrowthData = [
  { month: 'Jan', students: 620 },
  { month: 'Feb', students: 710 },
  { month: 'Mar', students: 850 },
  { month: 'Apr', students: 940 },
  { month: 'May', students: 1010 },
  { month: 'Jun', students: 1092 },
]

const coursePieData = [
  { name: 'Complete Piano Mastery', value: 41, color: '#5EA8FF' },
  { name: 'Guitar Fundamentals', value: 27, color: '#FF6FAF' },
  { name: 'Advanced Piano Techniques', value: 15, color: '#a855f7' },
  { name: 'Others', value: 17, color: '#cbd5e1' },
]

const todayClasses = [
  { id: 1, time: '10:00 AM', duration: '45 mins', student: 'Rahul Sharma', course: 'Complete Piano Mastery', status: 'Upcoming' },
  { id: 2, time: '12:30 PM', duration: '60 mins', student: 'Priya Patel', course: 'Guitar Fundamentals', status: 'Completed' },
  { id: 3, time: '03:00 PM', duration: '45 mins', student: 'Amit Kumar', course: 'Advanced Piano Techniques', status: 'Upcoming' },
  { id: 4, time: '05:30 PM', duration: '60 mins', student: 'Karan Mehra', course: 'Complete Piano Mastery', status: 'Upcoming' },
]

const upcomingClasses = [
  { id: 1, date: 'June 19', time: '11:00 AM', student: 'Vikram Singh', course: 'Piano Scales Practice' },
  { id: 2, date: 'June 19', time: '02:00 PM', student: 'Sneha Reddy', course: 'Guitar Chord progressions' },
  { id: 3, date: 'June 20', time: '10:00 AM', student: 'Ananya Rao', course: 'Piano Finger Exercises' },
]

export default function InstructorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [currentDate, setCurrentDate] = useState(new Date())
  
  // Settings Form States
  const [profileName, setProfileName] = useState('Ajinkya Amrule')
  const [profileEmail, setProfileEmail] = useState('ajinkya@2ndinversionmusic.com')
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210')
  const [profileExpertise, setProfileExpertise] = useState('Piano, Music Theory')
  const [profileExperience, setProfileExperience] = useState('10+ Years')
  const [profileQualifications, setProfileQualifications] = useState('M.Mus, Trinity College London')
  const [profileBio, setProfileBio] = useState('Experienced piano instructor with over 10 years of teaching experience. Specialized in classical and contemporary piano techniques. Passionate about helping students achieve their musical goals.')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)

  const handleNotification = (message: string) => {
    setNotificationMessage(message)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleAddCourse = () => {
    setActiveTab('create-course')
    handleNotification('Course creation opened!')
  }

  const handleUploadLesson = () => {
    setActiveTab('create-course') // Using create-course page inputs or state
    handleNotification('Lesson upload section!')
  }

  const handleAssignPractice = () => {
    setActiveTab('assignments')
    handleNotification('Assignment creation opened!')
  }

  const handleViewStudents = () => {
    setActiveTab('students')
    handleNotification('Student management opened!')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: activeTab === 'dashboard' },
    { icon: BookOpen, label: 'My Courses', active: activeTab === 'courses' },
    { icon: Plus, label: 'Create Course', active: activeTab === 'create-course' },
    { icon: Users, label: 'Students', active: activeTab === 'students' },
    { icon: FileText, label: 'Assignments', active: activeTab === 'assignments' },
    { icon: Star, label: 'Reviews', active: activeTab === 'reviews' },
    { icon: TrendingUp, label: 'Earnings', active: activeTab === 'earnings' },
    { icon: CreditCard, label: 'Payouts', active: activeTab === 'payouts' },
    { icon: MessageSquare, label: 'Messages', active: activeTab === 'messages' },
    { icon: User, label: 'Profile', active: activeTab === 'profile' },
    { icon: Settings, label: 'Settings', active: activeTab === 'settings' },
    { icon: LogOut, label: 'Logout', active: false },
  ]

  const handleMenuClick = (label: string) => {
    if (label === 'Logout') {
      window.location.href = '/'
      return
    }
    const tabMap: { [key: string]: string } = {
      'Dashboard': 'dashboard',
      'My Courses': 'courses',
      'Create Course': 'create-course',
      'Students': 'students',
      'Assignments': 'assignments',
      'Reviews': 'reviews',
      'Earnings': 'earnings',
      'Payouts': 'payouts',
      'Messages': 'messages',
      'Profile': 'profile',
      'Settings': 'settings'
    }
    setActiveTab(tabMap[label] || 'dashboard')
  }

  const openModal = (type: string, item?: any) => {
    setModalType(type)
    setSelectedItem(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setModalType('')
    setSelectedItem(null)
  }

  const totalStudents = 1092
  const totalRevenue = 180220200
  const averageRating = 4.8

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#0F1E4A] flex flex-col md:flex-row antialiased font-sans">
      
      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? 'w-full md:w-80' : 'w-20 hidden md:flex'
        } bg-white border-r border-[#DCEEFF] transition-all duration-300 flex flex-col shrink-0 z-30`}
      >
        {/* Top Logo */}
        <div className="p-6 border-b border-[#DCEEFF] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎵</span>
            {sidebarOpen && (
              <div>
                <h2 className="font-bold text-lg text-[#0F1E4A] tracking-tight leading-tight">2nd Inversion</h2>
                <p className="text-xs text-[#5EA8FF] font-semibold tracking-wider uppercase">Instructor Portal</p>
              </div>
            )}
          </div>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-[#DCEEFF] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#0F1E4A]" />
          </button>
        </div>

        {/* Instructor Profile Card */}
        {sidebarOpen && (
          <div className="p-5">
            <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#DCEEFF] to-[#FFD6E8] opacity-20 rounded-bl-full pointer-events-none transition-transform group-hover:scale-105"></div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <img 
                    src="/images/instructor_portrait.png" 
                    alt="Ajinkya Amrule" 
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#5EA8FF] shadow-sm"
                    onError={(e) => {
                      // Fallback if image doesn't load
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-white bg-green-500"></span>
                </div>
                <div>
                  <h4 className="font-bold text-[#0F1E4A] text-md leading-tight">{profileName}</h4>
                  <p className="text-xs text-[#FF6FAF] font-medium">Senior Music Instructor</p>
                </div>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-[#FAFBFF] text-xs text-slate-500">
                <span className="flex items-center"><Award className="w-3.5 h-3.5 mr-1 text-[#5EA8FF]" /> 10+ Yrs Exp</span>
                <span className="bg-[#DCEEFF] text-[#5EA8FF] px-2.5 py-0.5 rounded-full font-bold">🟢 Online</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item.label)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-[16px] transition-all duration-200 group text-left ${
                item.active
                  ? 'bg-gradient-to-r from-[#DCEEFF] to-[#FAFBFF] text-[#0F1E4A] border-l-4 border-[#5EA8FF] font-semibold shadow-sm'
                  : 'text-slate-600 hover:bg-[#FAFBFF] hover:text-[#5EA8FF]'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                item.active ? 'text-[#5EA8FF]' : 'text-slate-400 group-hover:text-[#5EA8FF]'
              }`} />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#DCEEFF] px-6 py-4 sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-[#DCEEFF] rounded-lg transition-colors text-[#0F1E4A]"
            >
              <LayoutDashboard className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0F1E4A] tracking-tight">
                {activeTab === 'dashboard' ? 'Instructor Dashboard' : 
                 activeTab === 'create-course' ? 'Create New Course' :
                 activeTab === 'courses' ? 'My Courses' :
                 activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ')}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeTab === 'dashboard' && 'Welcome back, Ajinkya Amrule 👋 Here is your performance overview.'}
                {activeTab === 'courses' && 'Manage and monitor your musical training courses.'}
                {activeTab === 'create-course' && 'Design, draft, and publish a new music masterclass.'}
                {activeTab === 'students' && 'Monitor and guide student practices and assignments.'}
                {activeTab === 'assignments' && 'Create and evaluate musical assignments and exercises.'}
                {activeTab === 'reviews' && 'Analyze feedback and suggestions from students.'}
                {activeTab === 'earnings' && 'Track course revenues, active student enrollments, and growth.'}
                {activeTab === 'payouts' && 'Manage and configure your withdrawal bank details.'}
                {activeTab === 'messages' && 'Connect and chat directly with your enrolled students.'}
                {activeTab === 'profile' && 'View your public profile biography and experience.'}
                {activeTab === 'settings' && 'Customize dashboard layout and notification priorities.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4 self-end sm:self-center">
            {/* Search Bar */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources, classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] transition-all"
              />
            </div>
            
            {/* Quick Profile */}
            <div className="flex items-center space-x-3 bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] px-3.5 py-1.5 hover:shadow-sm transition-shadow">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                AA
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-[#0F1E4A] leading-none">{profileName}</p>
                <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Senior Instructor</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="flex-1 p-6 space-y-6">
          
          {/* Notification Alert Banner */}
          {showNotification && (
            <div className="fixed top-6 right-6 bg-white border border-[#DCEEFF] text-[#0F1E4A] px-5 py-4 rounded-[20px] shadow-lg z-50 flex items-center space-x-3 animate-slide-in">
              <div className="p-1.5 bg-[#DCEEFF] rounded-full">
                <CheckCircle className="w-5 h-5 text-[#5EA8FF]" />
              </div>
              <div>
                <p className="text-sm font-bold">Action Completed</p>
                <p className="text-xs text-slate-500">{notificationMessage}</p>
              </div>
            </div>
          )}

          {/* DASHBOARD TAB VIEW */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Left Column: Analytics & Schedule (Spans 2 columns on XL screens) */}
              <div className="xl:col-span-2 space-y-6">
                
                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Students */}
                  <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#DCEEFF] opacity-35 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 bg-gradient-to-br from-[#5EA8FF] to-[#DCEEFF] rounded-xl text-[#0F1E4A]">
                        <Users className="w-5 h-5" />
                      </div>
                      <span className="text-xs bg-[#DCEEFF] text-[#5EA8FF] font-bold px-2 py-0.5 rounded-full">+12.5%</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#0F1E4A] tracking-tight">{totalStudents.toLocaleString('en-IN')}</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">Total Students</p>
                  </div>

                  {/* Card 2: Revenue */}
                  <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFD6E8] opacity-35 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 bg-gradient-to-br from-[#FF6FAF] to-[#FFD6E8] rounded-xl text-[#0F1E4A]">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <span className="text-xs bg-[#FFD6E8] text-[#FF6FAF] font-bold px-2 py-0.5 rounded-full">+23.1%</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#0F1E4A] tracking-tight truncate">{formatIndianCurrency(totalRevenue)}</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">Total Revenue</p>
                  </div>

                  {/* Card 3: Active Courses */}
                  <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-purple-100 opacity-35 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 bg-gradient-to-br from-purple-400 to-purple-100 rounded-xl text-purple-700">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span className="text-xs bg-purple-50 text-purple-600 font-bold px-2 py-0.5 rounded-full">+2 New</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#0F1E4A] tracking-tight">{mockCourses.filter(c => c.status === 'Published').length}</h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">Active Courses</p>
                  </div>

                  {/* Card 4: Rating */}
                  <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-100 opacity-35 rounded-bl-full pointer-events-none transition-transform group-hover:scale-110"></div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 bg-gradient-to-br from-amber-400 to-yellow-100 rounded-xl text-amber-700">
                        <Star className="w-5 h-5" />
                      </div>
                      <span className="text-xs bg-yellow-50 text-amber-600 font-bold px-2 py-0.5 rounded-full">+0.2</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-[#0F1E4A] tracking-tight">{averageRating} <span className="text-sm text-slate-400 font-normal">/ 5.0</span></h3>
                    <p className="text-xs text-slate-500 font-semibold mt-1">Average Rating</p>
                  </div>
                </div>

                {/* Performance Highlights Ring and Monthly metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Monthly Revenue</p>
                        <h4 className="text-2xl font-extrabold text-[#0F1E4A] mt-2">{formatIndianCurrency(2450000)}</h4>
                      </div>
                      <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+18.7%</span>
                    </div>
                    <div className="w-full bg-[#FAFBFF] border border-[#DCEEFF] rounded-[12px] p-2.5 mt-4 text-xs font-medium text-slate-500">
                      📈 Accelerating revenue course performance
                    </div>
                  </div>

                  {/* Completion Rate Progress Ring */}
                  <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-5 shadow-sm flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Completion Rate</p>
                      <h4 className="text-2xl font-extrabold text-[#0F1E4A]">72%</h4>
                      <p className="text-xs text-green-500 font-semibold">+5.2% improvement</p>
                    </div>
                    {/* Ring SVG */}
                    <div className="relative w-16 h-16 shrink-0">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-slate-100"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#5EA8FF]"
                          strokeDasharray="72, 100"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#0F1E4A]">
                        72%
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Student Satisfaction</p>
                        <h4 className="text-2xl font-extrabold text-[#0F1E4A] mt-2">⭐ 4.8</h4>
                      </div>
                      <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Active</span>
                    </div>
                    <div className="w-full bg-pink-50 border border-pink-100 rounded-[12px] p-2.5 mt-4 text-xs font-bold text-[#FF6FAF]">
                      ✨ Excellent feedback from courses
                    </div>
                  </div>
                </div>

                {/* Analytics Charts Grid */}
                <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#DCEEFF] mb-6 gap-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-[#0F1E4A]">Teaching Performance Analytics</h3>
                      <p className="text-xs text-slate-500">Earnings and student metrics comparison over the past 6 months.</p>
                    </div>
                    <div className="flex space-x-2 bg-[#FAFBFF] border border-[#DCEEFF] p-1 rounded-xl">
                      <button className="px-3 py-1.5 text-xs font-bold bg-white text-[#5EA8FF] rounded-lg shadow-sm">Monthly</button>
                      <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-[#5EA8FF] rounded-lg">Weekly</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Revenue Trend (Smooth line chart) */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-600 mb-4">Revenue Trend (Last 6 Months)</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={earningsData}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#5EA8FF" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#FF6FAF" stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                            <YAxis 
                              tickLine={false} 
                              tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`}
                              tick={{ fill: '#64748b', fontSize: 11 }}
                            />
                            <Tooltip formatter={(value) => formatIndianCurrency(Number(value))} />
                            <Area type="monotone" dataKey="earnings" stroke="url(#colorRevenue)" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Student Growth Area Chart */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-600 mb-4">Student Growth Trend</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={studentGrowthData}>
                            <defs>
                              <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#FF6FAF" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#DCEEFF" stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                            <YAxis tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                            <Tooltip formatter={(value) => [`${value} Enrolled`, 'Total Students']} />
                            <Area type="monotone" dataKey="students" stroke="#FF6FAF" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Course Completion Donut Chart */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-600 mb-4">Course Enrollment Distribution</h4>
                      <div className="h-64 flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={coursePieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {coursePieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `${value}% Students`} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-2xl font-extrabold text-[#0F1E4A]">LMS</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Dist</span>
                        </div>
                      </div>
                      <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mt-2">
                        {coursePieData.map((item, index) => (
                          <div key={index} className="flex items-center space-x-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                            <span className="text-[10px] text-slate-500 font-bold">{item.name} ({item.value}%)</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Student Satisfaction Rating Graph */}
                    <div>
                      <h4 className="text-sm font-bold text-slate-600 mb-4">Student Satisfaction Breakdown</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={satisfactionData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                            <XAxis type="number" tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                            <YAxis dataKey="rating" type="category" tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                            <Tooltip formatter={(value) => [`${value} Reviews`, 'Count']} />
                            <Bar dataKey="count" fill="#5EA8FF" radius={[0, 8, 8, 0]} barSize={14} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Course Performance (Top Performing Courses) */}
                <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-[#DCEEFF] mb-4">
                    <h3 className="font-extrabold text-lg text-[#0F1E4A]">Top Performing Courses</h3>
                    <span className="text-xs text-[#5EA8FF] font-bold">Enrollment Share</span>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold flex items-center">🥇 Complete Piano Mastery</span>
                        <span className="font-bold text-[#5EA8FF]">41%</span>
                      </div>
                      <div className="w-full bg-[#FAFBFF] h-3 rounded-full overflow-hidden border border-[#DCEEFF]">
                        <div className="bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] h-full rounded-full" style={{ width: '41%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold flex items-center">🥈 Guitar Fundamentals</span>
                        <span className="font-bold text-[#FF6FAF]">27%</span>
                      </div>
                      <div className="w-full bg-[#FAFBFF] h-3 rounded-full overflow-hidden border border-[#DCEEFF]">
                        <div className="bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] h-full rounded-full" style={{ width: '27%' }}></div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold flex items-center">🥉 Advanced Piano Techniques</span>
                        <span className="font-bold text-purple-600">15%</span>
                      </div>
                      <div className="w-full bg-[#FAFBFF] h-3 rounded-full overflow-hidden border border-[#DCEEFF]">
                        <div className="bg-gradient-to-r from-[#5EA8FF] to-purple-600 h-full rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Today's Schedule & Upcoming Classes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Today's Schedule timeline */}
                  <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                    <div className="flex justify-between items-center pb-4 border-b border-[#DCEEFF] mb-4">
                      <h3 className="font-extrabold text-md text-[#0F1E4A]">Today&apos;s Schedule</h3>
                      <span className="text-xs bg-[#DCEEFF] text-[#5EA8FF] px-2 py-0.5 rounded-full font-bold">Today</span>
                    </div>
                    <div className="space-y-4">
                      {todayClasses.map((cls) => (
                        <div key={cls.id} className="flex items-center justify-between p-3.5 bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] hover:shadow-sm transition-all duration-200">
                          <div className="flex items-start space-x-3.5">
                            <div className="p-2 bg-white border border-[#DCEEFF] rounded-xl text-[#5EA8FF] shrink-0">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#0F1E4A] leading-tight">{cls.student}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{cls.course} • {cls.time}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            cls.status === 'Completed' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-[#DCEEFF] text-[#5EA8FF] border border-[#b2dbff]'
                          }`}>
                            {cls.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upcoming Classes */}
                  <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                    <div className="flex justify-between items-center pb-4 border-b border-[#DCEEFF] mb-4">
                      <h3 className="font-extrabold text-md text-[#0F1E4A]">Upcoming Classes</h3>
                      <span className="text-xs text-slate-400 font-bold">Next 48 Hours</span>
                    </div>
                    <div className="space-y-4">
                      {upcomingClasses.map((cls) => (
                        <div key={cls.id} className="flex items-center justify-between p-3.5 bg-white border border-[#DCEEFF] rounded-[16px]">
                          <div>
                            <p className="text-sm font-bold text-[#0F1E4A] leading-tight">{cls.student}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{cls.course}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-bold text-[#FF6FAF] block">{cls.date}</span>
                            <span className="text-[10px] text-slate-400 font-medium block">{cls.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Widgets / Quick actions (Spans 1 column on XL screens) */}
              <div className="space-y-6">

                {/* Profile Quick Card */}
                <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm relative overflow-hidden text-center group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFD6E8] opacity-20 rounded-bl-full pointer-events-none"></div>
                  <div className="relative mx-auto w-24 h-24 rounded-full border-4 border-[#FFD6E8] p-0.5 mb-4 shadow-inner">
                    <img 
                      src="/images/instructor_portrait.png" 
                      alt="Ajinkya Amrule" 
                      className="w-full h-full rounded-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop';
                      }}
                    />
                  </div>
                  <h3 className="font-extrabold text-xl text-[#0F1E4A] leading-tight">{profileName}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Senior Music Instructor</p>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-[#FAFBFF]">
                    <div className="bg-[#FAFBFF] border border-[#DCEEFF] rounded-xl p-2.5">
                      <span className="block text-xl font-extrabold text-[#5EA8FF]">⭐ 4.8</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rating</span>
                    </div>
                    <div className="bg-[#FAFBFF] border border-[#DCEEFF] rounded-xl p-2.5">
                      <span className="block text-xl font-extrabold text-[#FF6FAF]">1,000+</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Students</span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                  <h3 className="font-extrabold text-md text-[#0F1E4A] pb-4 border-b border-[#DCEEFF] mb-4 flex items-center">
                    <span className="mr-2">⚡</span> Quick Actions
                  </h3>
                  <div className="space-y-2.5">
                    <button 
                      onClick={handleAddCourse}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-[16px] border-2 border-[#2563EB] bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 transition-all duration-200 font-bold text-sm shadow-md"
                    >
                      <span>➕ Create New Course</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    <button 
                      onClick={handleUploadLesson}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-[16px] border border-[#DCEEFF] bg-[#FAFBFF] text-[#0F1E4A] hover:bg-[#DCEEFF] hover:-translate-y-0.5 transition-all duration-200 font-bold text-sm"
                    >
                      <span className="flex items-center"><Upload className="w-4 h-4 mr-2 text-[#5EA8FF]" /> Upload Lesson</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                    
                    <button 
                      onClick={handleAssignPractice}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-[16px] border border-[#DCEEFF] bg-[#FAFBFF] text-[#0F1E4A] hover:bg-[#DCEEFF] hover:-translate-y-0.5 transition-all duration-200 font-bold text-sm"
                    >
                      <span className="flex items-center"><FileText className="w-4 h-4 mr-2 text-[#FF6FAF]" /> Create Assignment</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button 
                      onClick={() => handleNotification('Recording upload interface!')}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-[16px] border border-[#DCEEFF] bg-[#FAFBFF] text-[#0F1E4A] hover:bg-[#DCEEFF] hover:-translate-y-0.5 transition-all duration-200 font-bold text-sm"
                    >
                      <span className="flex items-center"><Video className="w-4 h-4 mr-2 text-purple-600" /> Upload Recording</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button 
                      onClick={handleViewStudents}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-[16px] border border-[#DCEEFF] bg-[#FAFBFF] text-[#0F1E4A] hover:bg-[#DCEEFF] hover:-translate-y-0.5 transition-all duration-200 font-bold text-sm"
                    >
                      <span className="flex items-center"><Users className="w-4 h-4 mr-2 text-indigo-600" /> View Students</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Calendar Widget */}
                <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-[#DCEEFF] mb-4">
                    <h3 className="font-extrabold text-md text-[#0F1E4A]">Calendar Widget</h3>
                    <span className="text-xs text-slate-400 font-bold">June 2026</span>
                  </div>
                  {/* Visual Calendar */}
                  <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                    <span className="font-bold text-slate-400">S</span>
                    <span className="font-bold text-slate-400">M</span>
                    <span className="font-bold text-slate-400">T</span>
                    <span className="font-bold text-slate-400">W</span>
                    <span className="font-bold text-slate-400">T</span>
                    <span className="font-bold text-slate-400">F</span>
                    <span className="font-bold text-slate-400">S</span>
                    
                    <span className="text-slate-300 py-1.5">31</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">1</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">2</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">3</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">4</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">5</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">6</span>
                    
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">7</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">8</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">9</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">10</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">11</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">12</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">13</span>
                    
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">14</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">15</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">16</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">17</span>
                    <span className="bg-[#5EA8FF] text-white font-bold py-1.5 rounded-lg shadow-sm cursor-pointer">18</span>
                    <span className="relative text-[#0F1E4A] font-bold py-1.5 hover:bg-[#FAFBFF] rounded-lg cursor-pointer">
                      19
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#FF6FAF] rounded-full"></span>
                    </span>
                    <span className="relative text-[#0F1E4A] font-bold py-1.5 hover:bg-[#FAFBFF] rounded-lg cursor-pointer">
                      20
                      <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[#5EA8FF] rounded-full"></span>
                    </span>

                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">21</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">22</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">23</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">24</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">25</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">26</span>
                    <span className="text-[#0F1E4A] font-medium py-1.5 hover:bg-[#FAFBFF] rounded-lg transition-colors cursor-pointer">27</span>
                  </div>
                </div>

                {/* Messages Widget Panel */}
                <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-[#DCEEFF] mb-4">
                    <h3 className="font-extrabold text-md text-[#0F1E4A] flex items-center">
                      <span className="mr-2">💬</span> Conversations
                    </h3>
                    <span className="text-xs bg-[#FFD6E8] text-[#FF6FAF] font-bold px-2 py-0.5 rounded-full">12 Unread</span>
                  </div>
                  <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
                    {mockMessages.slice(0, 3).map((msg) => (
                      <div key={msg.id} className="flex items-start space-x-3 cursor-pointer p-2 hover:bg-[#FAFBFF] rounded-xl transition-colors" onClick={() => setActiveTab('messages')}>
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#DCEEFF] text-[#5EA8FF] font-bold flex items-center justify-center text-xs shadow-inner">
                            {msg.avatar}
                          </div>
                          {msg.unread && (
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white bg-[#FF6FAF]"></span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-xs font-bold text-[#0F1E4A] truncate">{msg.student}</h4>
                            <span className="text-[10px] text-slate-400 font-medium shrink-0">{msg.time}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => setActiveTab('messages')} className="w-full text-center mt-3 text-xs font-bold text-[#5EA8FF] hover:text-[#0f1e4a] transition-colors block">
                    View All Messages
                  </button>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                  <div className="flex justify-between items-center pb-4 border-b border-[#DCEEFF] mb-4">
                    <h3 className="font-extrabold text-md text-[#0F1E4A]">Latest Student Activities</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex space-x-3 items-start">
                      <span className="p-1 bg-green-50 text-green-500 rounded-full text-xs">🟢</span>
                      <div>
                        <p className="text-xs font-bold text-[#0F1E4A]">New student enrolled</p>
                        <p className="text-[10px] text-slate-400">Rohan Gupta joined Complete Piano Mastery</p>
                      </div>
                    </div>
                    <div className="flex space-x-3 items-start">
                      <span className="p-1 bg-[#DCEEFF] text-[#5EA8FF] rounded-full text-xs">📝</span>
                      <div>
                        <p className="text-xs font-bold text-[#0F1E4A]">Assignment submitted</p>
                        <p className="text-[10px] text-slate-400">Priya Patel finished Guitar Chord Progression</p>
                      </div>
                    </div>
                    <div className="flex space-x-3 items-start">
                      <span className="p-1 bg-yellow-50 text-amber-500 rounded-full text-xs">⭐</span>
                      <div>
                        <p className="text-xs font-bold text-[#0F1E4A]">Review received</p>
                        <p className="text-[10px] text-slate-400">Vikram Singh left 5 stars review for Piano Mastery</p>
                      </div>
                    </div>
                    <div className="flex space-x-3 items-start">
                      <span className="p-1 bg-pink-50 text-[#FF6FAF] rounded-full text-xs">🏆</span>
                      <div>
                        <p className="text-xs font-bold text-[#0F1E4A]">Course completed</p>
                        <p className="text-[10px] text-slate-400">Rahul Sharma completed Piano Mastery lessons</p>
                      </div>
                    </div>
                    <div className="flex space-x-3 items-start">
                      <span className="p-1 bg-green-50 text-emerald-500 rounded-full text-xs">💰</span>
                      <div>
                        <p className="text-xs font-bold text-[#0F1E4A]">Payment received</p>
                        <p className="text-[10px] text-slate-400">Received monthly payouts of ₹5,00,000</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Today's Summary Footer Panel */}
              <div className="xl:col-span-3 bg-white border border-[#DCEEFF] rounded-[20px] p-5 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-[#0F1E4A] text-sm">Today&apos;s Summary Panel</h4>
                    <p className="text-xs text-slate-500">Live indicators of student engagement as of today.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 shrink-0">
                    <div className="text-left">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Students Online</span>
                      <span className="text-md font-extrabold text-[#5EA8FF]">128 Students</span>
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">New Reviews</span>
                      <span className="text-md font-extrabold text-[#FF6FAF]">6 Reviews</span>
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Revenue Today</span>
                      <span className="text-md font-extrabold text-green-600">₹15,500</span>
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Scheduled Classes</span>
                      <span className="text-md font-extrabold text-purple-600">8 Classes</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* MY COURSES TAB */}
          {activeTab === 'courses' && (
            <div className="bg-white border border-[#DCEEFF] rounded-[20px] shadow-sm">
              <div className="p-6 border-b border-[#DCEEFF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-extrabold text-lg text-[#0F1E4A]">Manage Your Courses</h2>
                  <p className="text-xs text-slate-500 mt-1">Review student enrollment sizes, reviews score, and lesson updates.</p>
                </div>
                <button 
                  onClick={() => setActiveTab('create-course')}
                  className="bg-[#5EA8FF] text-white px-5 py-2.5 rounded-[16px] hover:bg-[#2563EB] transition-colors font-bold text-sm shadow-sm flex items-center space-x-2 w-fit"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Course</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {mockCourses.map((course) => (
                  <div key={course.id} className="border border-[#DCEEFF] bg-[#FAFBFF] rounded-[20px] p-6 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 bg-white border border-[#DCEEFF] rounded-xl flex items-center justify-center font-bold text-md text-[#5EA8FF]">
                        {course.avatar}
                      </div>
                      <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                        course.status === 'Published' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-md font-bold text-[#0F1E4A] mb-1.5 leading-snug">{course.title}</h3>
                      <p className="text-xs text-slate-500 font-semibold mb-4">{course.category}</p>
                      
                      <div className="space-y-2.5 bg-white border border-[#DCEEFF] rounded-[16px] p-4 mb-4">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-400">Price</span>
                          <span className="font-bold text-[#0F1E4A]">{formatIndianCurrency(course.price)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-400">Students</span>
                          <span className="font-bold text-[#0F1E4A]">{course.students.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-400">Revenue</span>
                          <span className="font-bold text-[#0F1E4A]">{formatIndianCurrency(course.revenue)}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-400">Rating</span>
                          <span className="font-bold text-amber-500">⭐ {course.rating}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <button className="flex-1 bg-white border border-[#DCEEFF] text-[#0F1E4A] hover:bg-[#DCEEFF] px-3 py-2 rounded-xl text-xs font-bold transition-all">
                        Edit Course
                      </button>
                      <button className="flex-1 bg-white border border-[#DCEEFF] text-slate-600 hover:bg-[#DCEEFF] px-3 py-2 rounded-xl text-xs font-bold transition-all">
                        Analytics
                      </button>
                      <button className="bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 px-3 py-2 rounded-xl text-xs font-bold transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CREATE COURSE TAB */}
          {activeTab === 'create-course' && (
            <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
              <h2 className="font-extrabold text-lg text-[#0F1E4A] pb-4 border-b border-[#DCEEFF] mb-6">Create New Course</h2>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Intermediate Piano scales and chords"
                      className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category</label>
                    <select className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF]">
                      <option value="">Select category</option>
                      <option value="piano">Piano</option>
                      <option value="guitar">Guitar</option>
                      <option value="drums">Drums</option>
                      <option value="vocals">Vocals</option>
                      <option value="theory">Music Theory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    placeholder="Provide detailed information on course roadmap and target students."
                    rows={4}
                    className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Level</label>
                    <select className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF]">
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Price in INR"
                      className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Thumbnail</label>
                  <div className="border-2 border-dashed border-[#DCEEFF] bg-[#FAFBFF] rounded-[20px] p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-[#0F1E4A]">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Upload Videos</label>
                  <div className="border-2 border-dashed border-[#DCEEFF] bg-[#FAFBFF] rounded-[20px] p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <Play className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-[#0F1E4A]">Click to upload course video materials</p>
                    <p className="text-xs text-slate-400 mt-1">MP4, AVI up to 500MB</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-[#DCEEFF]">
                  <button
                    type="button"
                    onClick={() => {
                      handleNotification('Course draft saved successfully!')
                      setActiveTab('courses')
                    }}
                    className="px-5 py-2.5 border border-[#DCEEFF] rounded-[16px] hover:bg-[#FAFBFF] text-sm font-bold transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleNotification('Course published successfully!')
                      setActiveTab('courses')
                    }}
                    className="px-5 py-2.5 bg-[#5EA8FF] text-white rounded-[16px] hover:bg-[#2563EB] text-sm font-bold transition-all shadow-sm"
                  >
                    Publish Course
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STUDENTS TAB */}
          {activeTab === 'students' && (
            <div className="bg-white border border-[#DCEEFF] rounded-[20px] shadow-sm">
              <div className="p-6 border-b border-[#DCEEFF]">
                <h2 className="font-extrabold text-lg text-[#0F1E4A]">Track Student Progress</h2>
                <p className="text-xs text-slate-500 mt-1">Real-time status updates of active student courses and practice metrics.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAFBFF] border-b border-[#DCEEFF] text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Student</th>
                      <th className="px-6 py-4">Course Enrolled</th>
                      <th className="px-6 py-4">Progress</th>
                      <th className="px-6 py-4">Last Active</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCEEFF]">
                    {mockStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-[#FAFBFF] text-sm">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 rounded-full bg-[#DCEEFF] text-[#5EA8FF] font-bold flex items-center justify-center text-xs shadow-inner">
                              {student.avatar}
                            </div>
                            <div className="font-bold text-[#0F1E4A]">{student.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{student.course}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-24 bg-[#FAFBFF] h-2.5 rounded-full overflow-hidden border border-[#DCEEFF]">
                              <div 
                                className="bg-[#5EA8FF] h-full rounded-full" 
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-[#0F1E4A] text-xs">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-medium">{student.lastActive}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                            student.status === 'Active' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button className="p-1.5 hover:bg-[#DCEEFF] rounded-lg text-slate-600 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ASSIGNMENTS TAB */}
          {activeTab === 'assignments' && (
            <div className="bg-white border border-[#DCEEFF] rounded-[20px] shadow-sm">
              <div className="p-6 border-b border-[#DCEEFF] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="font-extrabold text-lg text-[#0F1E4A]">Manage Assignments</h2>
                  <p className="text-xs text-slate-500 mt-1">Review active student submissions, due dates, and grading assessments.</p>
                </div>
                <button 
                  onClick={() => openModal('create-assignment')}
                  className="bg-[#5EA8FF] text-white px-5 py-2.5 rounded-[16px] hover:bg-[#2563EB] transition-colors font-bold text-sm shadow-sm flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Assignment</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAFBFF] border-b border-[#DCEEFF] text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Assignment Title</th>
                      <th className="px-6 py-4">Course</th>
                      <th className="px-6 py-4">Due Date</th>
                      <th className="px-6 py-4">Submissions</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCEEFF]">
                    {mockAssignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-[#FAFBFF] text-sm">
                        <td className="px-6 py-4 font-bold text-[#0F1E4A]">{assignment.title}</td>
                        <td className="px-6 py-4 text-slate-500 font-medium">{assignment.course}</td>
                        <td className="px-6 py-4 text-slate-400 font-semibold">{assignment.dueDate}</td>
                        <td className="px-6 py-4 font-bold text-[#0F1E4A]">{assignment.submissions} Submissions</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                            assignment.status === 'Active' 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}>
                            {assignment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex justify-end space-x-1">
                            <button className="p-1.5 hover:bg-[#DCEEFF] rounded-lg text-[#5EA8FF] transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-[#DCEEFF] rounded-lg text-green-600 transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div className="bg-white border border-[#DCEEFF] rounded-[20px] shadow-sm">
              <div className="p-6 border-b border-[#DCEEFF]">
                <h2 className="font-extrabold text-lg text-[#0F1E4A]">Student Reviews & Feedback</h2>
                <p className="text-xs text-slate-500 mt-1">Read reviews left by students across all published courses.</p>
              </div>

              <div className="divide-y divide-[#DCEEFF]">
                {mockReviews.map((review) => (
                  <div key={review.id} className="p-6 hover:bg-[#FAFBFF] transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 mb-2 gap-1.5">
                          <h4 className="font-bold text-[#0F1E4A]">{review.student}</h4>
                          <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-0.5 rounded-lg border border-yellow-200 text-amber-500 text-xs font-bold">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{review.rating}.0 Rating</span>
                          </div>
                          <span className="text-xs text-slate-400 font-semibold">{review.date}</span>
                        </div>
                        <p className="text-sm text-slate-600 italic font-medium">&ldquo;{review.comment}&rdquo;</p>
                        <p className="text-xs text-[#5EA8FF] font-bold mt-2.5">Course: {review.course}</p>
                      </div>
                      <button className="p-2 hover:bg-red-50 text-red-600 rounded-xl transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EARNINGS TAB */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Accumulated Revenue</h3>
                  <p className="text-3xl font-extrabold text-[#0F1E4A]">{formatIndianCurrency(totalRevenue)}</p>
                  <span className="text-xs text-green-500 font-bold block mt-2">✨ Total Course Revenue Stream</span>
                </div>
                
                <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Month Earnings</h3>
                  <p className="text-3xl font-extrabold text-[#0F1E4A]">{formatIndianCurrency(2450000)}</p>
                  <span className="text-xs text-green-500 font-bold block mt-2">📈 +18.7% revenue growth</span>
                </div>

                <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Average Payouts Per Course</h3>
                  <p className="text-3xl font-extrabold text-[#0F1E4A]">{formatIndianCurrency(Math.round(totalRevenue / mockCourses.length))}</p>
                  <span className="text-xs text-[#5EA8FF] font-bold block mt-2">Across {mockCourses.length} active courses</span>
                </div>
              </div>

              {/* Earnings Trend Recharts */}
              <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                <h2 className="font-extrabold text-lg text-[#0F1E4A] mb-4">Earnings History Trend</h2>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                      <YAxis 
                        tickLine={false} 
                        tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                      />
                      <Tooltip formatter={(value) => formatIndianCurrency(Number(value))} />
                      <Line type="monotone" dataKey="earnings" stroke="#5EA8FF" strokeWidth={4} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Course-wise revenue Breakdown */}
              <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
                <h2 className="font-extrabold text-lg text-[#0F1E4A] mb-4">Course Revenue Breakdown</h2>
                <div className="space-y-4">
                  {mockCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px]">
                      <div>
                        <h4 className="font-bold text-[#0F1E4A] text-sm">{course.title}</h4>
                        <p className="text-xs text-slate-500 font-semibold mt-1">{course.students.toLocaleString('en-IN')} students enrolled</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#0F1E4A]">{formatIndianCurrency(course.revenue)}</p>
                        <p className="text-xs text-slate-400 mt-1 font-semibold">{formatIndianCurrency(course.price)} / Student</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PAYOUTS TAB */}
          {activeTab === 'payouts' && (
            <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
              <h2 className="font-extrabold text-lg text-[#0F1E4A] mb-6">Payment Withdrawals</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Available Balance</h3>
                  <div className="bg-[#DCEEFF] border border-[#5EA8FF] rounded-[20px] p-5">
                    <p className="text-3xl font-extrabold text-[#0F1E4A]">{formatIndianCurrency(825000)}</p>
                    <p className="text-xs text-[#5EA8FF] font-bold mt-1.5">Ready for bank withdrawal</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Primary Payout Method</h3>
                  <div className="bg-[#FAFBFF] border border-[#DCEEFF] rounded-[20px] p-5">
                    <p className="text-sm font-bold text-[#0F1E4A]">Bank: State Bank of India</p>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Account: XXXX-XXXX-1234</p>
                    <p className="text-xs text-slate-500 font-medium">IFSC: SBIN0001234</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <button 
                  onClick={() => openModal('withdrawal')}
                  className="bg-green-600 text-white px-5 py-2.5 rounded-[16px] hover:bg-green-700 transition-colors font-bold text-sm shadow-sm flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Request Withdrawal</span>
                </button>
              </div>

              <div className="overflow-x-auto pt-4 border-t border-[#DCEEFF]">
                <h3 className="font-bold text-[#0F1E4A] text-sm mb-4">Payouts History</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#FAFBFF] border-b border-[#DCEEFF] text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Payout Date</th>
                      <th className="px-6 py-4">Requested Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DCEEFF]">
                    <tr className="hover:bg-[#FAFBFF] text-sm">
                      <td className="px-6 py-4 font-semibold text-slate-500">2024-04-10</td>
                      <td className="px-6 py-4 font-bold text-[#0F1E4A]">{formatIndianCurrency(500000)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-green-50 text-green-700 border border-green-200">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono">TXN123456789</td>
                    </tr>
                    <tr className="hover:bg-[#FAFBFF] text-sm">
                      <td className="px-6 py-4 font-semibold text-slate-500">2024-03-15</td>
                      <td className="px-6 py-4 font-bold text-[#0F1E4A]">{formatIndianCurrency(325000)}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-green-50 text-green-700 border border-green-200">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono">TXN123456788</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="bg-white border border-[#DCEEFF] rounded-[20px] shadow-sm">
              <div className="p-6 border-b border-[#DCEEFF]">
                <h2 className="font-extrabold text-lg text-[#0F1E4A]">Messages from Students</h2>
                <p className="text-xs text-slate-500 mt-1">Connect, resolve questions, and guide student musical progress.</p>
              </div>

              <div className="divide-y divide-[#DCEEFF]">
                {mockMessages.map((message) => (
                  <div key={message.id} className={`p-6 hover:bg-[#FAFBFF] transition-all duration-150 ${message.unread ? 'bg-[#DCEEFF]/30' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2.5">
                          <div className="w-10 h-10 rounded-full bg-[#DCEEFF] text-[#5EA8FF] font-bold flex items-center justify-center text-xs shadow-inner">
                            {message.avatar}
                          </div>
                          <div>
                            <h4 className="font-bold text-[#0F1E4A] text-sm">{message.student}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold">{message.time}</p>
                          </div>
                          {message.unread && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FFD6E8] text-[#FF6FAF] rounded-full border border-pink-200">New Message</span>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 font-medium pl-1">{message.message}</p>
                        <button className="text-xs font-bold text-[#5EA8FF] hover:text-[#2563EB] mt-3 pl-1 flex items-center">
                          Reply Direct →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
              <h2 className="font-extrabold text-lg text-[#0F1E4A] pb-4 border-b border-[#DCEEFF] mb-6">Instructor Bio Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Public Biography Details</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Expertise</label>
                    <div className="px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] font-bold text-[#0F1E4A]">
                      {profileExpertise}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Years of Experience</label>
                    <div className="px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] font-bold text-[#0F1E4A]">
                      {profileExperience}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Academic Qualifications</label>
                    <div className="px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] font-bold text-[#0F1E4A]">
                      {profileQualifications}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bio Biography Summary</h3>
                  <div className="p-4 bg-[#FAFBFF] border border-[#DCEEFF] rounded-[20px] text-sm font-medium text-slate-600 italic leading-relaxed">
                    &ldquo;{profileBio}&rdquo;
                  </div>
                  <div className="pt-2">
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className="bg-[#5EA8FF] text-white px-5 py-2.5 rounded-[16px] hover:bg-[#2563EB] transition-colors text-xs font-bold shadow-sm"
                    >
                      Edit Profile in Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-[#DCEEFF] rounded-[20px] p-6 shadow-sm">
              <h2 className="font-extrabold text-lg text-[#0F1E4A] pb-4 border-b border-[#DCEEFF] mb-6">Instructor Settings Panel</h2>
              
              <div className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] font-bold text-[#0F1E4A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] font-bold text-[#0F1E4A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] font-bold text-[#0F1E4A]"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Qualifications */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Professional Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">Expertise Fields</label>
                      <input
                        type="text"
                        value={profileExpertise}
                        onChange={(e) => setProfileExpertise(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] font-bold text-[#0F1E4A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">Experience (Years)</label>
                      <input
                        type="text"
                        value={profileExperience}
                        onChange={(e) => setProfileExperience(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] font-bold text-[#0F1E4A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">Qualifications</label>
                      <input
                        type="text"
                        value={profileQualifications}
                        onChange={(e) => setProfileQualifications(e.target.value)}
                        className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] font-bold text-[#0F1E4A]"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio text */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Biography Summary</label>
                  <textarea
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF] font-medium text-slate-600"
                  />
                </div>

                {/* Toggle Notifications */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="w-4.5 h-4.5 text-[#5EA8FF] bg-[#FAFBFF] border-[#DCEEFF] rounded focus:ring-[#5EA8FF]"
                      />
                      <span className="text-sm text-[#0F1E4A] font-bold">Email Notifications (New submissions, payouts)</span>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smsNotifications}
                        onChange={(e) => setSmsNotifications(e.target.checked)}
                        className="w-4.5 h-4.5 text-[#5EA8FF] bg-[#FAFBFF] border-[#DCEEFF] rounded focus:ring-[#5EA8FF]"
                      />
                      <span className="text-sm text-[#0F1E4A] font-bold">SMS Notifications (Direct messages, updates)</span>
                    </label>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-[#DCEEFF] flex justify-end">
                  <button
                    onClick={() => {
                      handleNotification('Profile changes saved successfully!')
                      setActiveTab('dashboard')
                    }}
                    className="bg-[#5EA8FF] text-white px-6 py-2.5 rounded-[16px] hover:bg-[#2563EB] text-sm font-bold shadow-sm transition-all"
                  >
                    Save Configuration Settings
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL LIGHT OVERLAY */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0F1E4A]/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-[#DCEEFF] rounded-[24px] p-6 w-full max-w-md shadow-2xl animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-[#DCEEFF] mb-4">
              <h3 className="font-extrabold text-[#0F1E4A] text-lg">
                {modalType === 'withdrawal' && 'Request Withdrawal'}
                {modalType === 'create-assignment' && 'Create Assignment'}
              </h3>
              <button onClick={closeModal} className="p-1.5 hover:bg-[#FAFBFF] border border-[#DCEEFF] rounded-lg text-slate-400">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {modalType === 'withdrawal' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Withdrawal Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter amount in INR"
                    className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Destination Bank Account</label>
                  <select className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px]">
                    <option>State Bank of India - XXXX-XXXX-1234</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3 pt-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-[#DCEEFF] rounded-[16px] hover:bg-[#FAFBFF] text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleNotification('Withdrawal request submitted successfully!')
                      closeModal()
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-[16px] hover:bg-green-700 text-sm font-bold transition-all shadow-sm"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            )}

            {modalType === 'create-assignment' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assignment Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Major scales exercise"
                    className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Course</label>
                  <select className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px]">
                    <option value="">Select course</option>
                    {mockCourses.map((course) => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instructions / Notes</label>
                  <textarea
                    placeholder="Provide detailed submission requirements"
                    rows={3}
                    className="w-full px-4 py-2.5 text-sm bg-[#FAFBFF] border border-[#DCEEFF] rounded-[16px] focus:outline-none focus:ring-2 focus:ring-[#5EA8FF]"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-[#DCEEFF] rounded-[16px] hover:bg-[#FAFBFF] text-sm font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleNotification('Assignment created successfully!')
                      closeModal()
                    }}
                    className="px-4 py-2 bg-[#5EA8FF] text-white rounded-[16px] hover:bg-[#2563EB] text-sm font-bold transition-all shadow-sm"
                  >
                    Create Assignment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
