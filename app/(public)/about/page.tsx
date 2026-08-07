'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import MusicBackground from '@/components/MusicBackground'
import MusicSparkle from '@/components/MusicSparkle'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { 
  Music, 
  Award, 
  Users, 
  Globe, 
  Target,
  Eye,
  GraduationCap,
  Mic,
  Piano,
  Star,
  CheckCircle
} from 'lucide-react'

export default function About() {
  const [email, setEmail] = useState('')
  const [mounted, setMounted] = useState(false)
  const { settings } = useSiteSettings()
  const aboutSettings = settings.homepage_about || {}

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleEnroll = () => {
    console.log('Enrollment clicked')
  }


  return (
    <div className="min-h-screen bg-gray-50 relative">
      <MusicBackground />
      <MusicSparkle />
      <Header />
      
      {/* SECTION 1: HERO */}
      <section className="relative bg-gradient-to-br from-black via-purple-900 to-purple-800 text-white pt-32 pb-32 overflow-hidden">
        {/* Music-themed background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,0.1) 35px, rgba(255,255,255,0.1) 70px)`
          }} />
        </div>
        
        {/* Floating music notes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-white/20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                fontSize: `${20 + Math.random() * 20}px`,
                animationDelay: `${Math.random() * 3}s`
              }}
            >
              {['\u266a', '\u266b', '\u266c', '\u2669', '\u266d', '\u266e'][Math.floor(Math.random() * 6)]}
            </div>
          ))}
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            About 2nd Inversion Musical School
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-white/90">
            Excellence in Music Education Since 2018
          </p>
        </div>
      </section>

      {/* SECTION 2: ABOUT SCHOOL */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {aboutSettings.title || "About 2nd Inversion Music School"}
              </h2>
              <p className="text-lg leading-relaxed text-gray-700">
                {aboutSettings.description || "Founded in 2018, 2nd Inversion Music School is a distinguished centre for performing arts education in Pune. We are committed to delivering exceptional, internationally aligned artistic training to gifted and dedicated musicians from across Maharashtra, empowering them to realise their fullest potential as artists, leaders, and confident global citizens."}
              </p>
              
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {aboutSettings.statYearVal || "2018"}
                  </div>
                  <p className="text-gray-600">{aboutSettings.statYearLbl || "Founded"}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {aboutSettings.statStudentVal || "500+"}
                  </div>
                  <p className="text-gray-600">{aboutSettings.statStudentLbl || "Students"}</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {aboutSettings.statExcellenceVal || "6+"}
                  </div>
                  <p className="text-gray-600">{aboutSettings.statExcellenceLbl || "Years Excellence"}</p>
                </div>
              </div>
            </div>
            
            {/* Right: Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <div className="h-96 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Piano className="w-24 h-24 mx-auto mb-4" />
                    <p className="text-xl font-semibold">Music Class in Progress</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-200 rounded-full opacity-50" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-200 rounded-full opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ABOUT FOUNDER */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            About {aboutSettings.founderName || "Ajinkya Uddhav Amrule"}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative order-2 md:order-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <div className="h-96 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                      <Music className="w-16 h-16 text-white" />
                    </div>
                    <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                      <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 mr-2" />
                      <span className="font-semibold">{aboutSettings.founderRole || "Founder & Director"}</span>
                    </div>
                    <p className="text-lg">{aboutSettings.founderName || "Ajinkya Uddhav Amrule"}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Text */}
            <div className="space-y-6 order-1 md:order-2">
              <p className="text-lg leading-relaxed text-gray-700 whitespace-pre-line">
                {aboutSettings.founderBio || "Ajinkya Uddhav Amrule is a distinguished pianist, music educator, and sound engineer based in Pune, Maharashtra. Known for his musical sensitivity and disciplined approach, he has built a strong reputation for nurturing both technical excellence and artistic depth in his students. Through performance, pedagogy, and mentorship, Ajinkya continues to contribute meaningfully to Pune's growing classical and contemporary music landscape."}
              </p>
              
              {/* Qualifications */}
              <div className="flex flex-wrap gap-3 pt-4">
                <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                  Sound Engineering Graduate
                </div>
                <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Piano Specialist
                </div>
                <div className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                  Music Educator
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: MISSION & VISION */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Mission & Vision
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Mission Card */}
            <div className="group relative bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Mission</h3>
                <p className="text-white/90 leading-relaxed">
                  "To provide world-class music education that nurtures creativity, discipline, and artistic excellence."
                </p>
              </div>
            </div>
            
            {/* Vision Card */}
            <div className="group relative bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl" />
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Vision</h3>
                <p className="text-white/90 leading-relaxed">
                  "To develop globally confident musicians and performers."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: WHY CHOOSE US */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: GraduationCap,
                title: "Professional Training",
                description: "Expert-led instruction with proven methodologies",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: Globe,
                title: "International Curriculum",
                description: "Globally recognized music education standards",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: Users,
                title: "Experienced Instructor",
                description: "Learn from industry professionals",
                color: "from-pink-500 to-pink-600"
              },
              {
                icon: Mic,
                title: "Performance Opportunities",
                description: "Regular stage performances and recitals",
                color: "from-indigo-500 to-indigo-600"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Join Our Musical Journey
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Start your musical education with the best in Pune
          </p>
          
          <button
            onClick={handleEnroll}
            className="px-12 py-4 bg-white text-purple-600 font-bold text-lg rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 hover:bg-gray-100"
          >
            Enroll Now
          </button>
          
          {/* Additional info */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>No prior experience required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Flexible class schedules</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-300" />
              <span>Free trial class available</span>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </div>
  )
}
