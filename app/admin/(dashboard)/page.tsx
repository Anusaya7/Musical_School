'use client'

import { useState, useEffect, useMemo } from 'react'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  Plus,
  Video,
  Settings,
  LogOut,
  Clock,
  Trash2,
  Edit,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Bell,
  Sparkles,
  UserCheck,
  CalendarDays,
  PlusCircle,
  TrendingUp,
  Mail,
  MessageSquare,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  CheckSquare,
  CornerUpLeft,
  Layers,
  User,
  Loader2
} from 'lucide-react'
import CourseCard from '@/components/CourseCard'
import AdminCourses from '@/components/AdminCourses';

// Reusable Admin Avatar component
function AdminAvatar({ className, size }: { className?: string; size: number }) {
  const [imageError, setImageError] = useState(false)

  if (imageError) {
    return (
      <div 
        className={`bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 shadow-sm ${className}`}
        style={{ width: size, height: size, borderRadius: '9999px' }}
      >
        <User size={size * 0.5} />
      </div>
    )
  }

  return (
    <img
      src="/images/instructor_portrait.jpg"
      alt="Ajinkya Amrule - Super Admin"
      loading="lazy"
      onError={() => setImageError(true)}
      className={`object-cover object-center shadow-sm ${className}`}
      style={{ width: size, height: size, borderRadius: '9999px' }}
    />
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)

  // Reviews CMS states
  const [adminReviews, setAdminReviews] = useState<any[]>([])
  const [loadingAdminReviews, setLoadingAdminReviews] = useState(false)
  const [reviewsStatusFilter, setReviewsStatusFilter] = useState('')
  const [reviewsSearch, setReviewsSearch] = useState('')
  const [reviewsPage, setReviewsPage] = useState(1)
  const reviewsPerPage = 10
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // CMS Settings States
  const { settings, updateSetting } = useSiteSettings()
  const [cmsSettings, setCmsSettings] = useState<any>(null)

  const [heroForm, setHeroForm] = useState<any>({ banner: '', tagline: '', subtitle: '', description: '', primaryButtonText: '', primaryButtonUrl: '', searchPlaceholder: '' })
  const [aboutForm, setAboutForm] = useState<any>({ title: '', description: '', statYearVal: '', statYearLbl: '', statStudentVal: '', statStudentLbl: '', statExcellenceVal: '', statExcellenceLbl: '', founderName: '', founderRole: '', founderBio: '' })
  const [contactForm, setContactForm] = useState<any>({ email: '', phone: '', address: '', facebook: '', instagram: '', youtube: '', twitter: '' })
  const [footerForm, setFooterForm] = useState<any>({ copyrightText: '', footerText: '' })
  const [seoForm, setSeoForm] = useState<any>({ title: '', description: '', keywords: '' })

  useEffect(() => {
    if (settings) {
      setCmsSettings(settings)
      if (settings.homepage_hero) setHeroForm(settings.homepage_hero)
      if (settings.homepage_about) setAboutForm(settings.homepage_about)
      if (settings.contact_details) setContactForm(settings.contact_details)
      if (settings.footer) setFooterForm(settings.footer)
      if (settings.seo_metadata) setSeoForm(settings.seo_metadata)
    }
  }, [settings])

  const [adminToast, setAdminToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Local override of alert to redirect all alerts to custom toast notification
  const alert = (message: string) => {
    const isError = message.toLowerCase().includes('fail') || 
                    message.toLowerCase().includes('error') || 
                    message.toLowerCase().includes('missing') || 
                    message.toLowerCase().includes('invalid') ||
                    message.toLowerCase().includes('required');
    setAdminToast({
      type: isError ? 'error' : 'success',
      text: message
    });
    setTimeout(() => setAdminToast(null), 4000);
  }

  const handleUpdateCmsSetting = async (key: string, data: any) => {
    const success = await updateSetting(key, data)
    if (success) {
      setAdminToast({ type: 'success', text: `${key.replace('_', ' ')} settings updated successfully.` })
      setTimeout(() => setAdminToast(null), 4000)
    } else {
      setAdminToast({ type: 'error', text: `Failed to update ${key.replace('_', ' ')} settings.` })
      setTimeout(() => setAdminToast(null), 4000)
    }
  }


  // Live Database States
  const [courses, setCourses] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [workshops, setWorkshops] = useState<any[]>([])
  const [recordedSessions, setRecordedSessions] = useState<any[]>([])
  const [holidays, setHolidays] = useState<any[]>([])
  const [schedules, setSchedules] = useState<any[]>([])
  const [students, setStudents] = useState<any[]>([])
  const [instructors, setInstructors] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  const [paymentSearch, setPaymentSearch] = useState('')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All')

  // Modal Toggles
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false)
  const [isAddWorkshopOpen, setIsAddWorkshopOpen] = useState(false)
  const [isAddInstructorOpen, setIsAddInstructorOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [newPrice, setNewPrice] = useState<number>(0)
  const [instruments, setInstruments] = useState<any[]>([])
  const [expandedInstrument, setExpandedInstrument] = useState<string | null>('piano')
  const [isAddInstrumentOpen, setIsAddInstrumentOpen] = useState(false)
  const [newInstrumentName, setNewInstrumentName] = useState('')
  const [newInstrumentStatus, setNewInstrumentStatus] = useState<'Active' | 'Upcoming'>('Active')

  // Category states
  const [categorySearch, setCategorySearch] = useState('')
  const [categoryStatusFilter, setCategoryStatusFilter] = useState('all')
  const [categorySort, setCategorySort] = useState('name-asc')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])
  
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  
  const [catId, setCatId] = useState('')
  const [catName, setCatName] = useState('')
  const [catDescription, setCatDescription] = useState('')
  const [catImage, setCatImage] = useState('')
  const [catIcon, setCatIcon] = useState('')
  const [catStatus, setCatStatus] = useState<'Active' | 'Upcoming' | 'Inactive'>('Active')
  const [catIsVisible, setCatIsVisible] = useState(true)
  const [catStartingPrice, setCatStartingPrice] = useState<number>(3500)
  const [catLevels, setCatLevels] = useState<string[]>(['Beginner', 'Intermediate', 'Advanced'])
  
  // Helper for AuditLog relative time format
  const getRelativeTime = (dateString: string) => {
    const now = new Date()
    const past = new Date(dateString)
    const diffMs = now.getTime() - past.getTime()
    const diffMins = Math.floor(diffMs / (60 * 1000))
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000))
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} mins ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays === 1) return '1 day ago'
    return `${diffDays} days ago`
  }

  // Helper for AuditLog icon mapping
  const getActivityIcon = (action: string, details: string) => {
    const term = `${action} ${details}`.toLowerCase()
    if (term.includes('booking') || term.includes('booked')) return '📅'
    if (term.includes('workshop') || term.includes('masterclass')) return '🎤'
    if (term.includes('recording') || term.includes('video') || term.includes('session')) return '🎥'
    if (term.includes('student') || term.includes('registered')) return '👨‍🎓'
    if (term.includes('price') || term.includes('payment') || term.includes('adjusted')) return '💰'
    return '🎵'
  }
  
  // Full Course Form states (for both add and edit)
  const [courseTitle, setCourseTitle] = useState('')
  const [courseCategory, setCourseCategory] = useState('piano')
  const [courseLevel, setCourseLevel] = useState('Beginner')
  const [coursePrice, setCoursePrice] = useState<number>(3500)
  const [courseDuration, setCourseDuration] = useState('3 Months')
  const [courseDescription, setCourseDescription] = useState('')
  const [courseInstructorName, setCourseInstructorName] = useState('Ajinkya Amrule')
  const [courseDiscountPrice, setCourseDiscountPrice] = useState<number>(0)
  const [courseHasCertificate, setCourseHasCertificate] = useState(true)
  const [courseFeatured, setCourseFeatured] = useState(false)
  const [courseUpcoming, setCourseUpcoming] = useState(false)
  const [courseDemoVideo, setCourseDemoVideo] = useState('')
  const [courseSeoTitle, setCourseSeoTitle] = useState('')
  const [courseSeoDescription, setCourseSeoDescription] = useState('')
  const [courseMaxStudents, setCourseMaxStudents] = useState<number>(30)
  const [courseDifficulty, setCourseDifficulty] = useState('Medium')
  const [courseLanguage, setCourseLanguage] = useState('English')
  const [courseStatus, setCourseStatus] = useState('Published')
  const [courseThumbnail, setCourseThumbnail] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Course List Search, Filter, Sort and Pagination states
  const [courseSearch, setCourseSearch] = useState('')
  const [courseFilterActive, setCourseFilterActive] = useState('all')
  const [courseFilterLevel, setCourseFilterLevel] = useState('all')
  const [courseFilterCategory, setCourseFilterCategory] = useState('all')
  const [courseSort, setCourseSort] = useState('newest')
  const [coursePage, setCoursePage] = useState(1)

  // Course filtering, sorting, and pagination logic
  const filteredAndSortedCourses = useMemo(() => {
    let result = [...courses]

    if (courseSearch.trim()) {
      const q = courseSearch.toLowerCase()
      result = result.filter(c => 
        (c.title || '').toLowerCase().includes(q) ||
        (c.instructor || '').toLowerCase().includes(q) ||
        (c.category || '').toLowerCase().includes(q) ||
        (c.level || '').toLowerCase().includes(q)
      )
    }

    if (courseFilterActive === 'active') {
      result = result.filter(c => !c.isDisabled)
    } else if (courseFilterActive === 'inactive') {
      result = result.filter(c => c.isDisabled)
    }

    if (courseFilterLevel !== 'all') {
      result = result.filter(c => c.level === courseFilterLevel)
    }

    if (courseFilterCategory !== 'all') {
      result = result.filter(c => (c.category || '').toLowerCase() === courseFilterCategory.toLowerCase())
    }

    result.sort((a, b) => {
      if (courseSort === 'newest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      }
      if (courseSort === 'oldest') {
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
      }
      if (courseSort === 'price-asc') {
        return (a.price || 0) - (b.price || 0)
      }
      if (courseSort === 'price-desc') {
        return (b.price || 0) - (a.price || 0)
      }
      if (courseSort === 'az') {
        return (a.title || '').localeCompare(b.title || '')
      }
      return 0
    })

    return result
  }, [courses, courseSearch, courseFilterActive, courseFilterLevel, courseFilterCategory, courseSort])

  const displayRows = useMemo(() => {
    // Start with the filtered courses
    let rows: any[] = filteredAndSortedCourses.map(c => ({
      ...c,
      isCourse: true
    }))

    // Get upcoming instruments
    const upcomingInstruments = (instruments || []).filter(inst => inst.status === 'Upcoming' || inst.isUpcoming || inst.status === 'COMING_SOON')

    // Apply level filter to upcoming instruments:
    // If the level filter is 'Upcoming', we show upcoming instruments.
    // If the level filter is 'Beginner'/'Intermediate'/'Advanced', we do NOT show upcoming instruments.
    // If the level filter is 'all', we show them.
    let showUpcoming = false
    if (courseFilterLevel === 'all' || courseFilterLevel === 'Upcoming') {
      showUpcoming = true
    }

    if (showUpcoming) {
      let filteredUpcoming = upcomingInstruments
      if (courseSearch.trim()) {
        const q = courseSearch.toLowerCase()
        filteredUpcoming = filteredUpcoming.filter(inst => 
          (inst.name || '').toLowerCase().includes(q)
        )
      }
      rows = [...rows, ...filteredUpcoming.map(inst => ({
        id: inst.id,
        title: `${inst.name} (Upcoming)`,
        category: inst.name,
        level: '—',
        price: 0,
        duration: '—',
        instructor: '—',
        maxStudents: 0,
        status: 'Coming Soon',
        publishDate: null,
        isCourse: false
      }))]
    }

    return rows
  }, [filteredAndSortedCourses, instruments, courseFilterLevel, courseSearch])

  const paginatedRows = useMemo(() => {
    const start = (coursePage - 1) * 10
    return displayRows.slice(start, start + 10)
  }, [displayRows, coursePage])

  const totalCoursePages = Math.ceil(displayRows.length / 10)

  // Instructor Form states
  const [editingInstructor, setEditingInstructor] = useState<any>(null)
  const [instName, setInstName] = useState('')
  const [instEmail, setInstEmail] = useState('')
  const [instExpertise, setInstExpertise] = useState('')
  const [instActive, setInstActive] = useState(true)

  // Reschedule Form states
  const [reschedulingBooking, setReschedulingBooking] = useState<any>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState('')

  // Workshop Edit states
  const [editingWorkshop, setEditingWorkshop] = useState<any>(null)
  const [editWorkshopTitle, setEditWorkshopTitle] = useState('')
  const [editWorkshopInstructor, setEditWorkshopInstructor] = useState('')
  const [editWorkshopDate, setEditWorkshopDate] = useState('')
  const [editWorkshopTime, setEditWorkshopTime] = useState('')
  const [editWorkshopPrice, setEditWorkshopPrice] = useState(0)
  const [editWorkshopDesc, setEditWorkshopDesc] = useState('')

  // Additional Recorded session state
  const [videoCourseId, setVideoCourseId] = useState('')

  // Workshop form state
  const [workshopTitle, setWorkshopTitle] = useState('')
  const [workshopInstructor, setWorkshopInstructor] = useState('')
  const [workshopDate, setWorkshopDate] = useState('')
  const [workshopTime, setWorkshopTime] = useState('')
  const [workshopPrice, setWorkshopPrice] = useState<number>(0)
  const [workshopDesc, setWorkshopDesc] = useState('')

  // Recorded session form state
  const [videoTitle, setVideoTitle] = useState('')
  const [videoDesc, setVideoDesc] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [videoInstrument, setVideoInstrument] = useState('piano')

  // Timings edit state
  const [morningStart, setMorningStart] = useState('04:00 AM')
  const [morningEnd, setMorningEnd] = useState('12:00 PM')
  const [eveningStart, setEveningStart] = useState('03:00 PM')
  const [eveningEnd, setEveningEnd] = useState('09:00 PM')

  // Holiday form state
  const [holidayDate, setHolidayDate] = useState('')
  const [holidayReason, setHolidayReason] = useState('')
  const [isWeeklyHoliday, setIsWeeklyHoliday] = useState(false)
  const [weeklyDay, setWeeklyDay] = useState(1) // Monday default

  // Integrations states
  const [whatsappConnected, setWhatsappConnected] = useState(true)
  const [chatbotActive, setChatbotActive] = useState(true)

  // Inquiries and Notifications states
  const [inquiries, setInquiries] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null)

  // Inquiry management filters and pagination
  const [inquirySearch, setInquirySearch] = useState('')
  const [inquiryPurposeFilter, setInquiryPurposeFilter] = useState('')
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('')
  const [inquiryPage, setInquiryPage] = useState(1)
  const inquiriesPerPage = 8

  // Booking Search and Filter states
  const [bookingSearch, setBookingSearch] = useState('')
  const [bookingFilterStatus, setBookingFilterStatus] = useState('all')

  const filteredBookings = useMemo(() => {
    let result = [...bookings]

    if (bookingSearch.trim()) {
      const q = bookingSearch.toLowerCase()
      result = result.filter(b => 
        (b.studentName || '').toLowerCase().includes(q) ||
        (b.courseName || '').toLowerCase().includes(q) ||
        (b.studentEmail || '').toLowerCase().includes(q)
      )
    }

    if (bookingFilterStatus !== 'all') {
      result = result.filter(b => {
        const status = b.status?.toLowerCase() || ''
        if (bookingFilterStatus === 'approved') {
          return status === 'approved' || status === 'booked' || status === 'confirmed'
        }
        if (bookingFilterStatus === 'rejected') {
          return status === 'rejected' || status === 'cancelled'
        }
        return status === bookingFilterStatus
      })
    }

    return result
  }, [bookings, bookingSearch, bookingFilterStatus])

  // Fetch data
  const loadDatabaseData = async () => {
    setLoading(true)
    try {
      const [coursesRes, bookingsRes, workshopsRes, videosRes, holidaysRes, schedulesRes, inquiriesRes, notificationsRes, studentsRes, instructorsRes, paymentsRes, logsRes, instrumentsRes, reviewsRes] = await Promise.all([
        fetch('/api/courses?includeDrafts=true').then(r => r.json()).catch(() => []),
        fetch('/api/bookings').then(r => r.json()).catch(() => []),
        fetch('/api/workshops').then(r => r.json()).catch(() => []),
        fetch('/api/recorded-sessions').then(r => r.json()).catch(() => []),
        fetch('/api/holidays').then(r => r.json()).catch(() => []),
        fetch('/api/schedules').then(r => r.json()).catch(() => []),
        fetch('/api/inquiries').then(r => r.json()).catch(() => []),
        fetch('/api/notifications').then(r => r.json()).catch(() => null),
        fetch('/api/students').then(r => r.json()).catch(() => []),
        fetch('/api/instructors').then(r => r.json()).catch(() => []),
        fetch('/api/payments').then(r => r.json()).catch(() => []),
        fetch('/api/audit-logs').then(r => r.json()).catch(() => []),
        fetch('/api/categories?paginated=false').then(r => r.json()).catch(() => []),
        fetch('/api/reviews').then(r => r.json()).catch(() => ({ success: false }))
      ])

      if (reviewsRes && reviewsRes.success && Array.isArray(reviewsRes.reviews)) {
        setAdminReviews(reviewsRes.reviews)
      }

      if (Array.isArray(coursesRes)) setCourses(coursesRes)
      if (Array.isArray(bookingsRes)) setBookings(bookingsRes)
      if (Array.isArray(workshopsRes)) setWorkshops(workshopsRes)
      if (Array.isArray(videosRes)) setRecordedSessions(videosRes)
      if (Array.isArray(holidaysRes)) setHolidays(holidaysRes)
      if (Array.isArray(studentsRes)) setStudents(studentsRes)
      if (Array.isArray(instructorsRes)) setInstructors(instructorsRes)
      if (Array.isArray(paymentsRes)) setPayments(paymentsRes)
      if (Array.isArray(logsRes)) setAuditLogs(logsRes)
      if (Array.isArray(instrumentsRes)) setInstruments(instrumentsRes)

      if (Array.isArray(inquiriesRes?.inquiries || inquiriesRes)) {
        setInquiries(inquiriesRes?.inquiries || inquiriesRes)
      }
      if (notificationsRes) {
        setNotifications(notificationsRes.notifications || [])
        setUnreadCount(notificationsRes.unreadCount || 0)
      }
      if (Array.isArray(schedulesRes)) {
        setSchedules(schedulesRes)
        const morning = schedulesRes.find(s => s.id === 'morning')
        if (morning) {
          setMorningStart(morning.startTime)
          setMorningEnd(morning.endTime)
        }
        const evening = schedulesRes.find(s => s.id === 'evening')
        if (evening) {
          setEveningStart(evening.startTime)
          setEveningEnd(evening.endTime)
        }
      }
    } catch (error) {
      console.error("Failed to load admin dashboard data", error)
    } finally {
      setLoading(false)
    }
  }

  // Review Admin Handlers
  const handleApproveReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'APPROVED' })
      })
      const data = await res.json()
      if (data.success) {
        alert('Review approved successfully!')
        loadDatabaseData()
      } else {
        alert(data.error || 'Failed to approve review.')
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred.')
    }
  }

  const handleRejectReview = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' })
      })
      const data = await res.json()
      if (data.success) {
        alert('Review rejected successfully!')
        loadDatabaseData()
      } else {
        alert(data.error || 'Failed to reject review.')
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred.')
    }
  }

  const handleDeleteReview = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this review?')) return
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        alert('Review deleted successfully!')
        loadDatabaseData()
      } else {
        alert(data.error || 'Failed to delete review.')
      }
    } catch (err: any) {
      alert(err.message || 'An error occurred.')
    }
  }

  // Inquiry Handlers
  const handleMarkInquiryRead = async (id: string) => {
    try {
      await fetch('/api/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'Read' })
      })
      loadDatabaseData()
    } catch (err) {
      console.error('Failed to mark inquiry read:', err)
    }
  }

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return
    try {
      await fetch(`/api/inquiries?id=${id}`, {
        method: 'DELETE'
      })
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null)
      }
      loadDatabaseData()
    } catch (err) {
      console.error('Failed to delete inquiry:', err)
    }
  }

  // Notification Handlers
  const handleMarkNotificationsRead = async (ids?: string[]) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      })
      loadDatabaseData()
    } catch (err) {
      console.error('Failed to mark notifications read:', err)
    }
  }

  const handleDeleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE'
      })
      loadDatabaseData()
    } catch (err) {
      console.error('Failed to delete notification:', err)
    }
  }

  useEffect(() => {
    loadDatabaseData()
  }, [])

  useEffect(() => {
    if (!editingCourse) {
      if (courseLevel === 'Beginner') {
        setCourseDuration('3 Months')
        setCoursePrice(3500)
        setCourseMaxStudents(30)
        setCourseDifficulty('Easy')
        setCourseStatus('Published')
        setCourseInstructorName('Ajinkya Amrule')
      } else if (courseLevel === 'Intermediate') {
        setCourseDuration('4 Months')
        setCoursePrice(courseCategory === 'piano' || courseCategory === 'guitar' ? 3999 : 4000)
        setCourseMaxStudents(25)
        setCourseDifficulty('Medium')
        setCourseStatus('Published')
        setCourseInstructorName('Ajinkya Amrule')
      } else if (courseLevel === 'Advanced') {
        setCourseDuration('6 Months')
        setCoursePrice(4500)
        setCourseMaxStudents(20)
        setCourseDifficulty('Hard')
        setCourseStatus('Published')
        setCourseInstructorName('Ajinkya Amrule')
      }
    }
  }, [courseLevel, editingCourse])
  // 1. Add Course
  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseTitle || !coursePrice) return
    setIsSaving(true)

    const payload = {
      title: courseTitle,
      category: courseCategory,
      level: courseLevel,
      price: Number(coursePrice),
      instructor: courseInstructorName || 'Ajinkya Amrule',
      duration: courseDuration || '3 Months',
      description: courseDescription || '',
      discountPrice: Number(courseDiscountPrice),
      hasCertificate: courseHasCertificate,
      featured: courseFeatured,
      upcoming: courseUpcoming,
      demoVideo: courseDemoVideo,
      seoTitle: courseSeoTitle,
      seoDescription: courseSeoDescription,
      maxStudents: Number(courseMaxStudents),
      difficulty: courseDifficulty,
      language: courseLanguage,
      status: courseStatus,
      thumbnail: courseThumbnail || `/courses/${courseCategory}-${courseLevel.toLowerCase()}.jpg`
    }

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const resData = await res.json()
        if (resData.message) {
          alert(resData.message)
        }
        setIsAddCourseOpen(false)
        setCourseTitle('')
        setCoursePrice(3500)
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
        loadDatabaseData()
      } else {
        const err = await res.json()
        alert(`Failed to add course: ${err.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  // 2. Save Course Edit (PUT)
  const handleSaveCourseEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCourse) return
    setIsSaving(true)

    const payload = {
      id: editingCourse.id,
      title: courseTitle,
      category: courseCategory,
      level: courseLevel,
      price: Number(coursePrice),
      instructor: courseInstructorName,
      duration: courseDuration,
      description: courseDescription,
      isDisabled: editingCourse.isDisabled,
      discountPrice: Number(courseDiscountPrice),
      hasCertificate: courseHasCertificate,
      featured: courseFeatured,
      upcoming: courseUpcoming,
      demoVideo: courseDemoVideo,
      seoTitle: courseSeoTitle,
      seoDescription: courseSeoDescription,
      maxStudents: Number(courseMaxStudents),
      difficulty: courseDifficulty,
      language: courseLanguage,
      status: courseStatus,
      thumbnail: courseThumbnail
    }

    try {
      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        const resData = await res.json()
        if (resData.message) {
          alert(resData.message)
        }
        setEditingCourse(null)
        setIsAddCourseOpen(false)
        setCourseTitle('')
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
        loadDatabaseData()
      } else {
        const err = await res.json()
        alert(`Failed to update course: ${err.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  // 3. Delete Course
  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return
    try {
      const res = await fetch(`/api/courses?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadDatabaseData()
      } else {
        const err = await res.json()
        alert(`Failed to delete course: ${err.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 3b. Duplicate Course
  const handleDuplicateCourse = async (course: any) => {
    try {
      const copyId = `${course.category}-${course.level.toLowerCase()}-copy-${Date.now()}`
      const duplicated = {
        ...course,
        id: copyId,
        title: `${course.title} (Copy)`,
        status: 'Draft'
      }
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(duplicated)
      })
      if (res.ok) {
        alert('Course duplicated successfully!')
        loadDatabaseData()
      } else {
        const err = await res.json()
        alert(`Failed to duplicate course: ${err.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error(error)
      alert('Failed to duplicate course.')
    }
  }

  // 4. Toggle Course Disabled Status
  const handleToggleCourseStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isDisabled: !currentStatus })
      })
      if (res.ok) {
        loadDatabaseData()
      } else {
        alert('Failed to toggle course status')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 5. Add Special Workshop
  const handleAddWorkshop = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!workshopTitle || !workshopDate || !workshopTime) return

    const payload = {
      title: workshopTitle,
      instructor: workshopInstructor || 'Ajinkya Amrule',
      date: workshopDate,
      time: workshopTime,
      price: Number(workshopPrice),
      description: workshopDesc
    }

    try {
      const res = await fetch('/api/workshops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setIsAddWorkshopOpen(false)
        setWorkshopTitle('')
        setWorkshopInstructor('')
        setWorkshopDate('')
        setWorkshopTime('')
        setWorkshopPrice(0)
        setWorkshopDesc('')
        loadDatabaseData()
      } else {
        alert('Failed to create workshop')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 6. Save Workshop Edit (PUT)
  const handleSaveWorkshopEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingWorkshop) return

    const payload = {
      id: editingWorkshop.id,
      title: editWorkshopTitle,
      instructor: editWorkshopInstructor,
      date: editWorkshopDate,
      time: editWorkshopTime,
      price: Number(editWorkshopPrice),
      description: editWorkshopDesc
    }

    try {
      const res = await fetch('/api/workshops', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setEditingWorkshop(null)
        loadDatabaseData()
      } else {
        alert('Failed to update workshop')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 7. Delete Workshop
  const handleDeleteWorkshop = async (id: string) => {
    if (!confirm('Are you sure you want to delete this workshop?')) return
    try {
      const res = await fetch(`/api/workshops?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadDatabaseData()
      } else {
        alert('Failed to delete workshop')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 8. Upload Recording (YouTube embed link)
  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!videoTitle || !videoUrl) return

    let embedUrl = videoUrl
    if (videoUrl.includes("watch?v=")) {
      const videoId = videoUrl.split("v=")[1]?.split("&")[0]
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (videoUrl.includes("youtu.be/")) {
      const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0]
      if (videoId) embedUrl = `https://www.youtube.com/embed/${videoId}`
    }

    const payload = {
      title: videoTitle,
      description: videoDesc,
      url: embedUrl,
      instrument: videoInstrument,
      courseId: videoCourseId || undefined
    }

    try {
      const res = await fetch('/api/recorded-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setVideoTitle('')
        setVideoDesc('')
        setVideoUrl('')
        setVideoCourseId('')
        loadDatabaseData()
      } else {
        alert('Failed to upload video')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 9. Delete Recorded Session Video
  const handleDeleteRecordedSession = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recorded session video?')) return
    try {
      const res = await fetch(`/api/recorded-sessions?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadDatabaseData()
      } else {
        alert('Failed to delete video')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 10. Toggle Student Status (Suspend / Activate)
  const handleToggleStudentStatus = async (email: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended'
    try {
      const res = await fetch('/api/students', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status: nextStatus })
      })
      if (res.ok) {
        loadDatabaseData()
      } else {
        alert('Failed to update student status')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 11. Delete Student Account
  const handleDeleteStudent = async (email: string) => {
    if (!confirm(`Are you sure you want to delete student account: ${email}?`)) return
    try {
      const res = await fetch(`/api/students?email=${email}`, { method: 'DELETE' })
      if (res.ok) {
        loadDatabaseData()
      } else {
        alert('Failed to delete student')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 12. Save New Instructor
  const handleSaveInstructor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!instName || !instEmail || !instExpertise) return

    const payload = {
      name: instName,
      email: instEmail,
      expertise: instExpertise,
      avatar: instName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
    }

    try {
      const res = await fetch('/api/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setIsAddInstructorOpen(false)
        setInstName('')
        setInstEmail('')
        setInstExpertise('')
        loadDatabaseData()
      } else {
        alert('Failed to add instructor')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 13. Save Instructor Profile Edits
  const handleSaveInstructorEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingInstructor) return

    const payload = {
      id: editingInstructor.id,
      name: instName,
      email: instEmail,
      expertise: instExpertise,
      avatar: editingInstructor.avatar,
      isActive: instActive
    }

    try {
      const res = await fetch('/api/instructors', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setEditingInstructor(null)
        setInstName('')
        setInstEmail('')
        setInstExpertise('')
        loadDatabaseData()
      } else {
        alert('Failed to update instructor')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 14. Delete Instructor Profile
  const handleDeleteInstructor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this instructor?')) return
    try {
      const res = await fetch(`/api/instructors?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadDatabaseData()
      } else {
        alert('Failed to delete instructor')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 15. Update Booking Status (Accept / Reject / Cancel)
  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      if (res.ok) {
        loadDatabaseData()
      } else {
        alert('Failed to update booking status')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 16. Reschedule Booking Submit
  const handleRescheduleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reschedulingBooking || !rescheduleDate || !rescheduleTimeSlot) return

    try {
      const res = await fetch('/api/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: reschedulingBooking.id,
          date: rescheduleDate,
          timeSlot: rescheduleTimeSlot
        })
      })
      if (res.ok) {
        setReschedulingBooking(null)
        setRescheduleDate('')
        setRescheduleTimeSlot('')
        loadDatabaseData()
      } else {
        alert('Failed to reschedule booking')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 17. Delete Booking Slot
  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking record?')) return
    try {
      const res = await fetch(`/api/bookings?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadDatabaseData()
      } else {
        alert('Failed to delete booking slot')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 5. Update Class Timings
  const handleUpdateTimings = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const generateSlots = (startStr: string, endStr: string) => {
      if (startStr.includes("04:00") && endStr.includes("12:00")) {
        return ["04:00 AM", "05:00 AM", "06:00 AM", "07:00 AM", "08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"]
      }
      if (startStr.includes("03:00") && endStr.includes("09:00")) {
        return ["03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM"]
      }
      return [startStr, "08:00 AM", "10:00 AM", endStr]
    }

    const payload = [
      {
        id: 'morning',
        name: 'Morning Batch',
        startTime: morningStart,
        endTime: morningEnd,
        timeSlots: generateSlots(morningStart, morningEnd)
      },
      {
        id: 'evening',
        name: 'Evening Batch',
        startTime: eveningStart,
        endTime: eveningEnd,
        timeSlots: generateSlots(eveningStart, eveningEnd)
      }
    ]

    try {
      const res = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        alert('Class timings updated successfully!')
        loadDatabaseData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 6. Add Holiday
  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isWeeklyHoliday && !holidayDate) return

    const payload = {
      date: isWeeklyHoliday ? '' : holidayDate,
      reason: holidayReason || 'School Holiday',
      isRecurringWeekly: isWeeklyHoliday,
      dayOfWeek: isWeeklyHoliday ? Number(weeklyDay) : undefined
    }

    try {
      const res = await fetch('/api/holidays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setHolidayDate('')
        setHolidayReason('')
        loadDatabaseData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 7. Delete Holiday
  const handleDeleteHoliday = async (id: string) => {
    if (!confirm('Are you sure you want to remove this holiday?')) return
    try {
      const res = await fetch(`/api/holidays?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadDatabaseData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Category Handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!catId || !catName) {
      alert('ID and Name are required.')
      return
    }
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: catId,
          name: catName,
          description: catDescription,
          image: catImage || `/instruments/${catId}.jpg`,
          icon: catIcon || 'M9 19V6l12-3v13',
          status: catStatus,
          isVisible: catIsVisible,
          startingPrice: Number(catStartingPrice),
          levels: catLevels
        })
      })
      const data = await res.json()
      if (res.ok) {
        setIsAddCategoryOpen(false)
        setCatId('')
        setCatName('')
        setCatDescription('')
        setCatImage('')
        setCatIcon('')
        setCatStatus('Active')
        setCatIsVisible(true)
        setCatStartingPrice(3500)
        setCatLevels(['Beginner', 'Intermediate', 'Advanced'])
        loadDatabaseData()
      } else {
        alert(data.error || 'Failed to add category')
      }
    } catch (err) {
      console.error(err)
      alert('Internal error adding category')
    }
  }

  const handleSaveCategoryEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingCategory) return
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory.id,
          name: catName,
          description: catDescription,
          image: catImage,
          icon: catIcon,
          status: catStatus,
          isVisible: catIsVisible,
          startingPrice: Number(catStartingPrice),
          levels: catLevels
        })
      })
      const data = await res.json()
      if (res.ok) {
        setEditingCategory(null)
        setCatName('')
        setCatDescription('')
        setCatImage('')
        setCatIcon('')
        setCatStatus('Active')
        setCatIsVisible(true)
        setCatStartingPrice(3500)
        setCatLevels(['Beginner', 'Intermediate', 'Advanced'])
        loadDatabaseData()
      } else {
        alert(data.error || 'Failed to update category')
      }
    } catch (err) {
      console.error(err)
      alert('Internal error updating category')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All courses under it will be lost.')) return
    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        loadDatabaseData()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete category')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleToggleCategoryVisibility = async (category: any) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: category.id,
          name: category.name,
          description: category.description,
          image: category.image,
          icon: category.icon,
          status: category.status,
          isVisible: !category.isVisible,
          startingPrice: category.startingPrice,
          levels: category.levels
        })
      })
      if (res.ok) {
        loadDatabaseData()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleBulkCategoryAction = async (action: 'delete' | 'publish' | 'disable') => {
    if (selectedCategoryIds.length === 0) return
    if (action === 'delete' && !confirm(`Are you sure you want to delete these ${selectedCategoryIds.length} categories?`)) return
    try {
      const res = await fetch('/api/categories/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ids: selectedCategoryIds,
          action
        })
      })
      if (res.ok) {
        setSelectedCategoryIds([])
        loadDatabaseData()
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to execute bulk action')
      }
    } catch (err) {
      console.error(err)
    }
  }

  // 8. Logout Security
  const handleLogout = async () => {
    localStorage.removeItem('user')
    await signOut({ redirect: true, callbackUrl: '/admin/login' })
  }

  // Derive list of students from the live database students state + unique student booking requests
  const enrolledStudents = [
    ...students.map(s => {
      const enrolledNames = s.enrolledCourses?.map((cid: string) => {
        const found = courses.find((c: any) => c.id === cid)
        return found ? found.title : cid
      }).join(', ') || 'Trial Class'
      return {
        name: s.name,
        email: s.email,
        course: enrolledNames,
        joined: s.createdAt ? s.createdAt.substring(0, 10) : '2026-06-18',
        status: s.status || 'Active'
      }
    }),
    ...bookings
      .filter(b => !students.some(s => s.email === b.studentEmail))
      .map(b => ({
        name: b.studentName,
        email: b.studentEmail,
        course: `${b.courseName} (Trial)`,
        joined: b.createdAt ? b.createdAt.substring(0, 10) : '2026-06-18',
        status: 'Pending'
      }))
  ]

  // Menu Navigation configuration
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'instructors', label: 'Instructors', icon: UserCheck },
    { id: 'bookings', label: 'Bookings', icon: CalendarDays },
    { id: 'workshops', label: 'Workshops', icon: Sparkles },
    { id: 'recorded', label: 'Recorded Sessions', icon: Video },
    { id: 'inquiries', label: 'Contact Inquiries', icon: Mail },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'payments', label: 'Payments', icon: Sliders },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-[#0F1E4A] font-sans flex flex-col xl:flex-row">
      
      {/* Mobile Header Bar */}
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
            <span className="text-[9px] text-[#5EA8FF] font-extrabold uppercase tracking-wider block mt-0.5">Admin Portal</span>
          </div>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 border-2 border-[#DCEEFF] rounded-xl text-[#0F1E4A] hover:bg-[#FAFBFF] focus:outline-none"
        >
          {isSidebarOpen ? '✕' : '☰'}
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
                <p className="text-[10px] text-[#5EA8FF] font-extrabold uppercase tracking-wider mt-0.5">Admin Portal</p>
              </div>
            </Link>
          </div>

          {/* Admin Profiler */}
          <div className="bg-white border-2 border-[#E6EEFF] rounded-[20px] p-4 shadow-[0_10px_30px_rgba(94,168,255,0.04)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]" />
            <div className="flex items-center gap-3">
              <AdminAvatar size={56} className="flex-shrink-0" />
              <div>
                <h4 className="font-extrabold text-sm text-[#0F1E4A] leading-tight">Ajinkya Amrule</h4>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Super Admin</p>
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-[#5EA8FF] mt-1 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  🟢 Online
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            {menuItems.map(item => (
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
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'inquiries' && inquiries.filter(i => i.status === 'New').length > 0 && (
                  <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-[9px] font-black min-w-[16px] text-center">
                    {inquiries.filter(i => i.status === 'New').length}
                  </span>
                )}
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
        
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#5EA8FF] border-t-transparent"></div>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Syncing database data...</p>
          </div>
        ) : (
          <>
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6EEFF] pb-6">
              <div>
                <h1 className="text-2xl font-black text-[#0F1E4A] tracking-tight">
                  Welcome Back, Ajinkya 👋
                </h1>
                <p className="text-xs text-slate-500 font-bold mt-1">
                  Manage your music school from one place.
                </p>
              </div>
              <div className="flex items-center gap-4 bg-white/70 backdrop-blur-md border border-[#E6EEFF] px-4 py-2.5 rounded-2xl shadow-sm relative">
                {/* Notifications Bell Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
                    className="p-1.5 hover:bg-slate-100/80 rounded-xl transition relative active:scale-95 flex items-center justify-center"
                    title="View Notifications"
                  >
                    <Bell className="w-5 h-5 text-slate-550" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[9px] font-black animate-pulse select-none">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotificationsDropdown && (
                    <div className="absolute right-0 mt-3 w-80 bg-white border border-[#E6EEFF] rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.12)] py-4 z-50 animate-fadeIn">
                      <div className="flex items-center justify-between px-5 pb-3 border-b border-[#E6EEFF]">
                        <h4 className="font-extrabold text-xs text-[#0F1E4A] uppercase tracking-wider flex items-center gap-1.5">
                          <span>🔔 Notifications</span>
                          {unreadCount > 0 && (
                            <span className="bg-red-50 text-red-500 rounded-full px-1.5 py-0.5 text-[8px] font-black">
                              {unreadCount} new
                            </span>
                          )}
                        </h4>
                        {unreadCount > 0 && (
                          <button 
                            onClick={() => handleMarkNotificationsRead()}
                            className="text-[10px] font-bold text-[#5EA8FF] hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      
                      <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="text-center py-8 text-slate-400 font-semibold text-xs">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              className={`p-4 flex gap-3 items-start transition-all hover:bg-slate-50/60 ${
                                notif.status === 'unread' ? 'bg-blue-50/10' : ''
                              }`}
                            >
                              <div className="flex-1 min-w-0">
                                <h5 className={`text-xs font-bold text-slate-800 ${notif.status === 'unread' ? 'font-black' : ''}`}>
                                  {notif.title}
                                </h5>
                                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed mt-0.5 break-words">
                                  {notif.message}
                                </p>
                                <span className="text-[9px] text-slate-400 font-medium block mt-1.5">
                                  {new Date(notif.createdAt).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <div className="flex flex-col gap-1.5 shrink-0">
                                {notif.status === 'unread' && (
                                  <button
                                    onClick={() => handleMarkNotificationsRead([notif.id])}
                                    className="p-1 hover:bg-green-50 rounded text-green-600 transition"
                                    title="Mark as read"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDeleteNotification(notif.id)}
                                  className="p-1 hover:bg-red-50 rounded text-red-400 hover:text-red-650 transition"
                                  title="Delete notification"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-xs font-extrabold text-slate-500">
                  {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <AdminAvatar size={44} className="flex-shrink-0" />
              </div>
            </div>

            {/* TAB: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-fadeIn">
                {/* 6 OVERVIEW CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                  {/* Card 1: Courses */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">📚 Courses</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#0F1E4A] tracking-tight">{courses.filter(c => !c.isDisabled).length}</h3>
                  </div>

                  {/* Card 2: Students */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">👨‍🎓 Students</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#0F1E4A] tracking-tight">{students.length}</h3>
                  </div>

                  {/* Card 3: Instructors */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">👩‍🏫 Instructors</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#0F1E4A] tracking-tight">{instructors.length}</h3>
                  </div>

                  {/* Card 4: Bookings */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">📅 Bookings</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#0F1E4A] tracking-tight">
                      {bookings.length}
                      <span className="text-[10px] text-slate-400 block font-normal mt-0.5">({bookings.filter(b => b.status === 'Pending').length} Pending)</span>
                    </h3>
                  </div>

                  {/* Card 5: Revenue */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">💰 Revenue</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#0F1E4A] tracking-tight">
                      ₹{payments.filter(p => ['Success', 'SUCCESS', 'Completed', 'COMPLETED', 'Paid', 'PAID', 'CAPTURED'].includes(p.status)).reduce((acc, p) => acc + (p.amount || 0), 0).toLocaleString('en-IN')}
                    </h3>
                  </div>

                  {/* Card 6: Inquiries */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] hover:-translate-y-1 transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">✉️ Inquiries</span>
                    </div>
                    <h3 className="text-2xl font-black text-[#0F1E4A] tracking-tight">{inquiries.length}</h3>
                  </div>
                </div>

                {/* QUICK ACTIONS & RECENT ACTIVITY */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Quick Actions */}
                  <div className="lg:col-span-6 bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-[#0F1E4A] mb-2">⚡ Quick Actions</h3>
                      <p className="text-xs text-slate-400 font-medium mb-6">Shortcuts to common administrative operations.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setIsAddCourseOpen(true)}
                        className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                      >
                        <PlusCircle className="w-5 h-5" />
                        <span className="text-[11px] font-extrabold">Add Course</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('students')}
                        className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                      >
                        <Users className="w-5 h-5" />
                        <span className="text-[11px] font-extrabold">View Students</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                      >
                        <Calendar className="w-5 h-5" />
                        <span className="text-[11px] font-extrabold">Manage Bookings</span>
                      </button>
                      <button
                        onClick={() => setIsAddWorkshopOpen(true)}
                        className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-white rounded-[16px] gap-2"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span className="text-[11px] font-extrabold">Create Workshop</span>
                      </button>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="lg:col-span-6 bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                    <h3 className="text-base font-extrabold text-[#0F1E4A] mb-2">⏱️ Recent Activity</h3>
                    <p className="text-xs text-slate-400 font-medium mb-6">Latest events in the music school.</p>
                    <div className="space-y-4">
                      {auditLogs.length === 0 ? (
                        <div className="text-center py-6 text-slate-400 text-xs font-semibold">
                          No recent activities logged.
                        </div>
                      ) : (
                        auditLogs.slice(0, 5).map((log, i) => (
                          <div key={log.id || i} className="flex gap-4 items-start text-xs border-b border-slate-50 pb-3 last:border-0 last:pb-0">
                            <span className="text-base shrink-0 bg-slate-50 p-2.5 rounded-xl">
                              {getActivityIcon(log.action, log.details)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className="font-extrabold text-[#0F1E4A] leading-tight">{log.action}</p>
                              <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate">{log.details}</p>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold text-right shrink-0 mt-0.5">
                              {getRelativeTime(log.createdAt)}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CATEGORIES */}
            {activeTab === 'categories' && (() => {
              // Client-side search, filter and sort categories
              const sortedCategories = instruments.filter(cat => {
                const matchesSearch = 
                  (cat.name?.toLowerCase() || '').includes(categorySearch.toLowerCase()) ||
                  (cat.description?.toLowerCase() || '').includes(categorySearch.toLowerCase()) ||
                  (cat.id?.toLowerCase() || '').includes(categorySearch.toLowerCase())

                const matchesStatus = 
                  categoryStatusFilter === 'all' ||
                  (categoryStatusFilter === 'Active' && cat.status === 'Active') ||
                  (categoryStatusFilter === 'Upcoming' && cat.status === 'Upcoming') ||
                  (categoryStatusFilter === 'Inactive' && cat.status === 'Inactive')

                return matchesSearch && matchesStatus
              }).sort((a, b) => {
                if (categorySort === 'name-asc') return a.name.localeCompare(b.name)
                if (categorySort === 'name-desc') return b.name.localeCompare(a.name)
                if (categorySort === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
                if (categorySort === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
                if (categorySort === 'price-asc') return (a.startingPrice || 0) - (b.startingPrice || 0)
                if (categorySort === 'price-desc') return (b.startingPrice || 0) - (a.startingPrice || 0)
                if (categorySort === 'courses-desc') return (b.coursesCount || 0) - (a.coursesCount || 0)
                return 0
              })

              return (
                <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn font-sans">
                  <div className="flex justify-between items-center border-b border-[#E6EEFF] pb-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-[#0F1E4A]">Course Categories Management</h2>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Manage instruments categories, starting prices, levels, and visibility status.</p>
                    </div>
                    <button
                      onClick={() => {
                        setCatId('')
                        setCatName('')
                        setCatDescription('')
                        setCatImage('')
                        setCatIcon('')
                        setCatStatus('Active')
                        setCatIsVisible(true)
                        setCatStartingPrice(3500)
                        setCatLevels(['Beginner', 'Intermediate', 'Advanced'])
                        setIsAddCategoryOpen(true)
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-[#0F1E4A] text-white hover:bg-[#1a2d61] active:scale-[0.98] transition-all text-xs font-bold rounded-2xl shadow-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Category
                    </button>
                  </div>

                  {/* Search, Filter and Sort bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-[#FAFBFF] p-4 rounded-2xl border border-[#E6EEFF]">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Search</label>
                      <input
                        type="text"
                        placeholder="Search category name..."
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold text-[#0F1E4A] focus:outline-none focus:border-[#5EA8FF] bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status</label>
                      <select
                        value={categoryStatusFilter}
                        onChange={(e) => setCategoryStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-extrabold text-[#0F1E4A] focus:outline-none bg-white cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="Active">Active</option>
                        <option value="Upcoming">Coming Soon</option>
                        <option value="Inactive">Hidden / Inactive</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Sort By</label>
                      <select
                        value={categorySort}
                        onChange={(e) => setCategorySort(e.target.value)}
                        className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-extrabold text-[#0F1E4A] focus:outline-none bg-white cursor-pointer"
                      >
                        <option value="name-asc">Name: A-Z</option>
                        <option value="name-desc">Name: Z-A</option>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="courses-desc">Course Count: High to Low</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      {selectedCategoryIds.length > 0 && (
                        <div className="flex gap-2 w-full">
                          <button
                            onClick={() => handleBulkCategoryAction('publish')}
                            className="flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-[10px] font-black rounded-xl border border-green-200 transition-all"
                          >
                            Publish ({selectedCategoryIds.length})
                          </button>
                          <button
                            onClick={() => handleBulkCategoryAction('disable')}
                            className="flex-1 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-black rounded-xl border border-amber-200 transition-all"
                          >
                            Disable ({selectedCategoryIds.length})
                          </button>
                          <button
                            onClick={() => handleBulkCategoryAction('delete')}
                            className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-[10px] font-black rounded-xl border border-red-200 transition-all"
                          >
                            Delete ({selectedCategoryIds.length})
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Categories Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                          <th className="p-4 w-12 text-center">
                            <input
                              type="checkbox"
                              checked={selectedCategoryIds.length === sortedCategories.length && sortedCategories.length > 0}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedCategoryIds(sortedCategories.map(c => c.id))
                                } else {
                                  setSelectedCategoryIds([])
                                }
                              }}
                              className="rounded border-[#E6EEFF] text-[#0F1E4A] focus:ring-[#5EA8FF]"
                            />
                          </th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Courses</th>
                          <th className="p-4">Starting Price</th>
                          <th className="p-4">Levels</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Visibility</th>
                          <th className="p-4">Created Date</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedCategories.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-slate-400 text-xs font-bold">
                              No course categories found matching the filters.
                            </td>
                          </tr>
                        ) : (
                          sortedCategories.map((cat, idx) => {
                            const isSelected = selectedCategoryIds.includes(cat.id)
                            return (
                              <tr key={idx} className={`border-b border-slate-50 hover:bg-[#FAFBFF] text-xs font-bold text-slate-600 transition-colors ${isSelected ? 'bg-[#F4F9FF]' : ''}`}>
                                <td className="p-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedCategoryIds([...selectedCategoryIds, cat.id])
                                      } else {
                                        setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== cat.id))
                                      }
                                    }}
                                    className="rounded border-[#E6EEFF] text-[#0F1E4A] focus:ring-[#5EA8FF]"
                                  />
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-[#E6EEFF] bg-slate-50 flex items-center justify-center shrink-0">
                                      {cat.image ? (
                                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&q=80` }} />
                                      ) : (
                                        <span className="text-lg">🎵</span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-extrabold text-[#0F1E4A] leading-tight capitalize">{cat.name}</p>
                                      <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate max-w-[200px]">{cat.description || 'No description provided.'}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 text-[#0F1E4A] font-black">{cat.coursesCount || 0}</td>
                                <td className="p-4 text-[#5EA8FF] font-black">₹{(cat.startingPrice || 3500).toLocaleString('en-IN')}</td>
                                <td className="p-4">
                                  <div className="flex flex-wrap gap-1">
                                    {(cat.levels && cat.levels.length > 0 ? cat.levels : ['Beginner', 'Intermediate', 'Advanced']).map((lvl: string, i: number) => (
                                      <span key={i} className="bg-slate-50 border border-[#E6EEFF] px-2 py-0.5 rounded-lg text-[9px] font-extrabold text-slate-500">
                                        {lvl}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-black tracking-wider border ${
                                    cat.status === 'Active' ? 'bg-green-50 text-green-600 border-green-200' : 
                                    cat.status === 'Upcoming' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                    'bg-red-50 text-red-600 border-red-200'
                                  }`}>
                                    {cat.status === 'Active' ? 'Active' : (cat.status === 'Upcoming' ? 'Coming Soon' : 'Inactive')}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <button
                                    onClick={() => handleToggleCategoryVisibility(cat)}
                                    className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${
                                      cat.isVisible ? 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                                    }`}
                                  >
                                    {cat.isVisible ? 'Visible' : 'Hidden'}
                                  </button>
                                </td>
                                <td className="p-4 text-slate-400 text-[11px]">
                                  {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString('en-IN') : '09-07-2026'}
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex gap-2 justify-center">
                                    <button
                                      onClick={() => {
                                        setCatName(cat.name)
                                        setCatDescription(cat.description || '')
                                        setCatImage(cat.image || '')
                                        setCatIcon(cat.icon || '')
                                        setCatStatus(cat.status)
                                        setCatIsVisible(cat.isVisible ?? true)
                                        setCatStartingPrice(cat.startingPrice || 3500)
                                        setCatLevels(cat.levels || ['Beginner', 'Intermediate', 'Advanced'])
                                        setEditingCategory(cat)
                                      }}
                                      className="p-1.5 hover:bg-[#E6EEFF] text-[#0F1E4A] hover:text-[#5EA8FF] rounded-lg transition-all"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCategory(cat.id)}
                                      className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })()}

            {/* TAB: COURSES */}
            {activeTab === 'courses' && (
              <AdminCourses
                courses={courses}
                instruments={instruments}
                students={students}
                loadDatabaseData={loadDatabaseData}
                handleDuplicateCourse={handleDuplicateCourse}
                handleDeleteCourse={handleDeleteCourse}
                setIsAddCourseOpen={setIsAddCourseOpen}
                setEditingCourse={setEditingCourse}
                setCourseTitle={setCourseTitle}
                setCourseCategory={setCourseCategory}
                setCourseLevel={setCourseLevel}
                setCoursePrice={setCoursePrice}
                setCourseDuration={setCourseDuration}
                setCourseDescription={setCourseDescription}
                setCourseInstructorName={setCourseInstructorName}
                setCourseDiscountPrice={setCourseDiscountPrice}
                setCourseHasCertificate={setCourseHasCertificate}
                setCourseFeatured={setCourseFeatured}
                setCourseUpcoming={setCourseUpcoming}
                setCourseDemoVideo={setCourseDemoVideo}
                setCourseSeoTitle={setCourseSeoTitle}
                setCourseSeoDescription={setCourseSeoDescription}
                setCourseMaxStudents={setCourseMaxStudents}
                setCourseDifficulty={setCourseDifficulty}
                setCourseLanguage={setCourseLanguage}
                setCourseStatus={setCourseStatus}
                setCourseThumbnail={setCourseThumbnail}
                setCatId={setCatId}
                setCatName={setCatName}
                setCatDescription={setCatDescription}
                setCatImage={setCatImage}
                setCatIcon={setCatIcon}
                setCatStatus={setCatStatus}
                setCatIsVisible={setCatIsVisible}
                setCatStartingPrice={setCatStartingPrice}
                setCatLevels={setCatLevels}
                setEditingCategory={setEditingCategory}
                setIsAddCategoryOpen={setIsAddCategoryOpen}
              />
            )}
            {/* TAB: STUDENTS */}
            {activeTab === 'students' && (
              <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-lg font-extrabold text-[#0F1E4A]">Student Registry</h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Directory of all currently enrolled learners</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Course Enrolled</th>
                        <th className="p-4">Date Joined</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {enrolledStudents.map((stud, idx) => (
                        <tr key={idx} className="border-b border-slate-50 hover:bg-[#FAFBFF] text-xs font-bold text-slate-600 transition-colors">
                          <td className="p-4 text-[#0F1E4A] font-extrabold">{stud.name}</td>
                          <td className="p-4 text-slate-500">{stud.email}</td>
                          <td className="p-4 text-[#0F1E4A]">{stud.course}</td>
                          <td className="p-4 text-slate-400">{stud.joined}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-black ${
                              stud.status === 'Suspended' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                            }`}>
                              {stud.status}
                            </span>
                          </td>
                          <td className="p-4 flex gap-2">
                            <button
                              onClick={() => handleToggleStudentStatus(stud.email, stud.status)}
                              className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold border transition-all ${
                                stud.status === 'Suspended'
                                  ? 'bg-green-50 hover:bg-green-100 border-green-200 text-green-700'
                                  : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700'
                              }`}
                            >
                              {stud.status === 'Suspended' ? 'Activate' : 'Suspend'}
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(stud.email)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-[10px] font-extrabold text-red-600 transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: INSTRUCTORS */}
            {activeTab === 'instructors' && (
              <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-extrabold text-[#0F1E4A]">Instructor Registry</h2>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Assigned educators and course directors</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingInstructor(null)
                      setInstName('')
                      setInstEmail('')
                      setInstExpertise('')
                      setIsAddInstructorOpen(true)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#0F1E4A] text-white hover:bg-[#1a2d61] active:scale-[0.98] transition-all text-xs font-bold rounded-2xl shadow-sm"
                  >
                    Add Instructor
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {instructors.length === 0 ? (
                    <div className="border border-[#E6EEFF] rounded-[20px] p-6 bg-[#FAFBFF] flex items-center gap-4 relative overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]" />
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white font-extrabold text-lg shadow">
                        AA
                      </div>
                      <div>
                        <span className="bg-[#FFD6E8] text-[#FF6FAF] text-[9px] font-black px-2 py-0.5 rounded-lg">Director</span>
                        <h3 className="font-extrabold text-base text-[#0F1E4A] mt-1">Ajinkya Amrule</h3>
                        <p className="text-xs font-bold text-slate-500">Super Admin & Master Instructor</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-2">Specialties: Piano, Guitar, Vocals</p>
                      </div>
                    </div>
                  ) : (
                    instructors.map((inst) => (
                      <div key={inst.id} className="border border-[#E6EEFF] rounded-[20px] p-6 bg-[#FAFBFF] flex items-center justify-between gap-4 relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]" />
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#5EA8FF] to-[#FF6FAF] flex items-center justify-center text-white font-extrabold text-lg shadow">
                            {inst.avatar || inst.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg ${
                              inst.isActive === false ? 'bg-amber-100 text-amber-800' : 'bg-[#FFD6E8] text-[#FF6FAF]'
                            }`}>
                              {inst.isActive === false ? 'Inactive' : 'Active'}
                            </span>
                            <h3 className="font-extrabold text-base text-[#0F1E4A] mt-1">{inst.name}</h3>
                            <p className="text-xs font-bold text-slate-400">{inst.email}</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-2">Specialties: {inst.expertise}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingInstructor(inst)
                              setInstName(inst.name)
                              setInstEmail(inst.email)
                              setInstExpertise(inst.expertise)
                              setInstActive(inst.isActive !== false)
                            }}
                            className="px-3 py-1 bg-slate-50 hover:bg-[#E6EEFF] border border-[#E6EEFF] text-[10px] font-extrabold rounded-lg text-slate-600 transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteInstructor(inst.id)}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-[10px] font-extrabold rounded-lg text-red-600 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-lg font-extrabold text-[#0F1E4A]">Student Bookings</h2>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">Track and authorize demo slots and regular batch bookings</p>
                </div>

                {/* Search & Filter controls */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#FAFBFF] p-4 border border-[#E6EEFF] rounded-2xl">
                  <div className="relative w-full sm:max-w-xs">
                    <span className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs">🔍</span>
                    <input
                      type="text"
                      placeholder="Search by student, course, or email..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <select
                      value={bookingFilterStatus}
                      onChange={(e) => setBookingFilterStatus(e.target.value)}
                      className="px-4 py-2 bg-white border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Course</th>
                        <th className="p-4">Instructor</th>
                        <th className="p-4">Date</th>
                        <th className="p-4">Batch</th>
                        <th className="p-4">Time Slot</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBookings.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400 text-xs font-bold">
                            No matching bookings found.
                          </td>
                        </tr>
                      ) : (
                        filteredBookings.map(b => (
                          <tr key={b.id} className="border-b border-slate-50 hover:bg-[#FAFBFF] text-xs font-bold text-slate-600 transition-colors">
                            <td className="p-4 text-[#0F1E4A] font-extrabold">
                              <div>{b.studentName}</div>
                              <div className="text-[10px] text-slate-455 font-medium">{b.studentEmail}</div>
                            </td>
                            <td className="p-4 text-[#0F1E4A]">{b.courseName}</td>
                            <td className="p-4">{b.instructor}</td>
                            <td className="p-4 text-slate-400">{b.date}</td>
                            <td className="p-4 capitalize">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                b.batchTiming === 'morning' ? 'bg-amber-50 text-amber-600' : 'bg-purple-50 text-purple-600'
                              }`}>
                                {b.batchTiming}
                              </span>
                            </td>
                            <td className="p-4 text-[#5EA8FF]">{b.timeSlot}</td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] uppercase font-black ${
                                b.status === 'Approved' || b.status === 'Booked' || b.status === 'Confirmed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : b.status === 'Rejected' || b.status === 'Cancelled'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}>
                                {b.status === 'Booked' ? 'Approved' : b.status === 'Cancelled' ? 'Rejected' : b.status}
                              </span>
                            </td>
                            <td className="p-4 flex gap-2">
                              {b.status === 'Pending' && (
                                <>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, 'Approved')}
                                    className="px-2 py-1 bg-green-50 hover:bg-green-100 border border-green-200 text-[10px] font-extrabold rounded-lg text-green-700 transition-all"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, 'Rejected')}
                                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-[10px] font-extrabold rounded-lg text-rose-700 transition-all"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              <button
                                onClick={() => {
                                  setReschedulingBooking(b)
                                  setRescheduleDate(b.date)
                                  setRescheduleTimeSlot(b.timeSlot)
                                }}
                                className="px-2 py-1 bg-slate-50 hover:bg-[#E6EEFF] border border-[#E6EEFF] text-[10px] font-extrabold rounded-lg text-slate-600 transition-all"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleDeleteBooking(b.id)}
                                className="px-2 py-1 bg-red-50 hover:bg-red-100 border border-red-200 text-[10px] font-extrabold rounded-lg text-red-600 transition-all"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: WORKSHOPS */}
            {activeTab === 'workshops' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                {/* Add Workshop Form */}
                <div className="lg:col-span-1 bg-white border border-[#E6EEFF] rounded-[24px] p-6 h-fit space-y-4 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                  <h2 className="text-base font-extrabold text-[#0F1E4A] border-b border-[#E6EEFF] pb-2">Add Special Workshop</h2>
                  <form onSubmit={handleAddWorkshop} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Workshop Title</label>
                      <input
                        type="text"
                        value={workshopTitle}
                        onChange={(e) => setWorkshopTitle(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Instructor Name</label>
                      <input
                        type="text"
                        value={workshopInstructor}
                        onChange={(e) => setWorkshopInstructor(e.target.value)}
                        placeholder="Ajinkya Amrule"
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Date</label>
                        <input
                          type="date"
                          value={workshopDate}
                          onChange={(e) => setWorkshopDate(e.target.value)}
                          className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Price (INR)</label>
                        <input
                          type="number"
                          value={workshopPrice}
                          onChange={(e) => setWorkshopPrice(Number(e.target.value))}
                          className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Time Duration</label>
                      <input
                        type="text"
                        value={workshopTime}
                        onChange={(e) => setWorkshopTime(e.target.value)}
                        placeholder="e.g. 10:00 AM - 12:00 PM"
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
                      <textarea
                        value={workshopDesc}
                        onChange={(e) => setWorkshopDesc(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                        rows={3}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-xs font-extrabold rounded-xl"
                    >
                      Create Workshop
                    </button>
                  </form>
                </div>

                {/* Upcoming Workshops */}
                <div className="lg:col-span-2 bg-white border border-[#E6EEFF] rounded-[24px] p-6 space-y-4 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                  <h2 className="text-base font-extrabold text-[#0F1E4A] border-b border-[#E6EEFF] pb-2">Upcoming Special Workshops</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workshops.map(w => (
                      <div key={w.id} className="p-5 border border-[#E6EEFF] bg-[#FAFBFF] rounded-[20px] space-y-3 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]" />
                        <div className="space-y-2">
                          <h3 className="font-extrabold text-[#0F1E4A] text-sm leading-tight">{w.title}</h3>
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Instructor: {w.instructor}</p>
                          <div className="flex justify-between text-[11px] font-bold text-slate-500">
                            <span>{w.date}</span>
                            <span>{w.time}</span>
                          </div>
                          <p className="text-base font-black text-[#5EA8FF]">₹{w.price.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mt-2">{w.description}</p>
                        </div>
                        <div className="flex gap-2 pt-3 border-t border-slate-100 mt-2">
                          <button
                            onClick={() => {
                              setEditingWorkshop(w)
                              setEditWorkshopTitle(w.title)
                              setEditWorkshopInstructor(w.instructor)
                              setEditWorkshopDate(w.date)
                              setEditWorkshopTime(w.time)
                              setEditWorkshopPrice(w.price)
                              setEditWorkshopDesc(w.description || '')
                            }}
                            className="flex-1 py-1.5 bg-slate-50 hover:bg-[#E6EEFF] border border-[#E6EEFF] text-[10px] font-extrabold rounded-lg text-slate-600 transition-all text-center"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteWorkshop(w.id)}
                            className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-[10px] font-extrabold rounded-lg text-red-600 transition-all text-center"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: RECORDED SESSIONS */}
            {activeTab === 'recorded' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
                {/* YouTube Link Form */}
                <div className="lg:col-span-1 bg-white border border-[#E6EEFF] rounded-[24px] p-6 h-fit space-y-4 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                  <h2 className="text-base font-extrabold text-[#0F1E4A] border-b border-[#E6EEFF] pb-2">Upload YouTube Video</h2>
                  <form onSubmit={handleAddVideo} className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Video Title</label>
                      <input
                        type="text"
                        value={videoTitle}
                        onChange={(e) => setVideoTitle(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">YouTube Link / URL</label>
                      <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Instrument Category</label>
                      <select
                        value={videoInstrument}
                        onChange={(e) => setVideoInstrument(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                      >
                        <option value="piano">Piano</option>
                        <option value="guitar">Guitar</option>
                        <option value="drums">Drums</option>
                        <option value="vocals">Vocals</option>
                        <option value="violin">Violin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Course Restriction</label>
                      <select
                        value={videoCourseId}
                        onChange={(e) => setVideoCourseId(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                      >
                        <option value="">Public (All Students)</option>
                        {courses.map(c => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Brief Description</label>
                      <textarea
                        value={videoDesc}
                        onChange={(e) => setVideoDesc(e.target.value)}
                        className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                        rows={2}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white hover:shadow-[0_8px_20px_rgba(94,168,255,0.2)] hover:-translate-y-0.5 active:scale-[0.98] transition-all text-xs font-extrabold rounded-xl"
                    >
                      Publish Video
                    </button>
                  </form>
                </div>

                {/* Video Directory Grid */}
                <div className="lg:col-span-2 bg-white border border-[#E6EEFF] rounded-[24px] p-6 space-y-4 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                  <h2 className="text-base font-extrabold text-[#0F1E4A] border-b border-[#E6EEFF] pb-2">Recorded Sessions Library</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recordedSessions.map(v => (
                      <div key={v.id} className="border border-[#E6EEFF] rounded-[20px] overflow-hidden bg-[#FAFBFF] shadow-sm hover:shadow-md transition-all">
                        <div className="aspect-video">
                          <iframe
                            src={v.url}
                            title={v.title}
                            className="w-full h-full border-none"
                            allowFullScreen
                          ></iframe>
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <h4 className="font-extrabold text-sm text-[#0F1E4A] leading-tight truncate mr-2">{v.title}</h4>
                            <span className="bg-[#EFF6FF] text-[#5EA8FF] text-[8px] uppercase font-black px-2 py-0.5 rounded-lg shrink-0">
                              {v.instrument}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">{v.description}</p>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-100/50 mt-1">
                            {v.courseId ? (
                              <span className="text-[9px] font-bold text-slate-400 truncate max-w-[120px]">
                                Limit: {courses.find(c => c.id === v.courseId)?.title || v.courseId}
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold text-green-500">Public</span>
                            )}
                            <button
                              onClick={() => handleDeleteRecordedSession(v.id)}
                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-[10px] font-extrabold rounded-lg transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: PAYMENTS */}
            {activeTab === 'payments' && (() => {
              const filteredPayments = payments.filter(p => {
                const matchesSearch = 
                  (p.studentName?.toLowerCase() || '').includes(paymentSearch.toLowerCase()) ||
                  (p.studentEmail?.toLowerCase() || '').includes(paymentSearch.toLowerCase()) ||
                  (p.courseName?.toLowerCase() || '').includes(paymentSearch.toLowerCase()) ||
                  (p.paymentId?.toLowerCase() || '').includes(paymentSearch.toLowerCase()) ||
                  (p.orderId?.toLowerCase() || '').includes(paymentSearch.toLowerCase()) ||
                  (p.invoiceNumber?.toLowerCase() || '').includes(paymentSearch.toLowerCase())

                const matchesStatus = 
                  paymentStatusFilter === 'All' || 
                  (p.status?.toLowerCase() === paymentStatusFilter.toLowerCase())

                return matchesSearch && matchesStatus
              })

              return (
                <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6 animate-fadeIn font-sans">
                  <div className="flex justify-between items-center border-b border-[#E6EEFF] pb-4">
                    <div>
                      <h2 className="text-lg font-extrabold text-[#0F1E4A]">Payment & Revenue History</h2>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Manage transaction receipts and view revenue breakdowns.</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const csvContent = "data:text/csv;charset=utf-8," 
                            + ["Invoice No,Student,Course,Amount,Payment ID,Order ID,Booking Status,Date,Status"].join(",") + "\n"
                            + filteredPayments.map(p => {
                              const booking = bookings.find(b => b.orderId === p.orderId || b.paymentId === p.paymentId)
                              const bookingStatus = booking ? booking.status : 'N/A'
                              return `"${p.invoiceNumber || p.id}","${p.studentName}","${p.courseName}",${p.amount},"${p.paymentId}","${p.orderId}","${bookingStatus}","${p.createdAt}","${p.status || ''}"`
                            }).join("\n");
                          const encodedUri = encodeURI(csvContent);
                          const link = document.createElement("a");
                          link.setAttribute("href", encodedUri);
                          link.setAttribute("download", `payment_history_${Date.now()}.csv`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                        className="px-4 py-2.5 bg-[#0F1E4A] hover:bg-[#1a2d61] text-white text-xs font-bold rounded-xl transition-all"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>

                  {/* Revenue Metrics Panel */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-[#FAFBFF] p-5 rounded-2xl border border-[#E6EEFF] text-xs font-bold">
                    <div className="p-4 bg-white border border-[#E6EEFF] rounded-xl text-center space-y-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Today's Revenue</span>
                      <span className="text-lg font-black text-[#0F1E4A]">
                        ₹{filteredPayments
                          .filter(p => p.createdAt && p.createdAt.startsWith(new Date().toISOString().substring(0, 10)))
                          .reduce((sum, p) => sum + p.amount, 0)
                          .toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-4 bg-white border border-[#E6EEFF] rounded-xl text-center space-y-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Monthly Revenue</span>
                      <span className="text-lg font-black text-[#0F1E4A]">
                        ₹{filteredPayments
                          .filter(p => p.createdAt && p.createdAt.startsWith(new Date().toISOString().substring(0, 7)))
                          .reduce((sum, p) => sum + p.amount, 0)
                          .toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-4 bg-white border border-[#E6EEFF] rounded-xl text-center space-y-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Total Revenue</span>
                      <span className="text-lg font-black text-[#0F1E4A]">
                        ₹{filteredPayments
                          .reduce((sum, p) => sum + p.amount, 0)
                          .toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="p-4 bg-white border border-[#E6EEFF] rounded-xl text-center space-y-1">
                      <span className="block text-[10px] text-slate-400 uppercase font-extrabold">Total Transactions</span>
                      <span className="text-lg font-black text-[#0F1E4A]">
                        {filteredPayments.length}
                      </span>
                    </div>
                  </div>

                  {/* Search and Filters Bar */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#FAFBFF] p-4 rounded-2xl border border-[#E6EEFF]">
                    <div className="relative w-full sm:max-w-xs">
                      <input
                        type="text"
                        placeholder="Search student, course, payment ID, order ID..."
                        value={paymentSearch}
                        onChange={(e) => setPaymentSearch(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold text-[#0F1E4A] focus:outline-none focus:border-[#5EA8FF]"
                      />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Status:</label>
                      <select
                        value={paymentStatusFilter}
                        onChange={(e) => setPaymentStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-extrabold text-[#0F1E4A] focus:outline-none bg-white cursor-pointer"
                      >
                        <option value="All">All Statuses</option>
                        <option value="PAID">Paid</option>
                        <option value="Success">Success</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                          <th className="p-4">Invoice No</th>
                          <th className="p-4">Student</th>
                          <th className="p-4">Course</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Payment ID</th>
                          <th className="p-4">Order ID</th>
                          <th className="p-4">Method</th>
                          <th className="p-4">Failure</th>
                          <th className="p-4">Refund Status</th>
                          <th className="p-4">Booking Status</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPayments.length === 0 ? (
                          <tr>
                            <td colSpan={13} className="p-8 text-center text-slate-400 text-xs font-bold">
                              No payment transactions found.
                            </td>
                          </tr>
                        ) : (
                          filteredPayments.map((p, idx) => {
                            const booking = bookings.find(b => b.orderId === p.orderId || b.paymentId === p.paymentId)
                            const bookingStatus = booking ? booking.status : 'N/A (Direct Course)'
                            const refundStatus = p.status === 'Refunded' ? 'Refunded' : 'No Refund'

                            return (
                              <tr key={idx} className="border-b border-slate-50 hover:bg-[#FAFBFF] text-xs font-bold text-slate-600 transition-colors">
                                <td className="p-4 text-[#0F1E4A] font-extrabold">{p.invoiceNumber || `INV-${p.id}`}</td>
                                <td className="p-4">
                                  <div>
                                    <p className="font-extrabold text-[#0F1E4A] leading-tight">{p.studentName}</p>
                                    <p className="text-[10px] text-slate-400 font-medium mt-0.5 truncate max-w-[150px]">{p.studentEmail}</p>
                                  </div>
                                </td>
                                <td className="p-4">{p.courseName}</td>
                                <td className="p-4 text-[#5EA8FF] font-black">₹{p.amount.toLocaleString('en-IN')}</td>
                                <td className="p-4 text-slate-400 font-mono select-all text-[11px]">{p.paymentId}</td>
                                <td className="p-4 text-slate-400 font-mono select-all text-[11px]">{p.orderId}</td>
                                <td className="p-4 uppercase">{p.paymentMethod || '—'}</td>
                                <td className="p-4 max-w-[180px] truncate" title={p.failureReason || ''}>{p.failureReason || '—'}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] ${refundStatus === 'Refunded' ? 'bg-red-50 text-red-600' : 'bg-slate-50 text-slate-500'}`}>
                                    {refundStatus}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] ${bookingStatus === 'Booked' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>
                                    {bookingStatus}
                                  </span>
                                </td>
                                <td className="p-4 text-slate-400">{p.createdAt ? p.createdAt.substring(0, 10) : '2026-06-18'}</td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-0.5 rounded-lg text-[9px] uppercase font-black ${
                                    ['FAILED', 'Failed', 'CANCELLED', 'Cancelled'].includes(p.status)
                                      ? 'bg-red-50 text-red-700'
                                      : ['PENDING', 'Pending'].includes(p.status)
                                        ? 'bg-amber-50 text-amber-700'
                                        : 'bg-green-50 text-green-700'
                                  }`}>
                                    {p.status || 'Success'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <a
                                    href={`/api/payment/invoice?id=${p.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-[#E6EEFF] border border-[#E6EEFF] rounded-xl text-[10px] font-extrabold text-[#0F1E4A] transition-all"
                                  >
                                    View Invoice
                                  </a>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })()}

            {/* TAB: SETTINGS (Includes Integrations, Operating Hours, and Holidays Planner) */}
            {activeTab === 'settings' && (
              <div className="space-y-8 animate-fadeIn font-sans">
                {/* CMS WEBSITE CONTENT MANAGEMENT SECTION */}
                <div className="bg-slate-50 border border-[#E6EEFF] rounded-[32px] p-6 md:p-8 space-y-8">
                  <div>
                    <h2 className="text-xl font-black text-[#0F1E4A] flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FF6FAF]" /> Public Website CMS Management
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">Control all content blocks, SEO settings, and business parameters on the public website dynamically.</p>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* CARD 1: HERO SECTION CMS */}
                    <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-sm space-y-4">
                      <div className="border-b border-[#E6EEFF] pb-3 flex justify-between items-center">
                        <h3 className="font-extrabold text-[#0F1E4A] text-sm flex items-center gap-2">
                          <span className="text-blue-500">✨</span> Homepage Hero Configuration
                        </h3>
                        <span className="text-[9px] bg-blue-55 text-blue-500 px-2 py-0.5 rounded font-extrabold uppercase">Live View</span>
                      </div>
                      <form onSubmit={(e) => { e.preventDefault(); handleUpdateCmsSetting('homepage_hero', heroForm); }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Tagline (Main Title)</label>
                            <input
                              type="text"
                              value={heroForm.tagline}
                              onChange={(e) => setHeroForm({ ...heroForm, tagline: e.target.value })}
                              placeholder="e.g. Elevate Your Musical Journey"
                              className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Subtitle (Highlights)</label>
                            <input
                              type="text"
                              value={heroForm.subtitle}
                              onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                              placeholder="e.g. Unlock Your True Creative Potential"
                              className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Hero Description</label>
                          <textarea
                            value={heroForm.description}
                            onChange={(e) => setHeroForm({ ...heroForm, description: e.target.value })}
                            placeholder="Detailed paragraph explaining classes, certified directors, and lessons..."
                            rows={3}
                            className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none resize-none"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Button Text</label>
                            <input
                              type="text"
                              value={heroForm.primaryButtonText}
                              onChange={(e) => setHeroForm({ ...heroForm, primaryButtonText: e.target.value })}
                              placeholder="e.g. Explore Courses"
                              className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Button Redirect Link</label>
                            <input
                              type="text"
                              value={heroForm.primaryButtonUrl}
                              onChange={(e) => setHeroForm({ ...heroForm, primaryButtonUrl: e.target.value })}
                              placeholder="e.g. #courses"
                              className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Search Placeholder</label>
                            <input
                              type="text"
                              value={heroForm.searchPlaceholder || ''}
                              onChange={(e) => setHeroForm({ ...heroForm, searchPlaceholder: e.target.value })}
                              placeholder="e.g. What instrument do you want to learn?"
                              className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Background Banner URL / Path</label>
                            <input
                              type="text"
                              value={heroForm.banner}
                              onChange={(e) => setHeroForm({ ...heroForm, banner: e.target.value })}
                              placeholder="e.g. /images/hero-bg.jpg"
                              className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-[#5EA8FF] text-white text-xs font-extrabold rounded-xl hover:shadow-md transition-all active:scale-[0.98]"
                          >
                            Save Hero Settings
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* CARD 2: ABOUT US & BIO CMS */}
                    <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-sm space-y-4">
                      <div className="border-b border-[#E6EEFF] pb-3 flex justify-between items-center">
                        <h3 className="font-extrabold text-[#0F1E4A] text-sm flex items-center gap-2">
                          <span className="text-purple-500">📖</span> About Us & Founder Bio Config
                        </h3>
                        <span className="text-[9px] bg-purple-55 text-purple-500 px-2 py-0.5 rounded font-extrabold uppercase">Dynamic About</span>
                      </div>
                      <form onSubmit={(e) => { e.preventDefault(); handleUpdateCmsSetting('homepage_about', aboutForm); }} className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">About Section Title</label>
                          <input
                            type="text"
                            value={aboutForm.title}
                            onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                            placeholder="e.g. Empowering Musicians Since 2012"
                            className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">About Section Description</label>
                          <textarea
                            value={aboutForm.description}
                            onChange={(e) => setAboutForm({ ...aboutForm, description: e.target.value })}
                            placeholder="Write about the legacy, courses, and certifications of the school..."
                            rows={3}
                            className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none resize-none"
                            required
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-3">
                          <span className="block text-[10px] font-black text-[#0F1E4A] mb-2 uppercase">Achievements Stats</span>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[8px] font-bold text-slate-450 uppercase mb-1">Years (Val / Lbl)</label>
                              <input
                                type="text"
                                value={aboutForm.statYearVal}
                                onChange={(e) => setAboutForm({ ...aboutForm, statYearVal: e.target.value })}
                                placeholder="12+"
                                className="w-full px-2 py-1.5 border border-[#E6EEFF] rounded-lg text-xs font-bold mb-1"
                              />
                              <input
                                type="text"
                                value={aboutForm.statYearLbl}
                                onChange={(e) => setAboutForm({ ...aboutForm, statYearLbl: e.target.value })}
                                placeholder="Years legacy"
                                className="w-full px-2 py-1.5 border border-[#E6EEFF] rounded-lg text-[10px] font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-slate-450 uppercase mb-1">Students (Val / Lbl)</label>
                              <input
                                type="text"
                                value={aboutForm.statStudentVal}
                                onChange={(e) => setAboutForm({ ...aboutForm, statStudentVal: e.target.value })}
                                placeholder="5,000+"
                                className="w-full px-2 py-1.5 border border-[#E6EEFF] rounded-lg text-xs font-bold mb-1"
                              />
                              <input
                                type="text"
                                value={aboutForm.statStudentLbl}
                                onChange={(e) => setAboutForm({ ...aboutForm, statStudentLbl: e.target.value })}
                                placeholder="Students trained"
                                className="w-full px-2 py-1.5 border border-[#E6EEFF] rounded-lg text-[10px] font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-slate-450 uppercase mb-1">Excellence (Val / Lbl)</label>
                              <input
                                type="text"
                                value={aboutForm.statExcellenceVal}
                                onChange={(e) => setAboutForm({ ...aboutForm, statExcellenceVal: e.target.value })}
                                placeholder="100%"
                                className="w-full px-2 py-1.5 border border-[#E6EEFF] rounded-lg text-xs font-bold mb-1"
                              />
                              <input
                                type="text"
                                value={aboutForm.statExcellenceLbl}
                                onChange={(e) => setAboutForm({ ...aboutForm, statExcellenceLbl: e.target.value })}
                                placeholder="Practical focus"
                                className="w-full px-2 py-1.5 border border-[#E6EEFF] rounded-lg text-[10px] font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-3">
                          <span className="block text-[10px] font-black text-[#0F1E4A] mb-2 uppercase">Founder Bio details</span>
                          <div className="grid grid-cols-2 gap-3 mb-2">
                            <div>
                              <input
                                type="text"
                                value={aboutForm.founderName || ''}
                                onChange={(e) => setAboutForm({ ...aboutForm, founderName: e.target.value })}
                                placeholder="Founder name (e.g. Ajinkya Amrule)"
                                className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                value={aboutForm.founderRole || ''}
                                onChange={(e) => setAboutForm({ ...aboutForm, founderRole: e.target.value })}
                                placeholder="Founder role (e.g. Director)"
                                className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold"
                              />
                            </div>
                          </div>
                          <textarea
                            value={aboutForm.founderBio || ''}
                            onChange={(e) => setAboutForm({ ...aboutForm, founderBio: e.target.value })}
                            placeholder="Write a brief overview of the founder's certifications, credentials, and vision..."
                            rows={3}
                            className="w-full px-3.5 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold resize-none"
                          />
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-extrabold rounded-xl hover:shadow-md transition-all active:scale-[0.98]"
                          >
                            Save About & Founder Bio
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* CARD 3: CONTACT DETAILS & SOCIALS CMS */}
                    <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-sm space-y-4">
                      <div className="border-b border-[#E6EEFF] pb-3 flex justify-between items-center">
                        <h3 className="font-extrabold text-[#0F1E4A] text-sm flex items-center gap-2">
                          <span className="text-[#FF6FAF]">📞</span> Contact info & Social Coordinates
                        </h3>
                        <span className="text-[9px] bg-pink-55 text-pink-500 px-2 py-0.5 rounded font-extrabold uppercase">Site settings</span>
                      </div>
                      <form onSubmit={(e) => { e.preventDefault(); handleUpdateCmsSetting('contact_details', contactForm); }} className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Official email</label>
                            <input
                              type="email"
                              value={contactForm.email}
                              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                              placeholder="e.g. aamrule90@gmail.com"
                              className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Official phone</label>
                            <input
                              type="text"
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                              placeholder="e.g. +91 77688 38832"
                              className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">School Physical Address</label>
                          <textarea
                            value={contactForm.address}
                            onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                            placeholder="Complete address with lane number, landmark, pin code..."
                            rows={2}
                            className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none resize-none"
                            required
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-3 space-y-3">
                          <span className="block text-[10px] font-black text-[#0F1E4A] uppercase">Social Media Profile Links</span>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Facebook URL</label>
                              <input
                                type="text"
                                value={contactForm.facebook || ''}
                                onChange={(e) => setContactForm({ ...contactForm, facebook: e.target.value })}
                                placeholder="Facebook page link"
                                className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Instagram URL</label>
                              <input
                                type="text"
                                value={contactForm.instagram || ''}
                                onChange={(e) => setContactForm({ ...contactForm, instagram: e.target.value })}
                                placeholder="Instagram handle link"
                                className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">YouTube URL</label>
                              <input
                                type="text"
                                value={contactForm.youtube || ''}
                                onChange={(e) => setContactForm({ ...contactForm, youtube: e.target.value })}
                                placeholder="YouTube channel link"
                                className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Twitter / X URL</label>
                              <input
                                type="text"
                                value={contactForm.twitter || ''}
                                onChange={(e) => setContactForm({ ...contactForm, twitter: e.target.value })}
                                placeholder="Twitter profile link"
                                className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-gradient-to-r from-pink-500 to-[#FF6FAF] text-white text-xs font-extrabold rounded-xl hover:shadow-md transition-all active:scale-[0.98]"
                          >
                            Save Contacts & Socials
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* CARD 4: SEO METADATA & FOOTER IDENTITY CMS */}
                    <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-sm space-y-4">
                      <div className="border-b border-[#E6EEFF] pb-3 flex justify-between items-center">
                        <h3 className="font-extrabold text-[#0F1E4A] text-sm flex items-center gap-2">
                          <span className="text-emerald-500">🛡</span> SEO Configuration & Footer Branding
                        </h3>
                        <span className="text-[9px] bg-emerald-55 text-emerald-500 px-2 py-0.5 rounded font-extrabold uppercase">Meta configs</span>
                      </div>
                      <form onSubmit={(e) => { e.preventDefault(); handleUpdateCmsSetting('seo_metadata', seoForm); handleUpdateCmsSetting('footer', footerForm); }} className="space-y-4">
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Meta Browser Title</label>
                          <input
                            type="text"
                            value={seoForm.title}
                            onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                            placeholder="e.g. Ajinkya's Music School - Pune"
                            className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Meta Snippet Description</label>
                          <textarea
                            value={seoForm.description}
                            onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                            placeholder="Describe classes, location, and specialties for Google Search indexing..."
                            rows={2}
                            className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none resize-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Keywords (Comma Separated)</label>
                          <input
                            type="text"
                            value={seoForm.keywords || ''}
                            onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                            placeholder="music school, piano classes Pune, guitar learning..."
                            className="w-full px-3.5 py-2.5 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-3">
                          <span className="block text-[10px] font-black text-[#0F1E4A] mb-2 uppercase">Footer & Branding Info</span>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Copyright Text</label>
                              <input
                                type="text"
                                value={footerForm.copyrightText || ''}
                                onChange={(e) => setFooterForm({ ...footerForm, copyrightText: e.target.value })}
                                placeholder="© 2026 Ajinkya's Music School. All rights reserved."
                                className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">Footer Tagline/Text</label>
                              <input
                                type="text"
                                value={footerForm.footerText || ''}
                                onChange={(e) => setFooterForm({ ...footerForm, footerText: e.target.value })}
                                placeholder="Inspiring music creation"
                                className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-extrabold rounded-xl hover:shadow-md transition-all active:scale-[0.98]"
                          >
                            Save SEO & Footer configs
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* WhatsApp Connection Toggles */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-4">
                    <h3 className="font-extrabold text-[#0F1E4A] flex items-center gap-2 text-sm pb-2 border-b border-[#E6EEFF]">
                      <Sliders className="w-4 h-4 text-[#5EA8FF]" /> WhatsApp & Chatbot Prefs
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">WhatsApp Notification API</span>
                      <button
                        onClick={() => setWhatsappConnected(!whatsappConnected)}
                        className={`px-4 py-2 text-[10px] font-extrabold uppercase rounded-xl transition-all ${
                          whatsappConnected ? 'bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {whatsappConnected ? 'Connected' : 'Disconnected'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">AI Student Assistant Chatbot</span>
                      <button
                        onClick={() => setChatbotActive(!chatbotActive)}
                        className={`px-4 py-2 text-[10px] font-extrabold uppercase rounded-xl transition-all ${
                          chatbotActive ? 'bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {chatbotActive ? 'Active' : 'Offline'}
                      </button>
                    </div>
                  </div>

                  {/* Batch operating Hours */}
                  <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-4">
                    <h3 className="font-extrabold text-[#0F1E4A] flex items-center gap-2 text-sm pb-2 border-b border-[#E6EEFF]">
                      <Clock className="w-4.5 h-4.5 text-[#5EA8FF]" /> Operating Hours Configuration
                    </h3>
                    <form onSubmit={handleUpdateTimings} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Morning Start</label>
                          <input
                            type="text"
                            value={morningStart}
                            onChange={(e) => setMorningStart(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Morning End</label>
                          <input
                            type="text"
                            value={morningEnd}
                            onChange={(e) => setMorningEnd(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Evening Start</label>
                          <input
                            type="text"
                            value={eveningStart}
                            onChange={(e) => setEveningStart(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          />
                        </div>
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Evening End</label>
                          <input
                            type="text"
                            value={eveningEnd}
                            onChange={(e) => setEveningEnd(e.target.value)}
                            className="w-full px-3 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-[#0F1E4A] hover:bg-[#1a2d61] text-white text-xs font-bold rounded-xl transition-all"
                      >
                        Update Timings
                      </button>
                    </form>
                  </div>
                </div>

                {/* Holiday Planner Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Mark holiday */}
                  <div className="lg:col-span-1 bg-white border border-[#E6EEFF] rounded-[24px] p-6 h-fit space-y-4 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                    <h3 className="font-extrabold text-[#0F1E4A] text-sm pb-2 border-b border-[#E6EEFF]">
                      Mark School Holiday
                    </h3>
                    <form onSubmit={handleAddHoliday} className="space-y-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="weekly"
                          checked={isWeeklyHoliday}
                          onChange={(e) => setIsWeeklyHoliday(e.target.checked)}
                          className="w-4 h-4 rounded text-[#5EA8FF] focus:ring-[#5EA8FF]"
                        />
                        <label htmlFor="weekly" className="text-xs font-bold text-[#0F1E4A] cursor-pointer">Weekly Recurring Holiday</label>
                      </div>

                      {isWeeklyHoliday ? (
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Select Day</label>
                          <select
                            value={weeklyDay}
                            onChange={(e) => setWeeklyDay(Number(e.target.value))}
                            className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                          >
                            <option value={1}>Monday</option>
                            <option value={2}>Tuesday</option>
                            <option value={3}>Wednesday</option>
                            <option value={4}>Thursday</option>
                            <option value={5}>Friday</option>
                            <option value={6}>Saturday</option>
                            <option value={0}>Sunday</option>
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Select Date</label>
                          <input
                            type="date"
                            value={holidayDate}
                            onChange={(e) => setHolidayDate(e.target.value)}
                            className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Reason</label>
                        <input
                          type="text"
                          value={holidayReason}
                          onChange={(e) => setHolidayReason(e.target.value)}
                          placeholder="e.g. Christmas Day"
                          className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white font-extrabold text-xs rounded-xl"
                      >
                        Add Holiday
                      </button>
                    </form>
                  </div>

                  {/* Active holidays list */}
                  <div className="lg:col-span-2 bg-white border border-[#E6EEFF] rounded-[24px] p-6 space-y-4 shadow-[0_15px_40px_rgba(94,168,255,0.03)]">
                    <h3 className="font-extrabold text-[#0F1E4A] text-sm pb-2 border-b border-[#E6EEFF]">
                      Active Holidays Calendar
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-[#FAFBFF] border-b border-[#E6EEFF] text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                            <th className="p-3">Type</th>
                            <th className="p-3">Date / Day</th>
                            <th className="p-3">Reason</th>
                            <th className="p-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {holidays.map(h => (
                            <tr key={h.id} className="border-b border-slate-50 text-xs font-bold text-slate-600 hover:bg-[#FAFBFF] transition-colors">
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                                  h.isRecurringWeekly ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                  {h.isRecurringWeekly ? 'Weekly' : 'Single'}
                                </span>
                              </td>
                              <td className="p-3 text-[#0F1E4A]">
                                {h.isRecurringWeekly 
                                  ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][h.dayOfWeek || 0]
                                  : h.date}
                              </td>
                              <td className="p-3 text-slate-400">{h.reason}</td>
                              <td className="p-3">
                                <button
                                  onClick={() => handleDeleteHoliday(h.id)}
                                  className="text-red-400 hover:text-red-600 border border-transparent p-1.5 rounded-xl hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CONTACT INQUIRIES */}
            {activeTab === 'inquiries' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 md:p-8 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6">
                  
                  {/* Header & Controls */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6EEFF]">
                    <div>
                      <h3 className="text-lg font-black text-[#0F1E4A] tracking-tight">Contact Inquiries</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Manage student queries, admissions, and general inquiries.
                      </p>
                    </div>
                    
                    {/* Search & Filter Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Search Input */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Search className="w-4 h-4 text-slate-400" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search inquiries..."
                          value={inquirySearch}
                          onChange={(e) => {
                            setInquirySearch(e.target.value)
                            setInquiryPage(1)
                          }}
                          className="pl-10 pr-4 py-2.5 bg-slate-50/55 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none transition-all w-full md:w-56"
                        />
                      </div>

                      {/* Purpose Filter */}
                      <div className="relative">
                        <select
                          value={inquiryPurposeFilter}
                          onChange={(e) => {
                            setInquiryPurposeFilter(e.target.value)
                            setInquiryPage(1)
                          }}
                          className="pl-3 pr-8 py-2.5 bg-slate-50/55 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">All Purposes</option>
                          <option value="Admission">Admission</option>
                          <option value="Music Classes">Music Classes</option>
                          <option value="Instrument Inquiry">Instrument Inquiry</option>
                          <option value="Workshop">Workshop</option>
                          <option value="General Inquiry">General Inquiry</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Filter className="w-3.5 h-3.5 text-slate-400" />
                        </span>
                      </div>

                      {/* Status Filter */}
                      <div className="relative">
                        <select
                          value={inquiryStatusFilter}
                          onChange={(e) => {
                            setInquiryStatusFilter(e.target.value)
                            setInquiryPage(1)
                          }}
                          className="pl-3 pr-8 py-2.5 bg-slate-50/55 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">All Statuses</option>
                          <option value="New">New</option>
                          <option value="Read">Read</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Filter className="w-3.5 h-3.5 text-slate-400" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Table View */}
                  {(() => {
                    // Filter logic
                    const filtered = inquiries.filter(inq => {
                      const matchesSearch = 
                        inq.fullName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                        inq.email.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                        inq.phone.toLowerCase().includes(inquirySearch.toLowerCase()) ||
                        inq.message.toLowerCase().includes(inquirySearch.toLowerCase())
                      
                      const matchesPurpose = !inquiryPurposeFilter || inq.purpose === inquiryPurposeFilter
                      const matchesStatus = !inquiryStatusFilter || inq.status === inquiryStatusFilter
                      
                      return matchesSearch && matchesPurpose && matchesStatus
                    })

                    // Pagination
                    const totalInquiries = filtered.length
                    const totalPages = Math.ceil(totalInquiries / inquiriesPerPage) || 1
                    const startIdx = (inquiryPage - 1) * inquiriesPerPage
                    const paginated = filtered.slice(startIdx, startIdx + inquiriesPerPage)

                    return (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-[#E6EEFF] text-[9px] font-black text-slate-400 uppercase tracking-wider">
                                <th className="pb-3 pr-3">Submitted By</th>
                                <th className="pb-3 pr-3">Purpose</th>
                                <th className="pb-3 pr-3">Message Snippet</th>
                                <th className="pb-3 pr-3">Date & Time</th>
                                <th className="pb-3 pr-3">Status</th>
                                <th className="pb-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-xs font-bold text-[#0F1E4A]">
                              {paginated.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="py-12 text-center text-slate-400 font-semibold">
                                    No inquiries found matching current filters.
                                  </td>
                                </tr>
                              ) : (
                                paginated.map(inq => {
                                  // Color tag helper for purpose
                                  let purposeBg = 'bg-slate-50 text-slate-500'
                                  if (inq.purpose === 'Admission') purposeBg = 'bg-blue-50 text-blue-600'
                                  else if (inq.purpose === 'Music Classes') purposeBg = 'bg-purple-50 text-purple-600'
                                  else if (inq.purpose === 'Instrument Inquiry') purposeBg = 'bg-orange-50 text-orange-600'
                                  else if (inq.purpose === 'Workshop') purposeBg = 'bg-pink-50 text-pink-600'

                                  return (
                                    <tr 
                                      key={inq.id} 
                                      className={`hover:bg-slate-50/40 transition-colors ${
                                        inq.status === 'New' ? 'bg-red-50/10' : ''
                                      }`}
                                    >
                                      {/* Submitted By */}
                                      <td className="py-4 pr-3">
                                        <div className="flex flex-col gap-0.5">
                                          <span className="font-extrabold text-slate-800">{inq.fullName}</span>
                                          <span className="text-[10px] text-slate-400 font-medium select-all">{inq.email}</span>
                                          <span className="text-[10px] text-slate-400 font-medium select-all">{inq.phone}</span>
                                        </div>
                                      </td>

                                      {/* Purpose */}
                                      <td className="py-4 pr-3">
                                        <span className={`px-2 py-0.5 rounded-lg text-[9px] uppercase font-black tracking-wider ${purposeBg}`}>
                                          {inq.purpose}
                                        </span>
                                      </td>

                                      {/* Message Snippet */}
                                      <td className="py-4 pr-3 max-w-[200px] xl:max-w-[280px]">
                                        <p className="text-slate-500 font-semibold truncate" title={inq.message}>
                                          {inq.message}
                                        </p>
                                      </td>

                                      {/* Date & Time */}
                                      <td className="py-4 pr-3 text-[10px] text-slate-400 font-medium">
                                        {new Date(inq.createdAt).toLocaleString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </td>

                                      {/* Status Badge */}
                                      <td className="py-4 pr-3">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                          inq.status === 'New' 
                                            ? 'bg-red-50 text-red-650' 
                                            : 'bg-green-50 text-green-650'
                                        }`}>
                                          {inq.status === 'New' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                                          {inq.status}
                                        </span>
                                      </td>

                                      {/* Actions */}
                                      <td className="py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                          {/* View Details button */}
                                          <button
                                            onClick={() => {
                                              setSelectedInquiry(inq)
                                              if (inq.status === 'New') {
                                                handleMarkInquiryRead(inq.id)
                                              }
                                            }}
                                            className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition active:scale-95"
                                            title="View Details"
                                          >
                                            <Eye className="w-3.5 h-3.5" />
                                          </button>

                                          {/* Mark as read button */}
                                          {inq.status === 'New' ? (
                                            <button
                                              onClick={() => handleMarkInquiryRead(inq.id)}
                                              className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition active:scale-95"
                                              title="Mark as read"
                                            >
                                              <Check className="w-3.5 h-3.5" />
                                            </button>
                                          ) : (
                                            <div className="w-7.5 h-7.5" /> // spacing
                                          )}

                                          {/* Reply email button */}
                                          <a
                                            href={`mailto:${inq.email}?subject=Reply%2520to%2520your%2520inquiry`}
                                            className="p-2 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 transition active:scale-95"
                                            title="Reply"
                                          >
                                            <CornerUpLeft className="w-3.5 h-3.5" />
                                          </a>

                                          {/* Delete button */}
                                          <button
                                            onClick={() => handleDeleteInquiry(inq.id)}
                                            className="p-2 bg-red-50 text-red-500 hover:text-red-700 rounded-xl hover:bg-red-100 transition active:scale-95"
                                            title="Delete"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination controls */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between pt-4 border-t border-[#E6EEFF]">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                              Showing {startIdx + 1}-{Math.min(startIdx + inquiriesPerPage, totalInquiries)} of {totalInquiries} inquiries
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setInquiryPage(prev => Math.max(prev - 1, 1))}
                                disabled={inquiryPage === 1}
                                className="p-2 border border-[#E6EEFF] rounded-xl hover:bg-slate-50 transition active:scale-95 disabled:opacity-40"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-black text-[#0F1E4A] px-2.5">{inquiryPage} / {totalPages}</span>
                              <button
                                onClick={() => setInquiryPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={inquiryPage === totalPages}
                                className="p-2 border border-[#E6EEFF] rounded-xl hover:bg-slate-50 transition active:scale-95 disabled:opacity-40"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* TAB: REVIEWS */}
            {activeTab === 'reviews' && (
              <div className="space-y-8 animate-fadeIn">
                <div className="bg-white border border-[#E6EEFF] rounded-[24px] p-6 md:p-8 shadow-[0_15px_40px_rgba(94,168,255,0.03)] space-y-6">
                  
                  {/* Header & Controls */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6EEFF]">
                    <div>
                      <h3 className="text-lg font-black text-[#0F1E4A] tracking-tight">Student Reviews</h3>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">
                        Manage course reviews, moderate comments, and approve testimonials.
                      </p>
                    </div>
                    
                    {/* Search & Filter Controls */}
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Search Input */}
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Search className="w-4 h-4 text-slate-400" />
                        </span>
                        <input
                          type="text"
                          placeholder="Search reviews..."
                          value={reviewsSearch}
                          onChange={(e) => {
                            setReviewsSearch(e.target.value)
                            setReviewsPage(1)
                          }}
                          className="pl-10 pr-4 py-2.5 bg-slate-50/55 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none transition-all w-full md:w-56"
                        />
                      </div>

                      {/* Status Filter */}
                      <div className="relative">
                        <select
                          value={reviewsStatusFilter}
                          onChange={(e) => {
                            setReviewsStatusFilter(e.target.value)
                            setReviewsPage(1)
                          }}
                          className="pl-3 pr-8 py-2.5 bg-slate-50/55 border border-[#E6EEFF] focus:border-[#5EA8FF] rounded-xl text-xs font-bold focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="">All Statuses</option>
                          <option value="PENDING">Pending</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Filter className="w-3.5 h-3.5 text-slate-400" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Table View */}
                  {(() => {
                    // Filter reviews logic
                    const filtered = adminReviews.filter(rev => {
                      const studentName = rev.student?.name || '';
                      const studentEmail = rev.student?.email || '';
                      const courseTitle = rev.Course?.title || '';
                      const comment = rev.comment || '';
                      
                      const matchesSearch = 
                        studentName.toLowerCase().includes(reviewsSearch.toLowerCase()) ||
                        studentEmail.toLowerCase().includes(reviewsSearch.toLowerCase()) ||
                        courseTitle.toLowerCase().includes(reviewsSearch.toLowerCase()) ||
                        comment.toLowerCase().includes(reviewsSearch.toLowerCase())
                      
                      const matchesStatus = !reviewsStatusFilter || rev.status === reviewsStatusFilter
                      
                      return matchesSearch && matchesStatus
                    })

                    const totalReviews = filtered.length
                    const totalPages = Math.ceil(totalReviews / reviewsPerPage) || 1
                    const startIdx = (reviewsPage - 1) * reviewsPerPage
                    const paginated = filtered.slice(startIdx, startIdx + reviewsPerPage)

                    return (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-[#E6EEFF] text-slate-400 text-[10px] font-black uppercase tracking-wider">
                                <th className="pb-3 pl-3">Student</th>
                                <th className="pb-3">Course</th>
                                <th className="pb-3">Rating</th>
                                <th className="pb-3">Comment</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3 text-right pr-3">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginated.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs font-bold">
                                    No student reviews found.
                                  </td>
                                </tr>
                              ) : (
                                paginated.map((rev) => {
                                  let statusColor = 'bg-amber-50 text-amber-650'
                                  if (rev.status === 'APPROVED') statusColor = 'bg-green-50 text-green-650'
                                  if (rev.status === 'REJECTED') statusColor = 'bg-red-50 text-red-650'

                                  return (
                                    <tr key={rev.id} className="border-b border-slate-100/60 hover:bg-[#FAFBFF] text-xs font-bold text-[#0F1E4A] transition-colors">
                                      {/* Student info */}
                                      <td className="py-4 pl-3">
                                        <div>
                                          <span className="block text-slate-800 font-extrabold">{rev.student?.name || 'Unknown Student'}</span>
                                          <span className="text-[10px] text-slate-400 font-semibold mt-0.5 block">{rev.student?.email || '-'}</span>
                                        </div>
                                      </td>

                                      {/* Course */}
                                      <td className="py-4 text-slate-600 font-bold max-w-[150px] truncate" title={rev.Course?.title}>
                                        {rev.Course?.title || '-'}
                                      </td>

                                      {/* Rating */}
                                      <td className="py-4">
                                        <div className="flex text-amber-400">
                                          {[...Array(rev.rating)].map((_, i) => (
                                            <span key={i}>★</span>
                                          ))}
                                          {[...Array(5 - rev.rating)].map((_, i) => (
                                            <span key={i} className="text-slate-200">★</span>
                                          ))}
                                        </div>
                                      </td>

                                      {/* Comment */}
                                      <td className="py-4 text-slate-500 font-medium max-w-[220px] truncate" title={rev.comment}>
                                        {rev.comment}
                                      </td>

                                      {/* Status Badge */}
                                      <td className="py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${statusColor}`}>
                                          {rev.status}
                                        </span>
                                      </td>

                                      {/* Actions */}
                                      <td className="py-4 text-right pr-3">
                                        <div className="flex items-center justify-end gap-1.5">
                                          {/* Approve button */}
                                          {rev.status !== 'APPROVED' && (
                                            <button
                                              onClick={() => handleApproveReview(rev.id)}
                                              className="px-2.5 py-1 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg text-[9px] font-black uppercase tracking-wider transition active:scale-95"
                                              title="Approve Review"
                                            >
                                              Approve
                                            </button>
                                          )}

                                          {/* Reject button */}
                                          {rev.status !== 'REJECTED' && (
                                            <button
                                              onClick={() => handleRejectReview(rev.id)}
                                              className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-505 hover:text-red-700 rounded-lg text-[9px] font-black uppercase tracking-wider transition active:scale-95"
                                              title="Reject Review"
                                            >
                                              Reject
                                            </button>
                                          )}

                                          {/* Delete button */}
                                          <button
                                            onClick={() => handleDeleteReview(rev.id)}
                                            className="p-1.5 bg-slate-50 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition active:scale-95"
                                            title="Delete Review"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination controls */}
                        {totalPages > 1 && (
                          <div className="flex items-center justify-between pt-4 border-t border-[#E6EEFF]">
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                              Showing {startIdx + 1}-{Math.min(startIdx + reviewsPerPage, totalReviews)} of {totalReviews} reviews
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setReviewsPage(prev => Math.max(prev - 1, 1))}
                                disabled={reviewsPage === 1}
                                className="p-2 border border-[#E6EEFF] rounded-xl hover:bg-slate-50 transition active:scale-95 disabled:opacity-40"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-black text-[#0F1E4A] px-2.5">{reviewsPage} / {totalPages}</span>
                              <button
                                onClick={() => setReviewsPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={reviewsPage === totalPages}
                                className="p-2 border border-[#E6EEFF] rounded-xl hover:bg-slate-50 transition active:scale-95 disabled:opacity-40"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )
                  })()}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MODAL: VIEW INQUIRY DETAILS */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-lg border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-[#E6EEFF]">
              <div>
                <h3 className="text-lg font-black text-[#0F1E4A] tracking-tight">Inquiry Details</h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider mt-1.5 ${
                  selectedInquiry.status === 'New' ? 'bg-red-50 text-red-650' : 'bg-green-50 text-green-655'
                }`}>
                  {selectedInquiry.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-[#FF6FAF] font-black text-sm active:scale-90 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold text-[#0F1E4A]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[9px] text-slate-450 font-extrabold uppercase tracking-wider mb-0.5">Full Name</span>
                  <span className="text-slate-800 font-bold text-sm block">{selectedInquiry.fullName}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-455 font-extrabold uppercase tracking-wider mb-0.5">Purpose / Subject</span>
                  <span className="text-slate-800 font-bold block">{selectedInquiry.purpose}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[9px] text-slate-450 font-extrabold uppercase tracking-wider mb-0.5">Email Address</span>
                  <span className="text-slate-800 font-semibold block select-all">{selectedInquiry.email}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-450 font-extrabold uppercase tracking-wider mb-0.5">Phone Number</span>
                  <span className="text-slate-800 font-semibold block select-all">{selectedInquiry.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[9px] text-slate-450 font-extrabold uppercase tracking-wider mb-0.5">Submitted Date</span>
                  <span className="text-slate-650 font-semibold block">
                    {new Date(selectedInquiry.createdAt).toLocaleString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-450 font-extrabold uppercase tracking-wider mb-0.5">IP Address</span>
                  <span className="text-slate-650 font-mono block select-all">{selectedInquiry.ipAddress || 'Unavailable'}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="block text-[9px] text-slate-450 font-extrabold uppercase tracking-wider mb-1">Message</span>
                <div className="p-4 bg-slate-50 border border-[#E6EEFF] rounded-2xl text-slate-700 font-medium leading-relaxed max-h-40 overflow-y-auto whitespace-pre-wrap select-text">
                  {selectedInquiry.message}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E6EEFF] flex items-center justify-between gap-3">
              <button
                onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                className="px-5 py-3 border border-red-150 hover:bg-red-50 text-red-500 rounded-xl text-xs font-bold transition active:scale-95"
              >
                Delete
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedInquiry(null)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl text-xs font-bold transition active:scale-95"
                >
                  Close
                </button>
                
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Reply%20to%20your%20inquiry`}
                  className="px-5 py-3 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] hover:opacity-95 text-white rounded-xl text-xs font-black shadow-sm transition active:scale-95 flex items-center gap-1.5"
                >
                  <CornerUpLeft className="w-3.5 h-3.5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-lg border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto font-sans">
            <div>
              <h3 className="text-lg font-black text-[#0F1E4A]">Add New Category</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Register a new instrument category in the registry.</p>
            </div>
            
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Category ID (Slug)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. guitar"
                    value={catId}
                    onChange={(e) => setCatId(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                    className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Category Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Guitar"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="Master beautiful acoustic, electric, and bass guitar techniques..."
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF] h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Category Image URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /instruments/guitar.jpg"
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Icon SVG Path (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. M9 19V6l12-3v13"
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Starting Price (₹)</label>
                  <input
                    type="number"
                    value={catStartingPrice}
                    onChange={(e) => setCatStartingPrice(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                  <select
                    value={catStatus}
                    onChange={(e) => setCatStatus(e.target.value as any)}
                    className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Coming Soon</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider">Available Levels</label>
                <div className="flex gap-4">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => {
                    const exists = catLevels.includes(lvl)
                    return (
                      <label key={lvl} className="flex items-center gap-2 text-xs font-bold text-[#0F1E4A] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exists}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCatLevels([...catLevels, lvl])
                            } else {
                              setCatLevels(catLevels.filter(x => x !== lvl))
                            }
                          }}
                          className="rounded border-[#E6EEFF] text-[#0F1E4A] focus:ring-[#5EA8FF]"
                        />
                        {lvl}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-[#0F1E4A] pt-2">
                <input
                  type="checkbox"
                  id="catIsVisible"
                  checked={catIsVisible}
                  onChange={(e) => setCatIsVisible(e.target.checked)}
                  className="rounded border-[#E6EEFF] text-[#0F1E4A] focus:ring-[#5EA8FF]"
                />
                <label htmlFor="catIsVisible" className="cursor-pointer">Make category visible on website</label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E6EEFF]">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0F1E4A] hover:bg-[#1a2d61] active:scale-[0.98] text-white text-xs font-black rounded-xl transition-all shadow-md"
                >
                  Create Category
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-400 text-xs font-bold rounded-xl border border-[#E6EEFF] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CATEGORY */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-lg border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto font-sans">
            <div>
              <h3 className="text-lg font-black text-[#0F1E4A]">Edit Category: {editingCategory.name}</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Modify category parameters and starting specs.</p>
            </div>
            
            <form onSubmit={handleSaveCategoryEdit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Guitar"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                />
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  placeholder="Master beautiful acoustic, electric, and bass guitar techniques..."
                  value={catDescription}
                  onChange={(e) => setCatDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF] h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Category Image URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /instruments/guitar.jpg"
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Icon SVG Path (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. M9 19V6l12-3v13"
                    value={catIcon}
                    onChange={(e) => setCatIcon(e.target.value)}
                    className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Starting Price (₹)</label>
                  <input
                    type="number"
                    value={catStartingPrice}
                    onChange={(e) => setCatStartingPrice(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                  <select
                    value={catStatus}
                    onChange={(e) => setCatStatus(e.target.value as any)}
                    className="w-full px-4 py-2 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Coming Soon</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider">Available Levels</label>
                <div className="flex gap-4">
                  {['Beginner', 'Intermediate', 'Advanced'].map((lvl) => {
                    const exists = catLevels.includes(lvl)
                    return (
                      <label key={lvl} className="flex items-center gap-2 text-xs font-bold text-[#0F1E4A] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exists}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCatLevels([...catLevels, lvl])
                            } else {
                              setCatLevels(catLevels.filter(x => x !== lvl))
                            }
                          }}
                          className="rounded border-[#E6EEFF] text-[#0F1E4A] focus:ring-[#5EA8FF]"
                        />
                        {lvl}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-[#0F1E4A] pt-2">
                <input
                  type="checkbox"
                  id="catIsVisibleEdit"
                  checked={catIsVisible}
                  onChange={(e) => setCatIsVisible(e.target.checked)}
                  className="rounded border-[#E6EEFF] text-[#0F1E4A] focus:ring-[#5EA8FF]"
                />
                <label htmlFor="catIsVisibleEdit" className="cursor-pointer">Make category visible on website</label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#E6EEFF]">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#0F1E4A] hover:bg-[#1a2d61] active:scale-[0.98] text-white text-xs font-black rounded-xl transition-all shadow-md"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-400 text-xs font-bold rounded-xl border border-[#E6EEFF] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SIMULATED COURSE */}
      {isAddCourseOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-lg border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-black text-[#0F1E4A]">{editingCourse ? 'Edit Course Level' : 'Add New Course Level'}</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">{editingCourse ? 'Modify course level and advanced parameters.' : 'Register a new instrument level and advanced parameters.'}</p>
            </div>
            
            <form onSubmit={editingCourse ? handleSaveCourseEdit : handleAddCourse} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Course / Level Title</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Drums Intermediate"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Category (Slug)</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold capitalize bg-white"
                  >
                    {instruments.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Level</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Price (INR)</label>
                  <input
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Discount Price (INR)</label>
                  <input
                    type="number"
                    value={courseDiscountPrice}
                    onChange={(e) => setCourseDiscountPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Duration</label>
                  <input
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Instructor</label>
                  <input
                    type="text"
                    value={courseInstructorName}
                    onChange={(e) => setCourseInstructorName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Demo Video URL</label>
                <input
                  type="text"
                  value={courseDemoVideo}
                  onChange={(e) => setCourseDemoVideo(e.target.value)}
                  placeholder="e.g. https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Max Students</label>
                  <input
                    type="number"
                    value={courseMaxStudents}
                    onChange={(e) => setCourseMaxStudents(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Difficulty</label>
                  <select
                    value={courseDifficulty}
                    onChange={(e) => setCourseDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Language</label>
                  <input
                    type="text"
                    value={courseLanguage}
                    onChange={(e) => setCourseLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                  <select
                    value={courseStatus}
                    onChange={(e) => setCourseStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold bg-white"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Thumbnail Path / URL</label>
                <input
                  type="text"
                  value={courseThumbnail}
                  onChange={(e) => setCourseThumbnail(e.target.value)}
                  placeholder="e.g. /courses/piano-beginner.jpg"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#0F1E4A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseHasCertificate}
                    onChange={(e) => setCourseHasCertificate(e.target.checked)}
                    className="rounded border-[#E6EEFF] text-[#5EA8FF]"
                  />
                  Certificate
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-[#0F1E4A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseFeatured}
                    onChange={(e) => setCourseFeatured(e.target.checked)}
                    className="rounded border-[#E6EEFF] text-[#5EA8FF]"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-[#0F1E4A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseUpcoming}
                    onChange={(e) => setCourseUpcoming(e.target.checked)}
                    className="rounded border-[#E6EEFF] text-[#5EA8FF]"
                  />
                  Upcoming
                </label>
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  rows={2}
                />
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h4 className="text-xs font-extrabold text-[#0F1E4A]">SEO Parameters</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">SEO Title</label>
                    <input
                      type="text"
                      value={courseSeoTitle}
                      onChange={(e) => setCourseSeoTitle(e.target.value)}
                      placeholder="Custom browser tab title"
                      className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">SEO Description</label>
                    <textarea
                      value={courseSeoDescription}
                      onChange={(e) => setCourseSeoDescription(e.target.value)}
                      placeholder="Meta snippet description"
                      className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCourseOpen(false)
                    setEditingCourse(null)
                  }}
                  className="flex-1 py-2.5 border border-[#E6EEFF] text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingCourse ? 'Save Changes' : 'Add Course'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE WORKSHOP */}
      {isAddWorkshopOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-md border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp">
            <div>
              <h3 className="text-lg font-black text-[#0F1E4A]">Create New Workshop</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Register a special upcoming masterclass session.</p>
            </div>
            
            <form onSubmit={handleAddWorkshop} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Workshop Title</label>
                <input
                  type="text"
                  value={workshopTitle}
                  onChange={(e) => setWorkshopTitle(e.target.value)}
                  placeholder="e.g. Blues Rhythm Masterclass"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Instructor Name</label>
                <input
                  type="text"
                  value={workshopInstructor}
                  onChange={(e) => setWorkshopInstructor(e.target.value)}
                  placeholder="Ajinkya Amrule"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={workshopDate}
                    onChange={(e) => setWorkshopDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Price (INR)</label>
                  <input
                    type="number"
                    value={workshopPrice}
                    onChange={(e) => setWorkshopPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Time Duration</label>
                <input
                  type="text"
                  value={workshopTime}
                  onChange={(e) => setWorkshopTime(e.target.value)}
                  placeholder="e.g. 02:00 PM - 04:00 PM"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  value={workshopDesc}
                  onChange={(e) => setWorkshopDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none"
                  rows={2}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddWorkshopOpen(false)}
                  className="flex-1 py-2.5 border border-[#E6EEFF] text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Create Workshop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT COURSE DETAILS */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-lg border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-black text-[#0F1E4A]">Edit Course details</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Modify parameters for: <strong className="text-[#5EA8FF]">{editingCourse.title}</strong></p>
            </div>
            
            <form onSubmit={handleSaveCourseEdit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Course Title</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Category (Slug)</label>
                  <select
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold capitalize bg-white"
                  >
                    {instruments.map(inst => (
                      <option key={inst.id} value={inst.id}>{inst.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Level</label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Price (INR)</label>
                  <input
                    type="number"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Discount Price (INR)</label>
                  <input
                    type="number"
                    value={courseDiscountPrice}
                    onChange={(e) => setCourseDiscountPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Duration</label>
                  <input
                    type="text"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Instructor</label>
                  <input
                    type="text"
                    value={courseInstructorName}
                    onChange={(e) => setCourseInstructorName(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Demo Video URL</label>
                <input
                  type="text"
                  value={courseDemoVideo}
                  onChange={(e) => setCourseDemoVideo(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Max Students</label>
                  <input
                    type="number"
                    value={courseMaxStudents}
                    onChange={(e) => setCourseMaxStudents(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Difficulty</label>
                  <select
                    value={courseDifficulty}
                    onChange={(e) => setCourseDifficulty(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold bg-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Language</label>
                  <input
                    type="text"
                    value={courseLanguage}
                    onChange={(e) => setCourseLanguage(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
                  <select
                    value={courseStatus}
                    onChange={(e) => setCourseStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold bg-white"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Thumbnail Path / URL</label>
                <input
                  type="text"
                  value={courseThumbnail}
                  onChange={(e) => setCourseThumbnail(e.target.value)}
                  placeholder="e.g. /courses/piano-beginner.jpg"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-[#0F1E4A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseHasCertificate}
                    onChange={(e) => setCourseHasCertificate(e.target.checked)}
                    className="rounded border-[#E6EEFF] text-[#5EA8FF]"
                  />
                  Certificate
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-[#0F1E4A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseFeatured}
                    onChange={(e) => setCourseFeatured(e.target.checked)}
                    className="rounded border-[#E6EEFF] text-[#5EA8FF]"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-xs font-bold text-[#0F1E4A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={courseUpcoming}
                    onChange={(e) => setCourseUpcoming(e.target.checked)}
                    className="rounded border-[#E6EEFF] text-[#5EA8FF]"
                  />
                  Upcoming
                </label>
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  rows={2}
                />
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h4 className="text-xs font-extrabold text-[#0F1E4A]">SEO Parameters</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">SEO Title</label>
                    <input
                      type="text"
                      value={courseSeoTitle}
                      onChange={(e) => setCourseSeoTitle(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">SEO Description</label>
                    <textarea
                      value={courseSeoDescription}
                      onChange={(e) => setCourseSeoDescription(e.target.value)}
                      className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="flex-1 py-2.5 border border-[#E6EEFF] text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT WORKSHOP DETAILS */}
      {editingWorkshop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-md border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp">
            <div>
              <h3 className="text-lg font-black text-[#0F1E4A]">Edit Workshop details</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Modify parameters for: <strong className="text-[#5EA8FF]">{editingWorkshop.title}</strong></p>
            </div>
            
            <form onSubmit={handleSaveWorkshopEdit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Workshop Title</label>
                <input
                  type="text"
                  value={editWorkshopTitle}
                  onChange={(e) => setEditWorkshopTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Instructor</label>
                <input
                  type="text"
                  value={editWorkshopInstructor}
                  onChange={(e) => setEditWorkshopInstructor(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Date</label>
                  <input
                    type="date"
                    value={editWorkshopDate}
                    onChange={(e) => setEditWorkshopDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Price (INR)</label>
                  <input
                    type="number"
                    value={editWorkshopPrice}
                    onChange={(e) => setEditWorkshopPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Time Slot</label>
                <input
                  type="text"
                  value={editWorkshopTime}
                  onChange={(e) => setEditWorkshopTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                <textarea
                  value={editWorkshopDesc}
                  onChange={(e) => setEditWorkshopDesc(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  rows={2}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingWorkshop(null)}
                  className="flex-1 py-2.5 border border-[#E6EEFF] text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESCHEDULE BOOKING SLOT */}
      {reschedulingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-md border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp">
            <div>
              <h3 className="text-lg font-black text-[#0F1E4A]">Reschedule Booking</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Select a new date and batch slot for: <strong className="text-[#5EA8FF]">{reschedulingBooking.studentName}</strong></p>
            </div>
            
            <form onSubmit={handleRescheduleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Time Slot</label>
                <select
                  value={rescheduleTimeSlot}
                  onChange={(e) => setRescheduleTimeSlot(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl text-xs font-bold focus:outline-none focus:border-[#5EA8FF]"
                  required
                >
                  <option value="">Select Time Slot</option>
                  <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                  <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                  <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
                  <option value="04:00 PM - 05:00 PM">04:00 PM - 05:00 PM</option>
                  <option value="05:00 PM - 06:00 PM">05:00 PM - 06:00 PM</option>
                  <option value="06:00 PM - 07:00 PM">06:00 PM - 07:00 PM</option>
                  <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setReschedulingBooking(null)}
                  className="flex-1 py-2.5 border border-[#E6EEFF] text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F1E4A] hover:bg-[#1a2d61] text-white text-xs font-bold rounded-xl transition-all"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD INSTRUCTOR */}
      {isAddInstructorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-md border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp">
            <div>
              <h3 className="text-lg font-black text-[#0F1E4A]">Add New Instructor</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Register a new masterclass instructor profile.</p>
            </div>
            
            <form onSubmit={handleSaveInstructor} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={instEmail}
                  onChange={(e) => setInstEmail(e.target.value)}
                  placeholder="john.doe@gmail.com"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Expertise / Specialties</label>
                <input
                  type="text"
                  value={instExpertise}
                  onChange={(e) => setInstExpertise(e.target.value)}
                  placeholder="e.g. Piano, Guitar, Ear Training"
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddInstructorOpen(false)}
                  className="flex-1 py-2.5 border border-[#E6EEFF] text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF] text-white text-xs font-bold rounded-xl hover:shadow-lg transition-all"
                >
                  Add Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT INSTRUCTOR */}
      {editingInstructor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-[28px] p-8 w-full max-w-md border border-[#E6EEFF] shadow-2xl space-y-6 animate-scaleUp">
            <div>
              <h3 className="text-lg font-black text-[#0F1E4A]">Edit Instructor Profile</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Modify settings for: <strong className="text-[#5EA8FF]">{editingInstructor.name}</strong></p>
            </div>
            
            <form onSubmit={handleSaveInstructorEdit} className="space-y-4">
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  value={instName}
                  onChange={(e) => setInstName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  value={instEmail}
                  onChange={(e) => setInstEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-extrabold text-slate-400 mb-1.5 uppercase tracking-wider">Expertise / Specialties</label>
                <input
                  type="text"
                  value={instExpertise}
                  onChange={(e) => setInstExpertise(e.target.value)}
                  className="w-full px-4 py-2.5 border border-[#E6EEFF] rounded-xl focus:outline-none focus:border-[#5EA8FF] text-xs font-bold"
                  required
                />
              </div>
              <div className="flex items-center justify-between py-2 border-t border-[#E6EEFF]">
                <span className="text-xs font-bold text-slate-600">Active Profile Status</span>
                <button
                  type="button"
                  onClick={() => setInstActive(!instActive)}
                  className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${
                    instActive ? 'bg-gradient-to-r from-[#5EA8FF] to-[#FF6FAF]' : 'bg-slate-200'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 transform ${
                    instActive ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingInstructor(null)}
                  className="flex-1 py-2.5 border border-[#E6EEFF] text-slate-500 hover:bg-slate-50 text-xs font-bold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#0F1E4A] hover:bg-[#1a2d61] text-white text-xs font-bold rounded-xl transition-all"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl bg-white border border-[#E6EEFF] animate-fade-in-up">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold ${
            adminToast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {adminToast.type === 'success' ? '✓' : '✕'}
          </div>
          <div className="text-xs font-bold text-[#0F1E4A]">{adminToast.text}</div>
        </div>
      )}
    </div>
  )
}
