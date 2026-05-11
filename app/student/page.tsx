'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import { useTheme } from '@/contexts/ThemeContext'
import { useCart, Course } from '@/contexts/CartContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  Clock,
  TrendingUp,
  Calendar,
  Download,
  Play,
  CheckCircle,
  Award,
  Target,
  User,
  Settings,
  Music,
  Piano,
  Guitar,
  Drum,
  Mic,
  BarChart3,
  Flame,
  Video,
  FileText,
  Star,
  AlertCircle,
  ChevronRight,
  LogOut,
  Bell,
  Mail,
  Phone,
  MapPin,
  Camera,
  LayoutDashboard,
  Heart,
  MessageSquare,
  Search,
  Menu,
  X,
  ShoppingCart,
  Eye,
  ArrowRight,
  PlayCircle,
  Lock,
  Check,
  Users,
  HelpCircle
} from 'lucide-react'


interface PracticeSession {
  id: string
  instrument: string
  date: string
  duration: number
  exercises: number
  completed: number
  level: string
}

interface UpcomingClass {
  id: string
  title: string
  instructor: string
  instrument: string
  date: string
  time: string
  duration: string
  type: 'live' | 'recorded'
  link?: string
}

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  instruments: string[]
  level: string
  goals: string
  joinDate: string
}

interface Certificate {
  id: number
  courseName: string
  instructor: string
  completionDate: string
  certificateId: string
  score: number
}

interface Message {
  id: number
  sender: string
  subject: string
  message: string
  time: string
  avatar: string
  unread: boolean
}

const wishlistCourses = [
  {
    id: '4',
    title: 'Violin for Beginners',
    instructor: 'Maria Rodriguez',
    price: 2999,
    image: '/api/placeholder/300/200',
    rating: 4.9,
    duration: '10 hours',
    level: 'Beginner',
    students: 1234
  },
  {
    id: '5',
    title: 'Jazz Piano Improvisation',
    instructor: 'John Davis',
    price: 3999,
    image: '/api/placeholder/300/200',
    rating: 4.8,
    duration: '15 hours',
    level: 'Advanced',
    students: 567
  }
]

const enrolledCourses: Course[] = [
  {
    id: '1',
    title: 'Piano Fundamentals',
    instructor: 'Sarah Johnson',
    level: 'beginner',
    duration: '8 weeks',
    price: 2999,
    image: '/api/placeholder/300/200',
    rating: 4.9,
    category: 'Piano'
  },
  {
    id: '2',
    title: 'Guitar Basics',
    instructor: 'Mike Wilson',
    level: 'beginner',
    duration: '6 weeks',
    price: 2499,
    image: '/api/placeholder/300/200',
    rating: 4.7,
    category: 'Guitar'
  },
  {
    id: '3',
    title: 'Music Theory',
    instructor: 'Dr. Emily Chen',
    level: 'intermediate',
    duration: '10 weeks',
    price: 2999,
    image: '/api/placeholder/300/200',
    rating: 4.8,
    category: 'Music Theory'
  }
]

const practiceSessions: PracticeSession[] = [
  {
    id: '1',
    instrument: 'piano',
    date: '2024-01-20',
    duration: 45,
    exercises: 5,
    completed: 4,
    level: 'beginner'
  },
  {
    id: '2',
    instrument: 'guitar',
    date: '2024-01-19',
    duration: 30,
    exercises: 3,
    completed: 3,
    level: 'beginner'
  },
  {
    id: '3',
    instrument: 'piano',
    date: '2024-01-18',
    duration: 60,
    exercises: 6,
    completed: 5,
    level: 'beginner'
  }
]

