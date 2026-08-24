'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import { 
  Award, 
  BookOpen, 
  Users, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Phone, 
  Mail, 
  ExternalLink, 
  Star, 
  Download, 
  FileText, 
  Play, 
  Calendar, 
  Video,
  X,
  Layers,
  ChevronRight,
  TrendingUp,
  MapPin,
  Laptop
} from 'lucide-react'

// Custom count up hook for stats
function useCountUp(end: number, duration: number = 2000, trigger: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return
    let start = 0
    const increment = end / (duration / 16) // ~60fps
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        clearInterval(timer)
        setCount(end)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end, duration, trigger])

  return count
}

const InstructorCertificateCard = ({ cert, onView, onDownload }: { cert: any; onView: () => void; onDownload: () => void }) => {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-slate-200/80 rounded-[24px] p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group h-full">
      <div className="space-y-4">
        {/* Trinity Crest Brand Representation */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-black shadow-sm">
              T
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              Trinity College
            </span>
          </div>
          <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-black uppercase rounded-md border border-green-150 shadow-sm shrink-0">
            {cert.result}
          </span>
        </div>

        {/* Certificate Title */}
        <div>
          <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
            🎓 {cert.grade}
          </h3>
          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-wider">
            {cert.issuer}
          </p>
        </div>

        {/* Award Detail */}
        <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">
          {cert.award}
        </p>

        {/* Date and Location info */}
        <div className="text-[10px] text-slate-400 font-semibold space-y-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <p><span className="text-slate-400">Date:</span> {cert.date}</p>
          <p><span className="text-slate-400">Center:</span> Pune (303)</p>
        </div>
      </div>

      {/* Button Controls */}
      <div className="flex gap-2.5 mt-5">
        <button
          onClick={onView}
          className="flex-1 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-[11px] hover:bg-blue-600 transition active:scale-[0.98] flex items-center justify-center gap-1 shadow-sm"
        >
          <ExternalLink className="w-3 h-3" /> View
        </button>
        <button
          onClick={onDownload}
          className="px-3.5 py-2.5 bg-white border border-[#E5E7EB] text-slate-700 font-bold rounded-xl text-[11px] hover:bg-slate-50 transition active:scale-[0.98] flex items-center justify-center shadow-sm"
          title="Download Certificate File"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

const CertificateGallery = ({ 
  certifications, 
  onView, 
  onDownload 
}: { 
  certifications: any[]; 
  onView: (index: number) => void; 
  onDownload: (index: number) => void 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {certifications.map((cert, index) => (
        <InstructorCertificateCard
          key={cert.id}
          cert={cert}
          onView={() => onView(index)}
          onDownload={() => onDownload(index)}
        />
      ))}
    </div>
  )
}

const CertificatePreview = ({ imageSrc, alt }: { imageSrc: string; alt: string }) => {
  return (
    <div className="relative w-full aspect-[3/4] max-h-[70vh] flex items-center justify-center bg-[#FCFBF7] border-[12px] border-double border-[#C5A880] shadow-inner rounded-lg overflow-hidden group/zoom">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 640px"
        className="object-contain p-2 transition-transform duration-300 ease-out hover:scale-110"
        priority
      />
    </div>
  )
}

const CertificateModal = ({ 
  isOpen, 
  onClose, 
  cert, 
  onDownload 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  cert: any; 
  onDownload: () => void 
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[24px] border border-slate-200 max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl relative animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition z-10"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <CertificatePreview imageSrc={cert.image} alt={`${cert.grade} - ${cert.issuer}`} />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-slate-100">
          <div className="text-left w-full sm:w-auto">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
              {cert.grade}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Official Credential Verification
            </p>
          </div>
          <button 
            onClick={onDownload}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 w-full sm:w-auto justify-center shadow-md active:scale-[0.98]"
          >
            <Download className="w-4 h-4" /> Download Certificate
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InstructorProfile() {
  const [statsTrigger, setStatsTrigger] = useState(false)
  const [activeGalleryTab, setActiveGalleryTab] = useState<'all' | 'performances' | 'workshops' | 'recitals' | 'classroom'>('all')
  
  // Modals state
  const [isResumeOpen, setIsResumeOpen] = useState(false)
  const [isCertificateOpen, setIsCertificateOpen] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const [activeVideoUrl, setActiveVideoUrl] = useState('')

  const certifications = [
    {
      grade: 'Grade 8 Piano',
      issuer: 'Trinity College London',
      award: 'Level 1 Award in Graded Examination in Music Performance',
      date: '4 August 2025',
      issued: '24 August 2025',
      place: 'Pune-Music & Drama (Centre no. 303)',
      result: 'Distinction',
      qualification: '501/2041/4',
      unit: 'Y/602/4074',
      issueNum: '1',
      trinityId: '1-9391143941:1-9719324067',
      candidateNum: '1-9719324067',
      id: 'grade8',
      image: '/images/Ajinkya_Amrule_Grade_8_Certificate.png'
    },
    {
      grade: 'Grade 7 Piano',
      issuer: 'Trinity College London',
      award: 'Level 1 Award in Graded Examination in Music Performance',
      date: '12 December 2024',
      issued: '31 January 2024',
      place: 'Pune-Music & Drama (Centre no. 303)',
      result: 'Distinction',
      qualification: '501/2041/4',
      unit: 'Y/602/4074',
      issueNum: '1',
      trinityId: '1-9391143941:1-9719324067',
      candidateNum: '1-9719324067',
      id: 'grade7',
      image: '/images/Ajinkya_Amrule_Grade_7_Certificate.png'
    },
    {
      grade: 'Grade 6 Piano',
      issuer: 'Trinity College London',
      award: 'Level 1 Award in Graded Examination in Music Performance',
      date: '15 May 2023',
      issued: '7 July 2023',
      place: 'Pune-Music & Drama (Centre no. 303)',
      result: 'Distinction',
      qualification: '501/2041/4',
      unit: 'Y/602/4074',
      issueNum: '1',
      trinityId: '1-9391143941:1-9719324067',
      candidateNum: '1-9719324067',
      id: 'grade6',
      image: '/images/Ajinkya_Amrule_Grade_6_Certificate.png'
    },
    {
      grade: 'Grade 5 Piano',
      issuer: 'Trinity College London',
      award: 'Level 1 Award in Graded Examination in Music Performance',
      date: '5 May 2022',
      issued: '30 July 2022',
      place: 'Pune-Music & Drama (Centre no. 303)',
      result: 'Distinction',
      qualification: '501/2041/4',
      unit: 'Y/602/4074',
      issueNum: '1',
      trinityId: '1-9391143941:1-9719324067',
      candidateNum: '1-9719324067',
      id: 'grade5',
      image: '/images/Ajinkya_Amrule_Grade_5_Certificate.png'
    }
  ]

  const [selectedCertIndex, setSelectedCertIndex] = useState(0)

  // Trigger stats animation after mounting
  useEffect(() => {
    const timer = setTimeout(() => setStatsTrigger(true), 200)
    return () => clearTimeout(timer)
  }, [])

  // Stats values
  const yearsExp = useCountUp(10, 1500, statsTrigger)
  const studentsTrained = useCountUp(500, 2000, statsTrigger)
  const lessonsDelivered = useCountUp(1000, 2000, statsTrigger)

  // Timeline milestones
  const timeline = [
    {
      year: '2014',
      title: 'Teaching Beginnings',
      desc: 'Began tutoring aspiring musicians privately in Pune, developing a personalized teaching playbook.'
    },
    {
      year: '2016',
      title: 'Trinity College Certification',
      desc: 'Achieved advanced pedagogical benchmarks and aligned curriculum with international standards.'
    },
    {
      year: '2018',
      title: 'Founded 2nd Inversion Music School',
      desc: 'Established the academy physical campus in Pune to offer collaborative and premium music education.'
    },
    {
      year: '2021',
      title: 'Going Hybrid & Expansion',
      desc: 'Scaled to 300+ active students, launching our advanced online portals and virtual learning models.'
    },
    {
      year: '2022',
      title: 'Trinity Grade 5 Distinction',
      desc: 'Awarded Grade 5 Piano with Distinction from Trinity College London.'
    },
    {
      year: '2023',
      title: 'Trinity Grade 6 Distinction',
      desc: 'Awarded Grade 6 Piano with Distinction from Trinity College London.'
    },
    {
      year: '2024',
      title: 'Trinity Grade 7 Distinction',
      desc: 'Awarded Grade 7 Piano with Distinction from Trinity College London.'
    },
    {
      year: '2025',
      title: 'Trinity Grade 8 Distinction',
      desc: 'Awarded Grade 8 Piano with Distinction from Trinity College London.'
    },
    {
      year: '2026',
      title: 'AI Practice Integration',
      desc: 'Leading a community of 500+ active students, piloting smart AI-assisted practice dashboards.'
    }
  ]

  // Testimonials
  const reviews = [
    {
      name: 'Rohan Sen',
      role: 'Advanced Piano Student',
      rating: 5,
      text: 'Ajinkya is a remarkable mentor. His focus on correct finger posture and hand relaxation helped me overcome years of bad habits. The Trinity certification preparation was seamless and motivating!',
      avatar: 'RS'
    },
    {
      name: 'Priya Sharma',
      role: 'Parent of 10yo Student',
      rating: 5,
      text: 'My daughter looked forward to every piano lesson with Ajinkya. His teaching workflow—starting with simple chord structures and moving to complex pieces—makes learning absolute fun.',
      avatar: 'PS'
    },
    {
      name: 'Vikram Malhotra',
      role: 'Adult Guitar Student',
      rating: 5,
      text: 'As an adult learner, I appreciated his flexibility. He customized my lessons so I could learn both classical music theory and contemporary blues patterns. Highly recommended!',
      avatar: 'VM'
    },
    {
      name: 'Ananya Deshmukh',
      role: 'Music Production Student',
      rating: 5,
      text: 'Ajinkya is an expert sound engineer as well. His music production and keyboard arrangement guidance helped me record and master my very first instrumental track. Incredible depth of knowledge.',
      avatar: 'AD'
    }
  ]

  // Gallery items
  const galleryItems = [
    { id: 1, category: 'performances', title: 'Lead Instructor Live Performance', img: '/images/instructor-ajinkya-music-school.jpg' },
    { id: 2, category: 'workshops', title: 'Guitar & Piano Masterclass', img: '/images/instructor-ajinkya-music-school.jpg' },
    { id: 3, category: 'recitals', title: 'Annual Student Showcase Host', img: '/images/instructor-ajinkya-music-school.jpg' },
    { id: 4, category: 'classroom', title: 'Keyboard & Rhythm Lesson', img: '/images/instructor-ajinkya-music-school.jpg' }
  ]

  const filteredGallery = activeGalleryTab === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeGalleryTab)

  const handleDownloadFile = (fileName: string, content: string) => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const triggerResumeDownload = () => {
    const resumeText = `AJINKYA UDDHAV AMRULE - RESUME\n\nRole: Senior Music Instructor & Piano Specialist\nAddress: Sr. No. 56/2/30, Pimple Gurav, Pune\nEmail: aamrule90@gmail.com\nPhone: +91 77688 38832\n\nEXPERIENCE:\n- Founder & Lead Instructor at 2nd Inversion Music School (2018 - Present)\n- Professional Music Educator & Tutor (2014 - Present)\n\nEDUCATION & CERTIFICATIONS:\n- Trinity College London Grade 8 Piano - Distinction (2025)\n- Trinity College London Grade 7 Piano - Distinction (2024)\n- Trinity College London Grade 6 Piano - Distinction (2023)\n- Trinity College London Grade 5 Piano - Distinction (2022)\n- Graduate Degree in Sound & Audio Engineering`;
    handleDownloadFile("Ajinkya_Amrule_Resume.txt", resumeText);
  }

  const triggerCertificateDownload = () => {
    const cert = certifications[selectedCertIndex]
    const certText = `TRINITY COLLEGE LONDON\n${cert.grade} - ${cert.result}\n${cert.award}\nCandidate: Ajinkya Amrule\nDate: ${cert.date}\nPlace of entry: ${cert.place}\nCertificate issued: ${cert.issued}\nResult: ${cert.result}\nQualification number: ${cert.qualification}\nUnit number: ${cert.unit}\nCertificate issue number: ${cert.issueNum}\nTrinity ID: ${cert.trinityId}\nCandidate number: ${cert.candidateNum}`;
    handleDownloadFile(`Trinity_${cert.grade.replace(/\s+/g, '_')}_Certificate_Details.txt`, certText);
  }

  const downloadCertificateImage = (gradeName: string, imageSrc: string) => {
    fetch(imageSrc)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Trinity_${gradeName.replace(/\s+/g, '_')}_Certificate.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch(err => {
        console.error('Failed to download image', err);
        // Fallback to details download
        const cert = certifications.find(c => c.grade === gradeName) || certifications[0];
        const certText = `TRINITY COLLEGE LONDON\n${cert.grade} - ${cert.result}\n${cert.award}\nCandidate: Ajinkya Amrule\nDate: ${cert.date}\nPlace of entry: ${cert.place}\nCertificate issued: ${cert.issued}\nResult: ${cert.result}\nQualification number: ${cert.qualification}\nUnit number: ${cert.unit}\nCertificate issue number: ${cert.issueNum}\nTrinity ID: ${cert.trinityId}\nCandidate number: ${cert.candidateNum}`;
        handleDownloadFile(`Trinity_${cert.grade.replace(/\s+/g, '_')}_Certificate_Details.txt`, certText);
      });
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans relative overflow-x-hidden selection:bg-purple-100 selection:text-purple-900">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-[5%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-blue-300/15 to-purple-400/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-pink-300/15 to-purple-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-15%] w-[550px] h-[550px] bg-gradient-to-tr from-blue-300/10 to-pink-400/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Navigation Header */}
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pb-28 border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            
            {/* Left: Photo Column */}
            <div className="w-full lg:w-5/12 flex flex-col items-center">
              <div className="relative w-[280px] sm:w-[360px] h-[330px] sm:h-[420px] rounded-[32px] overflow-hidden group shadow-[0_20px_50px_rgba(37,99,235,0.08)] bg-slate-50 border-4 border-white/60">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
                <img 
                  src="/images/instructor_portrait.jpg" 
                  alt="Ajinkya Amrule - Senior Music Instructor" 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                
                {/* Floating Glassmorphic Badges */}
                <div className="absolute top-4 left-4 z-20 bg-white/80 backdrop-blur-md border border-white/50 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-800 uppercase tracking-wider">Available for booking</span>
                </div>
              </div>
            </div>

            {/* Right: Intro Details */}
            <div className="w-full lg:w-7/12 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                <span className="px-3.5 py-1.5 bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                  <Award className="w-3.5 h-3.5" /> Senior Music Instructor
                </span>
                <span className="px-3.5 py-1.5 bg-purple-50 border border-purple-100 text-purple-600 text-xs font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                  🎹 Piano Specialist
                </span>
                <span className="px-3.5 py-1.5 bg-pink-50 border border-pink-100 text-pink-600 text-xs font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                  🏆 Trinity Certified
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                Ajinkya Uddhav Amrule
              </h1>
              
              <p className="text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                Music educator, pianist, and sound engineer. Committed to helping beginners and advanced musicians build confidence, professional technique, and musical expression through structured, personalized training.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap items-center gap-4 pt-4 w-full justify-center lg:justify-start">
                <a 
                  href="/booking" 
                  className="px-8 py-4 bg-gradient-to-r from-[#2563EB] via-[#7C3AED] to-[#EC4899] text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:shadow-blue-500/10 active:scale-[0.98] transition-all text-sm w-full sm:w-auto text-center"
                >
                  Book Free Trial Class &rarr;
                </a>
                <button 
                  onClick={() => setIsResumeOpen(true)}
                  className="px-6 py-4 bg-slate-50 border border-[#E5E7EB] text-slate-700 font-bold rounded-2xl hover:bg-slate-100 hover:border-slate-350 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <FileText className="w-4 h-4 text-purple-500" /> View CV
                </button>
                <button 
                  onClick={() => setIsCertificateOpen(true)}
                  className="px-6 py-4 bg-slate-50 border border-[#E5E7EB] text-slate-700 font-bold rounded-2xl hover:bg-slate-100 hover:border-slate-350 active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Award className="w-4 h-4 text-pink-500" /> View Certificate
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT INSTRUCTOR */}
      <section className="py-20 border-b border-slate-100 bg-slate-50/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Biography Content */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">BIOGRAPHY</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Unlocking Musical Potential
                </h2>
              </div>
              <div className="text-slate-600 font-medium text-sm sm:text-base leading-relaxed space-y-4">
                <p>
                  Welcome to my portfolio. I am <strong>Ajinkya Uddhav Amrule</strong>, professional music educator, classical pianist, and audio engineer. My musical journey spans over a decade of teaching, performing, and mentoring students to achieve national and international honors.
                </p>
                <p>
                  As the founder of <em>2nd Inversion Music School</em> in Pune, my pedagogy centers around the student. I believe music education should combine rigorous technical discipline (including accurate finger posture, sheet reading, and hand relaxation) with creative exploration and play.
                </p>
                <p>
                  Whether preparing students for accredited international examinations, leading masterclasses, or teaching digital audio production, I maintain a supportive, structure-oriented environment. Together, we unlock the expressive beauty of the keys.
                </p>
              </div>

              {/* Teaching Philosophy highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex gap-3 bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-sm">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">Tailored Lesson Plans</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Curriculums adjusted dynamically for every age and music taste.</p>
                  </div>
                </div>
                <div className="flex gap-3 bg-white p-4 border border-[#E5E7EB] rounded-2xl shadow-sm">
                  <CheckCircle className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 mb-1">Accredited Pedagogy</h4>
                    <p className="text-[11px] text-slate-400 font-medium">Aligned with premium standards of Trinity College London.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Quick Facts Card */}
            <div className="lg:col-span-4 bg-white border border-[#E5E7EB] rounded-3xl p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              <h3 className="text-base font-bold text-slate-900 mb-6">Quick Instructor Profile</h3>
              
              <ul className="space-y-4 text-xs font-semibold text-slate-500">
                <li className="flex justify-between border-b border-slate-50 pb-3">
                  <span>Lead Instrument</span>
                  <span className="font-extrabold text-slate-800">Piano / Keyboard</span>
                </li>
                <li className="flex justify-between border-b border-slate-50 pb-3">
                  <span>Additional Focus</span>
                  <span className="font-extrabold text-slate-800">Guitar, Vocal Training</span>
                </li>
                <li className="flex justify-between border-b border-slate-50 pb-3">
                  <span>Certifications</span>
                  <span className="font-extrabold text-slate-800">Trinity College London</span>
                </li>
                <li className="flex justify-between border-b border-slate-50 pb-3">
                  <span>Education</span>
                  <span className="font-extrabold text-slate-800">Graduate in Sound Engineering</span>
                </li>
                <li className="flex justify-between border-b border-slate-50 pb-3">
                  <span>Active Location</span>
                  <span className="font-extrabold text-slate-800">Pune, Maharashtra</span>
                </li>
                 <li className="flex justify-between items-center pb-1">
                  <span>Holiday</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 border border-red-100 text-red-600">Monday: Closed</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* 3. EXPERTISE */}
      <section className="py-20 border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100 mb-4">SKILL BADGES</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Areas of Music Expertise</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { name: 'Piano', emoji: '🎹', desc: 'Classical & Contemporary scales, chords, postures.' },
              { name: 'Guitar', emoji: '🎸', desc: 'Tuning, strumming patterns, open & bar chords.' },
              { name: 'Vocal Training', emoji: '🎤', desc: 'Breathing, alignment, pitches, resonance.' },
              { name: 'Music Theory', emoji: '🎼', desc: 'Reading sheets, writing staves, ear training.' },
              { name: 'Keyboard', emoji: '🎹', desc: 'Electronic synths, rhythm backing, play-along.' },
              { name: 'Music Production', emoji: '🎛️', desc: 'Sound engineering, recording, audio mastering.' }
            ].map((skill, index) => (
              <div 
                key={index} 
                className="group bg-white border border-[#E5E7EB] rounded-2xl p-5 text-center shadow-sm hover:border-purple-400 hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-default flex flex-col items-center"
              >
                <span className="text-4xl mb-4 p-3 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-300 select-none">
                  {skill.emoji}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-purple-600 transition-colors">
                  {skill.name}
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                  {skill.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. EXPERIENCE TIMELINE */}
      <section className="py-20 border-b border-slate-100 bg-slate-50/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100 mb-4">TIMELINE</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Milestones & History</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          </div>

          <div className="relative border-l border-slate-200 max-w-3xl mx-auto pl-8 sm:pl-10 space-y-12">
            {timeline.map((item, index) => (
              <div key={index} className="relative group">
                {/* Timeline dot */}
                <div className="absolute -left-[41px] sm:-left-[49px] top-1.5 w-6 h-6 rounded-full bg-white border-4 border-purple-500 group-hover:bg-purple-500 group-hover:border-purple-100 transition-all duration-300 shadow-sm" />
                
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300">
                  <span className="inline-block px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-lg mb-3">
                    {item.year}
                  </span>
                  <h3 className="text-sm font-extrabold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PROFESSIONAL CERTIFICATIONS */}
      <section className="py-20 border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 mb-4">CERTIFICATION</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Credential & Accreditation</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          </div>

          <CertificateGallery 
            certifications={certifications} 
            onView={(index) => {
              setSelectedCertIndex(index);
              setIsCertificateOpen(true);
            }} 
            onDownload={(index) => {
              const cert = certifications[index];
              downloadCertificateImage(cert.grade, cert.image);
            }} 
          />
        </div>
      </section>

      {/* 6. ACHIEVEMENTS */}
      <section className="py-20 border-b border-slate-100 bg-slate-50/30">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100 mb-4">ACHIEVEMENTS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Milestones & Statistics</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <span className="text-3xl p-3 bg-blue-50 rounded-xl inline-block mb-4 select-none">⏰</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                {yearsExp}+ Years
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Experience</p>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <span className="text-3xl p-3 bg-purple-50 rounded-xl inline-block mb-4 select-none">🎓</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                {studentsTrained}+ Students
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Learners Trained</p>
            </div>

            <div className="bg-white border border-[#E5E7EB] rounded-2xl p-6 text-center shadow-sm relative overflow-hidden group hover:-translate-y-1 hover:shadow-md transition-all duration-300">
              <span className="text-3xl p-3 bg-pink-50 rounded-xl inline-block mb-4 select-none">🎥</span>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                {lessonsDelivered}+ Lessons
              </h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivered Sessions</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TEACHING METHOD */}
      <section className="py-20 border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-widest bg-purple-50 px-4 py-1.5 rounded-full border border-purple-100 mb-4">PEDAGOGY</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">My Four-Step Learning Workflow</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {[
              { step: '01', name: 'Assessment', desc: 'Identify individual student rhythm, focus areas, and skill gaps.' },
              { step: '02', name: 'Personalized Plan', desc: 'Design customized music sheet books and finger exercises.' },
              { step: '03', name: 'Weekly Practice', desc: 'Deliver interactive studio lectures and online assignments.' },
              { step: '04', name: 'Performance Eval', desc: 'Provide audio feedback and periodic stage recital checks.' }
            ].map((method, index) => (
              <div key={index} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm relative hover:border-purple-300 hover:shadow-md transition-all duration-300">
                <span className="text-3xl font-black text-purple-200 block mb-4">
                  {method.step}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mb-2">
                  {method.name}
                </h3>
                <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                  {method.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. STUDENT REVIEWS */}
      <section className="py-20 border-b border-slate-100 bg-slate-50/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100 mb-4">TESTIMONIALS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">What My Students Say</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((rev, index) => (
              <div key={index} className="bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-5 items-start">
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-black shadow-sm shrink-0">
                  {rev.avatar}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{rev.role}</p>
                    </div>
                    <div className="flex text-amber-400 select-none">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic">
                    "{rev.text}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. PHOTO GALLERY */}
      <section className="py-20 border-b border-slate-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 mb-4">GALLERY</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Capturing Musical Moments</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mb-8" />

            {/* Gallery Filters */}
            <div className="flex flex-wrap gap-2.5 justify-center">
              {[
                { id: 'all', label: 'All Activities' },
                { id: 'performances', label: 'Performances' },
                { id: 'workshops', label: 'Workshops' },
                { id: 'recitals', label: 'Recitals' },
                { id: 'classroom', label: 'Classroom' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGalleryTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                    activeGalleryTab === tab.id
                      ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                      : 'bg-white border-[#E5E7EB] text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGallery.map((item) => (
              <div 
                key={item.id} 
                className="group border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm bg-white hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative bg-slate-50">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4 space-y-1">
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. VIDEOS */}
      <section className="py-20 border-b border-slate-100 bg-slate-50/20">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16 flex flex-col items-center">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-4 py-1.5 rounded-full border border-pink-100 mb-4">VIDEOS</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Introduction & Performances</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Video Card 1 */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-56 bg-gradient-to-br from-slate-800 to-slate-905 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40 z-10" />
                {/* Music note background graphics */}
                <span className="absolute text-white/5 text-9xl font-black z-0 pointer-events-none select-none">🎹</span>
                
                <button 
                  onClick={() => {
                    setActiveVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')
                    setIsVideoOpen(true)
                  }}
                  className="w-14 h-14 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-[0.95] transition-all relative z-20"
                >
                  <Play className="w-6 h-6 fill-blue-600 ml-1" />
                </button>
              </div>
              <div className="p-5">
                <span className="px-2.5 py-0.5 bg-blue-50 text-[#2563EB] text-[9px] font-black uppercase rounded-md tracking-wider">Course Preview</span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-2">Piano Masterclass Introduction</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Get a preview of basic finger practices and postures.</p>
              </div>
            </div>

            {/* Video Card 2 */}
            <div className="bg-white border border-[#E5E7EB] rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="relative h-56 bg-gradient-to-br from-slate-800 to-slate-905 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/40 z-10" />
                {/* Music note background graphics */}
                <span className="absolute text-white/5 text-9xl font-black z-0 pointer-events-none select-none">🎸</span>
                
                <button 
                  onClick={() => {
                    setActiveVideoUrl('https://www.youtube.com/embed/dQw4w9WgXcQ')
                    setIsVideoOpen(true)
                  }}
                  className="w-14 h-14 bg-white text-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-[0.95] transition-all relative z-20"
                >
                  <Play className="w-6 h-6 fill-purple-600 ml-1" />
                </button>
              </div>
              <div className="p-5">
                <span className="px-2.5 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-black uppercase rounded-md tracking-wider">Studio Performance</span>
                <h3 className="font-extrabold text-sm text-slate-900 mt-2">Classical Piano Recital: Beethoven</h3>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">Watch live piano recital recorded at the annual showcase.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. CONTACT CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-[32px] p-8 md:p-12 text-white shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full text-xs font-black tracking-widest uppercase">
                GET STARTED
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-none">
                Start Your Musical Journey
              </h2>
              <p className="text-sm md:text-base text-white/90 leading-relaxed max-w-lg mx-auto font-medium">
                Book a free trial class, or call/message me directly to discuss your study goal.
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <a 
                  href="/booking" 
                  className="px-8 py-4 bg-white text-[#2563EB] hover:text-[#1d4ed8] font-bold rounded-2xl shadow-md transition active:scale-[0.98] text-sm shrink-0"
                >
                  Book Free Trial
                </a>
                <a 
                  href="https://wa.me/917768838832" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-md transition active:scale-[0.98] text-sm flex items-center justify-center gap-1.5 shrink-0"
                >
                  WhatsApp Me
                </a>
                <a 
                  href="tel:+917768838832" 
                  className="px-6 py-4 bg-white/15 border border-white/20 text-white hover:bg-white/25 font-bold rounded-2xl shadow-md transition active:scale-[0.98] text-sm flex items-center justify-center gap-1.5 shrink-0"
                >
                  Call Now
                </a>
                <a 
                  href="mailto:aamrule90@gmail.com" 
                  className="px-6 py-4 bg-white/15 border border-white/20 text-white hover:bg-white/25 font-bold rounded-2xl shadow-md transition active:scale-[0.98] text-sm flex items-center justify-center gap-1.5 shrink-0"
                >
                  Email Me
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================= MODALS ================================= */}

      {/* 1. Resume CV Modal */}
      {isResumeOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] border border-slate-200 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl relative animate-scaleUp">
            <button 
              onClick={() => setIsResumeOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Ajinkya Uddhav Amrule</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Senior Music Instructor & Piano Specialist</p>
              </div>
              <button 
                onClick={triggerResumeDownload}
                className="px-4 py-2 bg-blue-50 text-[#2563EB] hover:bg-blue-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download TXT
              </button>
            </div>

            <div className="space-y-6 text-xs font-semibold text-slate-500 leading-relaxed">
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 border-l-4 border-blue-500 pl-2">Executive Summary</h4>
                <p>
                  Experienced classical pianist, music educator, and audio engineer. Founder and Lead Instructor of 2nd Inversion Music School, Pune. Over 10 years of experience teaching learners of all age groups and aligning curriculums with Trinity College London requirements.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 border-l-4 border-purple-500 pl-2">Professional Experience</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-slate-800">
                      <span className="font-extrabold">Lead Music Instructor & Founder</span>
                      <span>2018 - Present</span>
                    </div>
                    <p className="text-[10px] text-slate-400">2nd Inversion Music School, Pune</p>
                    <p className="mt-1">
                      Designed and executed the core music curriculum for piano, keyboard, and acoustic guitar. Managed academic enrollments, hosted annual recitals, and guided 120+ active learners weekly.
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between text-slate-800">
                      <span className="font-extrabold">Professional Music Tutor</span>
                      <span>2014 - 2018</span>
                    </div>
                    <p className="text-[10px] text-slate-400">Pune, Maharashtra</p>
                    <p className="mt-1">
                      Instructed learners on classical piano practices, posture alignment, and notation reading. Achieved 95%+ student pass rates in Trinity grade examinations.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 border-l-4 border-pink-500 pl-2">Education & Certifications</h4>
                <ul className="space-y-2 text-slate-650">
                  <li className="flex justify-between">
                    <span>Grade 8 Piano Certificate with Distinction — Trinity College London</span>
                    <span>2025</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Grade 7 Piano Certificate with Distinction — Trinity College London</span>
                    <span>2024</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Grade 6 Piano Certificate with Distinction — Trinity College London</span>
                    <span>2023</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Grade 5 Piano Certificate with Distinction — Trinity College London</span>
                    <span>2022</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Graduate Degree in Sound & Audio Engineering</span>
                    <span>2015</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        cert={certifications[selectedCertIndex]}
        onDownload={() => {
          const cert = certifications[selectedCertIndex];
          downloadCertificateImage(cert.grade, cert.image);
        }}
      />

      {/* 3. YouTube Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-black rounded-2xl max-w-3xl w-full aspect-video shadow-2xl relative overflow-hidden animate-scaleUp">
            <button 
              onClick={() => {
                setActiveVideoUrl('')
                setIsVideoOpen(false)
              }}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {activeVideoUrl && (
              <iframe 
                src={activeVideoUrl} 
                className="w-full h-full border-0"
                allowFullScreen
                allow="autoplay; encrypted-media"
                title="Performance Video Player"
              ></iframe>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
