'use client'

import { useTheme } from '@/contexts/ThemeContext'

export default function WhyChooseUs() {
  const { theme } = useTheme()

  const features = [
    {
      title: 'Professional Musicians',
      description: 'Learn from world-class musicians and music educators with years of performance and teaching experience.',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      color: 'blue'
    },
    {
      title: 'Lifetime Access',
      description: 'Buy once, access forever. All course updates and new lessons included at no extra cost.',
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      color: 'green'
    },
    {
      title: 'Certificate of Completion',
      description: 'Earn recognized music certificates to showcase your musical achievements and skills.',
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z',
      color: 'purple'
    },
    {
      title: 'Global Music Community',
      description: 'Join a vibrant community of musicians and music lovers from over 120 countries worldwide.',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      color: 'orange'
    }
  ]

  const getIconColor = (color: string) => {
    switch(color) {
      case 'blue': return 'text-blue-600'
      case 'green': return 'text-green-600'
      case 'purple': return 'text-purple-600'
      case 'orange': return 'text-orange-600'
      default: return 'text-blue-600'
    }
  }

  const getBgColor = (color: string) => {
    switch(color) {
      case 'blue': return 'bg-blue-100'
      case 'green': return 'bg-green-100'
      case 'purple': return 'bg-purple-100'
      case 'orange': return 'bg-orange-100'
      default: return 'bg-blue-100'
    }
  }

  return (
    <section className={`py-20 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Why Choose 2nd Inversion Musical School?
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            We provide the best music learning experience with features that help you master your instrument.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-2xl transition-all duration-300 hover:shadow-xl ${
                theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {/* Icon */}
              <div className={`w-16 h-16 ${getBgColor(feature.color)} rounded-full flex items-center justify-center mx-auto mb-6`}>
                <svg className={`w-8 h-8 ${getIconColor(feature.color)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                </svg>
              </div>

              {/* Content */}
              <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