const upcomingClasses: UpcomingClass[] = [
  {
    id: '1',
    title: 'Live Piano Session',
    instructor: 'Sarah Johnson',
    instrument: 'piano',
    date: '2024-01-25',
    time: '3:00 PM',
    duration: '1 hour',
    type: 'live',
    link: '#'
  },
  {
    id: '2',
    title: 'Guitar Workshop',
    instructor: 'Mike Wilson',
    instrument: 'guitar',
    date: '2024-01-26',
    time: '4:00 PM',
    duration: '45 minutes',
    type: 'live',
    link: '#'
  },
  {
    id: '3',
    title: 'Music Theory Lecture',
    instructor: 'Dr. Emily Chen',
    instrument: 'theory',
    date: '2024-01-27',
    time: '2:00 PM',
    duration: '1 hour',
    type: 'recorded'
  }
]

const certificates: Certificate[] = [
  {
    id: 1,
    courseName: 'Introduction to Music Theory',
    instructor: 'Dr. Sarah Chen',
    completionDate: 'March 15, 2024',
    certificateId: 'CERT-2024-001',
    score: 95
  },
  {
    id: 2,
    courseName: 'Basic Piano Techniques',
    instructor: 'Ajinkya Amrule',
    completionDate: 'February 28, 2024',
    certificateId: 'CERT-2024-002',
    score: 92
  },
  {
    id: 3,
    courseName: 'Guitar Fundamentals',
    instructor: 'Mike Johnson',
    completionDate: 'January 10, 2024',
    certificateId: 'CERT-2024-003',
    score: 88
  }
]

const messages: Message[] = [
  {
    id: 1,
    sender: 'Ajinkya Amrule',
    subject: 'Great progress on Piano Fundamentals!',
    message: 'I noticed you\'ve completed 75% of course. Keep up the excellent work!',
    time: '2 hours ago',
    avatar: '/api/placeholder/40/40',
    unread: true
  },
  {
    id: 2,
    sender: 'Dr. Sarah Chen',
    subject: 'Music Theory Assignment Feedback',
    message: 'Your latest assignment on chord progressions was outstanding. Check my feedback.',
    time: '1 day ago',
    avatar: '/api/placeholder/40/40',
    unread: false
  },
  {
    id: 3,
    sender: 'Support Team',
    subject: 'New course recommendations',
    message: 'Based on your progress, we think you might enjoy our Advanced Piano course.',
    time: '3 days ago',
    avatar: '/api/placeholder/40/40',
    unread: false
  }
]

const courseSections = [
  {
    id: 1,
    title: 'Getting Started',
    lessons: [
      { id: 1, title: 'Course Introduction', duration: '5:30', completed: true, locked: false },
      { id: 2, title: 'Setting Up Your Instrument', duration: '8:15', completed: true, locked: false },
      { id: 3, title: 'Basic Music Notation', duration: '12:45', completed: true, locked: false }
    ]
  },
  {
    id: 2,
    title: 'Core Fundamentals',
    lessons: [
      { id: 4, title: 'Understanding Scales', duration: '15:20', completed: true, locked: false },
      { id: 5, title: 'Learning Basic Chords', duration: '18:30', completed: false, locked: false, current: true },
      { id: 6, title: 'Rhythm and Timing', duration: '14:10', completed: false, locked: true }
    ]
  },
  {
    id: 3,
    title: 'Intermediate Techniques',
    lessons: [
      { id: 7, title: 'Advanced Chord Progressions', duration: '22:15', completed: false, locked: true },
      { id: 8, title: 'Improvisation Basics', duration: '19:45', completed: false, locked: true },
      { id: 9, title: 'Performance Techniques', duration: '25:30', completed: false, locked: true }
    ]
  }
]

