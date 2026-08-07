// Client-safe default settings configurations for the CMS
export const DEFAULT_SITE_SETTINGS: Record<string, any> = {
  homepage_hero: {
    banner: "Empowering 10,000+ aspiring musicians across India",
    tagline: "Start Your Musical Journey",
    subtitle: "with Confidence",
    description: "Learn piano, guitar, vocals, drums and more with expert instructors. Whether you're a beginner or advancing your skills, build real confidence with structured lessons and practical guidance.",
    primaryButtonText: "Explore Courses",
    primaryButtonUrl: "/courses",
    searchPlaceholder: "Search courses, instruments, or instructors..."
  },
  homepage_about: {
    title: "About 2nd Inversion Music School",
    description: "Founded in 2018, 2nd Inversion Music School is a distinguished centre for performing arts education in Pune. We are committed to delivering exceptional, internationally aligned artistic training to gifted and dedicated musicians from across Maharashtra, empowering them to realise their fullest potential as artists, leaders, and confident global citizens.",
    statYearVal: "2018",
    statYearLbl: "Founded",
    statStudentVal: "500+",
    statStudentLbl: "Students",
    statExcellenceVal: "6+",
    statExcellenceLbl: "Years Excellence",
    founderName: "Ajinkya Uddhav Amrule",
    founderRole: "Founder & Director",
    founderBio: "Ajinkya Uddhav Amrule is a distinguished pianist, music educator, and sound engineer based in Pune, Maharashtra. Known for his musical sensitivity and disciplined approach, he has built a reputation for nurturing both technical excellence and artistic depth in his students. He holds a graduate degree in Sound Engineering, bringing a rare blend of performance insight and production expertise to his teaching. Through performance, pedagogy, and mentorship, Ajinkya continues to contribute meaningfully to Pune's growing classical and contemporary music landscape."
  },
  why_choose_us: {
    title: "Why Choose 2nd Inversion Musical School?",
    description: "We provide the best music learning experience with features that help you master your instrument.",
    features: [
      {
        title: "Professional Musicians",
        description: "Learn from world-class musicians and music educators with years of performance and teaching experience.",
        icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        color: "blue"
      },
      {
        title: "Lifetime Access",
        description: "Buy once, access forever. All course updates and new lessons included at no extra cost.",
        icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        color: "green"
      },
      {
        title: "Certificate of Completion",
        description: "Earn recognized music certificates to showcase your musical achievements and skills.",
        icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
        color: "purple"
      },
      {
        title: "Global Music Community",
        description: "Join a vibrant community of musicians and music lovers from over 120 countries worldwide.",
        icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        color: "orange"
      }
    ]
  },
  contact_details: {
    email: "aamrule90@gmail.com",
    phone: "+91 77688 38832",
    contactPerson: "Ajinkya Uddhav Amrule",
    address: "Sr. No. 56/2/30, House No. B2/30, Kawade Nagar, Lane No. 2, Behind Ganesh Mangal Kendra, Pimple Gurav (New Sangvi), Pune – 411061, Maharashtra, India",
    facebook: "https://facebook.com/2ndinversion",
    instagram: "https://instagram.com/2ndinversion",
    youtube: "https://youtube.com/2ndinversion",
    twitter: "https://twitter.com/2ndinversion"
  },
  seo_metadata: {
    title: "2nd Inversion Musical School | Pune's Premier Music Academy",
    description: "Learn Piano, Guitar, Drums, Vocals and Music Theory with expert Ajinkya Amrule at 2nd Inversion Musical School. Structured courses for Trinity/ABRSM exams.",
    keywords: "music school, piano classes pune, guitar lessons, sound engineering, music theory, trinity music exams"
  },
  logo: {
    logoText: "2nd Inversion",
    logoUrl: "/images/logo_emblem.png"
  },
  footer: {
    copyrightText: "© 2026 2nd Inversion Music School. All rights reserved.",
    footerText: "Providing world-class music education that nurtures creativity, discipline, and artistic excellence."
  },
  homepage_cta: {
    title: "Ready to Start Your Musical Journey? 🎵",
    description: "Join our community of passionate musicians and unlock your full potential with expert guidance and comprehensive training.",
    primaryButtonText: "Browse Courses",
    primaryButtonUrl: "/courses",
    secondaryButtonText: "Get in Touch",
    secondaryButtonUrl: "/contact",
    highlightButtonText: "Sign Up Now",
    highlightButtonUrl: "/signup"
  },
  testimonials: [
    { name: "Sarah M.", rating: 5, comment: "This course is wonderful! The structured lessons made it so easy to follow." },
    { name: "David K.", rating: 5, comment: "Excellent materials and guidance. Ajinkya is a phenomenal teacher." }
  ],
  faqs: [
    { question: "What instruments do you teach?", answer: "We offer professional training in Piano, Guitar, Vocals, Drums, Bass Guitar, and Music Theory." },
    { question: "Do you prepare students for certifications?", answer: "Yes, our curriculum is fully aligned with global certification bodies like Trinity College London and ABRSM." }
  ]
}
