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
  Calendar,
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
  X
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

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
  { id: 1, student: 'Rahul Sharma', message: 'Can you explain the 7th chord progression in more detail?', time: '2 hours ago', unread: true },
  { id: 2, student: 'Priya Patel', message: 'Thank you for the feedback on my assignment!', time: '1 day ago', unread: false },
  { id: 3, student: 'Amit Kumar', message: 'When will the next lesson be available?', time: '3 days ago', unread: false },
]

const earningsData = [
  { month: 'Jan', earnings: 400000, students: 120 },
  { month: 'Feb', earnings: 650000, students: 150 },
  { month: 'Mar', earnings: 900000, students: 180 },
  { month: 'Apr', earnings: 1200000, students: 220 },
  { month: 'May', earnings: 1800000, students: 280 },
  { month: 'Jun', earnings: 2450000, students: 320 },
]

const courseRevenueData = [
  { name: 'Complete Piano Mastery', value: 74629500, color: '#8b5cf6' },
  { name: 'Guitar Fundamentals', value: 47948200, color: '#3b82f6' },
  { name: 'Advanced Piano Techniques', value: 26424500, color: '#10b981' },
  { name: 'Electric Guitar Mastery', value: 31218000, color: '#f59e0b' },
]

export default function InstructorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [showDropdown, setShowDropdown] = useState(null)
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')

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
    setActiveTab('upload-lesson')
    handleNotification('Lesson upload opened!')
  }

  const handleAssignPractice = () => {
    setActiveTab('assignments')
    handleNotification('Assignment creation opened!')
  }

  const handleViewStudents = () => {
    setActiveTab('students')
    handleNotification('Student management opened!')
  }

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault()
    handleNotification('Course created successfully!')
    setActiveTab('courses')
  }

  const handleUploadVideo = (e: React.FormEvent) => {
    e.preventDefault()
    handleNotification('Video uploaded successfully!')
    setActiveTab('courses')
  }

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    handleNotification('Assignment created successfully!')
    setActiveTab('assignments')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: activeTab === 'dashboard' },
    { icon: BookOpen, label: 'My Courses', active: activeTab === 'courses' },
    { icon: Plus, label: 'Create Course', active: activeTab === 'create-course', onClick: handleAddCourse },
    { icon: Users, label: 'Students', active: activeTab === 'students', onClick: handleViewStudents },
    { icon: FileText, label: 'Assignments', active: activeTab === 'assignments', onClick: handleAssignPractice },
    { icon: Star, label: 'Reviews', active: activeTab === 'reviews' },
    { icon: TrendingUp, label: 'Earnings', active: activeTab === 'earnings' },
    { icon: CreditCard, label: 'Payouts', active: activeTab === 'payouts' },
    { icon: MessageSquare, label: 'Messages', active: activeTab === 'messages' },
    { icon: User, label: 'Profile', active: activeTab === 'profile' },
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
      'Profile': 'profile'
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

  const totalStudents = mockCourses.reduce((sum, course) => sum + course.students, 0)
  const totalRevenue = mockCourses.reduce((sum, course) => sum + course.revenue, 0)
  const averageRating = (mockCourses.reduce((sum, course) => sum + course.rating, 0) / mockCourses.length).toFixed(1)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b">
          {sidebarOpen && (
            <div>
              <button
                onClick={() => window.location.href = '/'}
                className="text-lg font-bold text-gray-900 hover:text-purple-600 transition-colors text-left"
              >
                2nd Inversion Musical School
              </button>
              <p className="text-xs text-gray-500">Instructor Portal</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item.label)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
                item.active
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <LayoutDashboard className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeTab === 'dashboard' ? 'Instructor Dashboard' : 
                   activeTab === 'create-course' ? 'Create Course' :
                   activeTab.replace('-', ' ')}
                </h1>
                <p className="text-sm text-gray-500">
                  {activeTab === 'dashboard' && 'Welcome back, Sarah. Here is your teaching performance overview.'}
                  {activeTab === 'courses' && 'Manage and monitor your course performance'}
                  {activeTab === 'create-course' && 'Create and publish a new course'}
                  {activeTab === 'students' && 'Track student progress and engagement'}
                  {activeTab === 'assignments' && 'Manage assignments and student submissions'}
                  {activeTab === 'reviews' && 'View student feedback and reviews'}
                  {activeTab === 'earnings' && 'Track your earnings and revenue'}
                  {activeTab === 'payouts' && 'Manage your payment withdrawals'}
                  {activeTab === 'messages' && 'Communicate with your students'}
                  {activeTab === 'profile' && 'Manage your instructor profile'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600">AA</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Ajinkya Amrule</p>
                  <p className="text-xs text-gray-500">Instructor</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8">
          {/* Notification */}
          {showNotification && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>{notificationMessage}</span>
            </div>
          )}

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">+12.5%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{totalStudents.toLocaleString('en-IN')}</h3>
                  <p className="text-gray-600">Total Students</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">+23.1%</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{formatIndianCurrency(totalRevenue)}</h3>
                  <p className="text-gray-600">Total Revenue</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">+2 new</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{mockCourses.filter(c => c.status === 'Published').length}</h3>
                  <p className="text-gray-600">Active Courses</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="text-sm text-green-600 font-medium">+0.2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{averageRating} ⭐</h3>
                  <p className="text-gray-600">Average Rating</p>
                </div>
              </div>

              {/* Additional Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{formatIndianCurrency(2450000)}</p>
                  <p className="text-sm text-green-600">+18.7% from last month</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">72%</p>
                  <p className="text-sm text-blue-600">+5.2% improvement</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-500">Student Satisfaction</h3>
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">4.8 ⭐</p>
                  <p className="text-sm text-purple-600">Excellent feedback</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Earnings Trend (Last 6 Months)</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={earningsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
                      <Tooltip formatter={(value) => formatIndianCurrency(Number(value))} />
                      <Line type="monotone" dataKey="earnings" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Course</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={courseRevenueData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {courseRevenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatIndianCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* My Courses Tab */}
          {activeTab === 'courses' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Manage Your Courses</h2>
                  <button 
                    onClick={() => setActiveTab('create-course')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create New Course</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {mockCourses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-purple-600">{course.avatar}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        course.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{course.category}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Price</span>
                        <span className="font-medium">{formatIndianCurrency(course.price)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Students</span>
                        <span className="font-medium">{course.students.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Revenue</span>
                        <span className="font-medium">{formatIndianCurrency(course.revenue)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Rating</span>
                        <span className="font-medium">{course.rating} ⭐</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Edit Course
                      </button>
                      <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">
                        View Analytics
                      </button>
                      <button className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create Course Tab */}
          {activeTab === 'create-course' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Create New Course</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                    <input
                      type="text"
                      placeholder="Enter course title"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Enter course description"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                      <option value="">Select level</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Enter price in INR"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Thumbnail</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Videos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Play className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">MP4, AVI, MOV up to 500MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Lessons</label>
                  <button
                    type="button"
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-600 transition-colors"
                  >
                    <Plus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Add New Lesson</p>
                  </button>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNotification('Course published successfully!')}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Publish Course
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Track Student Progress</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Enrolled</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-purple-600">{student.avatar}</span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.course}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full" 
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="ml-2 text-sm text-gray-900">{student.progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.lastActive}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900">
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

          {/* Assignments Tab */}
          {activeTab === 'assignments' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Manage Assignments</h2>
                  <button 
                    onClick={() => openModal('create-assignment')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Assignment</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignment Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mockAssignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{assignment.title}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.course}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.dueDate}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{assignment.submissions}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            assignment.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {assignment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-900">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900">
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

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Student Reviews</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {mockReviews.map((review) => (
                  <div key={review.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{review.student}</h4>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.rating}.0</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                        <p className="text-xs text-gray-500">{review.course} • {review.date}</p>
                      </div>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Earnings Tab */}
          {activeTab === 'earnings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Total Earnings</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatIndianCurrency(totalRevenue)}</p>
                  <p className="text-sm text-green-600 mt-2">+23.1% from last month</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Earnings</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatIndianCurrency(2450000)}</p>
                  <p className="text-sm text-green-600 mt-2">+18.7% from last month</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Average per Course</h3>
                  <p className="text-3xl font-bold text-gray-900">{formatIndianCurrency(Math.round(totalRevenue / mockCourses.length))}</p>
                  <p className="text-sm text-blue-600 mt-2">Across {mockCourses.length} courses</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Earnings Trend</h2>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `₹${(value/100000).toFixed(0)}L`} />
                    <Tooltip formatter={(value) => formatIndianCurrency(Number(value))} />
                    <Line type="monotone" dataKey="earnings" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Course-wise Revenue</h2>
                <div className="space-y-4">
                  {mockCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-500">{course.students.toLocaleString('en-IN')} students</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatIndianCurrency(course.revenue)}</p>
                        <p className="text-sm text-gray-500">{formatIndianCurrency(course.price)} per student</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Payouts Tab */}
          {activeTab === 'payouts' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Payment Withdrawals</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Available Balance</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-2xl font-bold text-green-800">{formatIndianCurrency(825000)}</p>
                    <p className="text-sm text-green-600">Ready for withdrawal</p>
                  </div>
                </div>
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Bank Details</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Bank: State Bank of India</p>
                    <p className="text-sm text-gray-600">Account: XXXX-XXXX-1234</p>
                    <p className="text-sm text-gray-600">IFSC: SBIN0001234</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <button 
                  onClick={() => openModal('withdrawal')}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Request Withdrawal</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-04-10</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatIndianCurrency(500000)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TXN123456789</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2024-03-15</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatIndianCurrency(325000)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TXN123456788</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Messages from Students</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {mockMessages.map((message) => (
                  <div key={message.id} className={`p-6 hover:bg-gray-50 ${message.unread ? 'bg-blue-50' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{message.student}</h4>
                          {message.unread && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">New</span>
                          )}
                          <span className="text-xs text-gray-500">{message.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{message.message}</p>
                        <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                          Reply →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Instructor Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        defaultValue="Ajinkya Amrule"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        defaultValue="ajinkya@2ndinversionmusic.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        defaultValue="+91 98765 43210"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900 mb-4">Professional Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Expertise</label>
                      <input
                        type="text"
                        defaultValue="Piano, Music Theory"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                      <input
                        type="text"
                        defaultValue="15+ years"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                      <input
                        type="text"
                        defaultValue="M.Mus, Trinity College London"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Bio</h3>
                <textarea
                  defaultValue="Experienced piano instructor with over 15 years of teaching experience. Specialized in classical and contemporary piano techniques. Passionate about helping students achieve their musical goals."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Profile Image</h3>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-purple-600">SJ</span>
                  </div>
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Upload Image
                  </button>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  onClick={() => handleNotification('Profile updated successfully!')}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Update Profile
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalType === 'withdrawal' && 'Request Withdrawal'}
                {modalType === 'create-assignment' && 'Create Assignment'}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalType === 'withdrawal' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Account</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option>State Bank of India - XXXX-XXXX-1234</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleNotification('Withdrawal request submitted successfully!')
                      closeModal()
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            )}

            {modalType === 'create-assignment' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Title</label>
                  <input
                    type="text"
                    placeholder="Enter assignment title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
                    <option value="">Select course</option>
                    {mockCourses.map((course) => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Enter assignment description"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      handleNotification('Assignment created successfully!')
                      closeModal()
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
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