export default function StudentDashboard() {
  const { theme } = useTheme()
  const { addItem, isInCart } = useCart()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'practice' | 'schedule' | 'profile' | 'learning' | 'course-player' | 'wishlist' | 'certificates' | 'messages'>('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([])
  const [practiceSessions, setPracticeSessions] = useState<PracticeSession[]>([])
  const [upcomingClasses, setUpcomingClasses] = useState<UpcomingClass[]>([])
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate music learner exploring different instruments',
    instruments: ['Piano', 'Guitar'],
    level: 'Intermediate',
    goals: 'Become proficient in piano and guitar',
    joinDate: '2024-01-15'
  })
  const [isEditingProfile, setIsEditingProfile] = useState(false)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'learning', label: 'My Learning', icon: BookOpen },
    { id: 'course-player', label: 'Course Player', icon: Video },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'practice', label: 'Practice', icon: Target },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: User }
  ]

  const stats = [
    { label: 'Courses Enrolled', value: enrolledCourses.length.toString(), icon: BookOpen, change: '+2 this month', color: 'blue' },
    { label: 'Hours Learned', value: '156', icon: Clock, change: '+24 this week', color: 'green' },
    { label: 'Certificates', value: '3', icon: Award, change: '+1 this month', color: 'purple' },
    { label: 'Practice Streak', value: '7 days', icon: Flame, change: 'Personal best!', color: 'orange' }
  ]

  // Load data on mount
  useEffect(() => {
    // Initialize with sample data
    const sampleCourses: Course[] = [
      {
        id: '1',
        title: 'Piano Fundamentals',
        instructor: 'Sarah Johnson',
        level: 'beginner',
        duration: '8 weeks',
        price: 2999,
        image: '/api/placeholder/300/200',
        rating: 4.9,
        category: 'Piano'
      },
      {
        id: '2',
        title: 'Guitar Basics',
        instructor: 'Mike Wilson',
        level: 'beginner',
        duration: '6 weeks',
        price: 2499,
        image: '/api/placeholder/300/200',
        rating: 4.7,
        category: 'Guitar'
      }
    ]
    
    const sampleSessions: PracticeSession[] = [
      {
        id: '1',
        instrument: 'piano',
        date: '2024-01-20',
        duration: 45,
        exercises: 5,
        completed: 4,
        level: 'beginner'
      },
      {
        id: '2',
        instrument: 'guitar',
        date: '2024-01-19',
        duration: 30,
        exercises: 3,
        completed: 3,
        level: 'beginner'
      }
    ]
    
    const sampleClasses: UpcomingClass[] = [
      {
        id: '1',
        title: 'Live Piano Session',
        instructor: 'Sarah Johnson',
        instrument: 'piano',
        date: '2024-01-25',
        time: '3:00 PM',
        duration: '1 hour',
        type: 'live',
        link: '#'
      }
    ]
    
    setEnrolledCourses(sampleCourses)
    setPracticeSessions(sampleSessions)
    setUpcomingClasses(sampleClasses)
  }, [])

  const getInstrumentIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'piano': return <Piano className="w-5 h-5" />
      case 'guitar': return <Guitar className="w-5 h-5" />
      case 'drums': return <Drum className="w-5 h-5" />
      case 'vocals': return <Mic className="w-5 h-5" />
      default: return <Music className="w-5 h-5" />
    }
  }

  const getInstrumentName = (instrument: string) => {
    switch (instrument) {
      case 'piano': return 'Piano'
      case 'guitar': return 'Guitar'
      case 'drums': return 'Drums'
      case 'vocals': return 'Vocals'
      case 'theory': return 'Music Theory'
      default: return instrument
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
      case 'intermediate': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
      case 'advanced': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/30'
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const getTotalPracticeTime = () => {
    return practiceSessions.reduce((total, session) => total + session.duration, 0)
  }

  const getTotalCompletedExercises = () => {
    return practiceSessions.reduce((total, session) => total + session.completed, 0)
  }

  const getCurrentStreak = () => {
    return 7 // Mock streak
  }

  const getAverageProgress = () => {
    if (enrolledCourses.length === 0) return 0
    return Math.round(enrolledCourses.reduce((total, course) => total + 75, 0) / enrolledCourses.length)
  }

  const handleStartCourse = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  const handleContinueLearning = (courseId: string) => {
    router.push(`/courses/${courseId}`)
  }

  const handlePracticeNow = (instrument: string) => {
    router.push(`/practice?instrument=${instrument}`)
  }

  const handleAddToCart = (course: Course) => {
    addItem({
      id: course.id,
      title: course.title,
      price: course.price,
      instructor: course.instructor,
      level: course.level,
      duration: course.duration
    })
  }

  const handleDownloadMaterials = (courseId: string) => {
    // Download course materials
    const link = document.createElement('a')
    link.href = '#'
    link.download = `course_${courseId}_materials.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditingProfile(false)
  }


  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className={`rounded-2xl p-8 ${theme === 'dark' ? 'bg-gradient-to-r from-purple-900 to-blue-900' : 'bg-gradient-to-r from-purple-600 to-blue-600'} text-white`}>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {profileData.firstName}! 👋</h1>
        <p className="text-lg mb-6 opacity-90">You're making great progress! Keep up the excellent work.</p>
        <button 
          onClick={() => setActiveTab('courses')}
          className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          Continue Learning
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>{stat.label}</p>
                <p className={`text-2xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{stat.value}</p>
                <p className="text-xs text-green-500 mt-2">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-xl ${
                stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                stat.color === 'green' ? 'bg-green-100 text-green-600' :
                stat.color === 'purple' ? 'bg-purple-100 text-purple-600' :
                'bg-orange-100 text-orange-600'
              }`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-xl p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Continue Learning</h3>
          
          <div className="space-y-4">
            {enrolledCourses.slice(0, 3).map((course) => (
              <div key={course.id} className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
                    }`}>
                      <div className="text-purple-600">
                        {getInstrumentIcon(course.category)}
                      </div>
                    </div>
                    <div>
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{course.title}</h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>{course.instructor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>75%</p>
                  </div>
                </div>
                
                <div className={`w-full h-2 rounded-full mb-3 ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
                    style={{ width: '75%' }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Next: Chord Progressions
                  </span>
                  <button
                    onClick={() => handleContinueLearning(course.id)}
                    className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Continue
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Classes */}
        <div className={`rounded-xl p-6 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Upcoming Classes</h3>
          
          <div className="space-y-4">
            {upcomingClasses.slice(0, 3).map((classItem) => (
              <div key={classItem.id} className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100'
                    }`}>
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>{classItem.title}</h4>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>{classItem.instructor}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    classItem.type === 'live'
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
                  }`}>
                    {classItem.type === 'live' ? 'Live' : 'Recorded'}
                  </div>
                </div>
                
                <div className={`flex items-center justify-between text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  <div className="flex items-center space-x-4">
                    <span>{classItem.date}</span>
                    <span>{classItem.time}</span>
                    <span>{classItem.duration}</span>
                  </div>
                  {classItem.link && (
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                      Join
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Practice Sessions */}
      <div className={`rounded-xl p-6 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      } shadow-lg`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>Recent Practice Sessions</h3>
        
        <div className="space-y-3">
          {practiceSessions.map((session) => (
            <div key={session.id} className={`flex items-center justify-between p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100'
                }`}>
                  <div className="text-green-600">
                    {getInstrumentIcon(session.instrument)}
                  </div>
                </div>
                <div>
                  <p className={`font-medium ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {getInstrumentName(session.instrument)}
                  </p>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {session.exercises} exercises • {session.completed} completed
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>{formatTime(session.duration)}</p>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>{session.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderMyLearning = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Learning</h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Continue your courses and track your progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {enrolledCourses.map((course) => (
          <div key={course.id} className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-lg`}>
            <div className="flex gap-6">
              <img src={course.image} alt={course.title} className="w-32 h-24 rounded-xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1">{course.title}</h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <img src="/api/placeholder/24/24" alt={course.instructor} className="w-6 h-6 rounded-full" />
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">{course.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>Progress</p>
                    <p className="font-semibold">75%</p>
                  </div>
                  <div>
                    <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>Duration</p>
                    <p className="font-semibold">{course.duration}</p>
                  </div>
                  <div>
                    <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>Lessons</p>
                    <p className="font-semibold">18/24</p>
                  </div>
                </div>

                
                <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-4`}>
                  <div 
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: '75%' }}
                  ></div>
                </div>

                <button 
                  onClick={() => handleContinueLearning(course.id)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Continue Learning
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCoursePlayer = () => {
    if (!selectedCourse) return null

    return (
      <div className="space-y-6">
        <button 
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Back to My Learning
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Video Player */}
          <div className="lg:col-span-2 space-y-4">
            <div className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="relative aspect-video bg-black">
                <div className="w-full h-full bg-gray-600 opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-purple-600 text-white p-4 rounded-full hover:bg-purple-700 transition-colors">
                    <Play className="w-8 h-8" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedCourse.title}</h2>
                <div className="flex items-center gap-4 text-sm">
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Duration: 18:30</span>
                  <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Lesson 5 of 24</span>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Course Content</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">75% Complete</span>
                  <div className={`w-24 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                      style={{ width: '75%' }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {courseSections.map((section) => (
                  <div key={section.id} className={`rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} p-4`}>
                    <h4 className="font-semibold mb-3">{section.title}</h4>
                    <div className="space-y-2">
                      {section.lessons.map((lesson) => (
                        <div 
                          key={lesson.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            lesson.current ? 'bg-purple-100 dark:bg-purple-900/30' :
                            lesson.completed ? 'bg-green-100 dark:bg-green-900/30' :
                            theme === 'dark' ? 'bg-gray-600' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {lesson.completed ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : lesson.current ? (
                              <PlayCircle className="w-5 h-5 text-purple-600" />
                            ) : lesson.locked ? (
                              <Lock className="w-5 h-5 text-gray-400" />
                            ) : (
                              <PlayCircle className="w-5 h-5 text-gray-400" />
                            )}
                            <span className={`text-sm ${lesson.current ? 'font-semibold' : ''}`}>
                              {lesson.title}
                            </span>
                          </div>
                          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {lesson.duration}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Course Info & Tabs */}
          <div className="space-y-4">
            {/* Course Info */}
            <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-lg`}>
              <h3 className="text-xl font-bold mb-4">{selectedCourse.title}</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <img src="/api/placeholder/32/32" alt={selectedCourse.instructor} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-semibold">{selectedCourse.instructor}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{selectedCourse.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>Category</p>
                    <p className="font-semibold">{selectedCourse.category}</p>
                  </div>
                  <div>
                    <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>Level</p>
                    <p className="font-semibold">{selectedCourse.level}</p>
                  </div>
                  <div>
                    <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>Duration</p>
                    <p className="font-semibold">{selectedCourse.duration}</p>
                  </div>
                  <div>
                    <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>Lessons</p>
                    <p className="font-semibold">24</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={`rounded-2xl ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-lg`}>
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                {['Overview', 'Q&A', 'Resources'].map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 py-3 text-sm font-semibold ${
                      theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    } transition-colors`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="p-6">
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Course overview, Q&A section, and downloadable resources will appear here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderWishlist = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Courses you've saved for later</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistCourses.map((course) => (
          <div key={course.id} className={`rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-lg hover:shadow-xl transition-shadow`}>
            <div className="relative">
              <img src={course.image} alt={course.title} className="w-full h-48 object-cover" />
              <button className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">{course.title}</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{course.instructor}</p>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">{course.rating}</span>
                </div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>({course.students} students)</span>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-2xl font-bold text-purple-600">₹{course.price.toLocaleString('en-IN')}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{course.duration} • {course.level}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleAddToCart(course)}
                  disabled={isInCart(course.id)}
                  className={`flex-1 py-2 px-4 rounded-xl font-semibold transition-colors ${
                    isInCart(course.id)
                      ? 'bg-green-100 text-green-600 cursor-not-allowed'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  {isInCart(course.id) ? (
                    <>
                      <Check className="w-4 h-4 inline mr-1" />
                      In Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 inline mr-1" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderCertificates = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Certificates</h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Your earned certificates</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-lg`}>
            <div className={`rounded-xl p-4 mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gradient-to-br from-purple-50 to-blue-50'}`}>
              <Award className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold text-center">{cert.courseName}</h3>
            </div>
            
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Instructor:</span>
                <span className="font-semibold">{cert.instructor}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Completed:</span>
                <span className="font-semibold">{cert.completionDate}</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Score:</span>
                <span className="font-semibold text-green-600">{cert.score}%</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Certificate ID:</span>
                <span className="font-semibold">{cert.certificateId}</span>
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMessages = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Communicate with your instructors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message List */}
        <div className="lg:col-span-2 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-lg ${message.unread ? 'border-l-4 border-purple-600' : ''}`}>
              <div className="flex items-start gap-4">
                <img src={message.avatar} alt={message.sender} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{message.sender}</h3>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{message.time}</span>
                  </div>
                  <h4 className="font-medium mb-2">{message.subject}</h4>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{message.message}</p>
                  <button className={`mt-4 text-sm font-semibold ${theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'} transition-colors`}>
                    Reply →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat Sidebar */}
        <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-lg`}>
          <h3 className="text-lg font-bold mb-4">Quick Chat</h3>
          <div className={`rounded-xl p-4 mb-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Start a conversation with your instructor or get support.</p>
          </div>
          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors">
            Start New Conversation
          </button>
        </div>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Manage your personal information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2">
          <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-lg`}>
            <div className="flex items-center gap-6 mb-6">
              <div className="relative">
                <img src="/api/placeholder/100/100" alt="Profile" className="w-24 h-24 rounded-full" />
                <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold">John Doe</h2>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Student</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Full Name</label>
                <input 
                  type="text" 
                  defaultValue="John Doe" 
                  className={`w-full px-4 py-2 rounded-xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Email</label>
                <input 
                  type="email" 
                  defaultValue="john.doe@example.com" 
                  className={`w-full px-4 py-2 rounded-xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Phone</label>
                <input 
                  type="tel" 
                  defaultValue="+91 98765 43210" 
                  className={`w-full px-4 py-2 rounded-xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Location</label>
                <input 
                  type="text" 
                  defaultValue="Mumbai, India" 
                  className={`w-full px-4 py-2 rounded-xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Bio</label>
              <textarea 
                rows={4} 
                defaultValue="Passionate about learning music and exploring different instruments. Currently focusing on piano and guitar."
                className={`w-full px-4 py-2 rounded-xl border ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              />
            </div>

            <button className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-colors">
              Update Profile
            </button>
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-4">
          <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-lg`}>
            <h3 className="text-lg font-bold mb-4">Learning Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Total Courses</span>
                <span className="font-bold">12</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Completed</span>
                <span className="font-bold text-green-600">3</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>In Progress</span>
                <span className="font-bold text-blue-600">9</span>
              </div>
              <div className="flex justify-between">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Learning Hours</span>
                <span className="font-bold">156</span>
              </div>
            </div>
          </div>

          <div className={`rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white'} shadow-lg`}>
            <h3 className="text-lg font-bold mb-4">Achievements</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                <Award className="w-8 h-8 text-yellow-500 mx-auto mb-1" />
                <p className="text-xs">First Course</p>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                <Star className="w-8 h-8 text-purple-500 mx-auto mb-1" />
                <p className="text-xs">Top Student</p>
              </div>
              <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} text-center`}>
                <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-1" />
                <p className="text-xs">7-Day Streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'learning':
        return renderMyLearning()
      case 'course-player':
        return renderCoursePlayer()
      case 'wishlist':
        return renderWishlist()
      case 'certificates':
        return renderCertificates()
      case 'messages':
        return renderMessages()
      case 'profile':
        return renderProfile()
      default:
        return renderDashboard()
    }
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-800' 
          : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Student Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`bg-transparent outline-none ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                />
              </div>
              
              <button className={`p-2 rounded-xl ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors relative`}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-2">
                <img src="/api/placeholder/32/32" alt="Profile" className="w-8 h-8 rounded-full" />
                <span className={`hidden md:block text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>John Doe</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        {/* Sidebar */}
        <aside className={`fixed left-0 top-20 bottom-0 w-64 transition-transform duration-300 z-40 ${
          theme === 'dark' ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : theme === 'dark' 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            })}
            
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <Link 
                href="/"
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  theme === 'dark' 
                    ? 'text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}
