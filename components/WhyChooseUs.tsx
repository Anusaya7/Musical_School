'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import { DEFAULT_SITE_SETTINGS } from '@/lib/settings-defaults'

export default function WhyChooseUs() {
  const { theme } = useTheme()
  const { settings } = useSiteSettings()

  const sectionSettings = settings.why_choose_us || {}
  const features = sectionSettings.features || DEFAULT_SITE_SETTINGS.why_choose_us.features

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600'
      case 'green': return 'text-green-600'
      case 'purple': return 'text-purple-600'
      case 'orange': return 'text-orange-600'
      default: return 'text-blue-600'
    }
  }

  const getBgColor = (color: string) => {
    switch (color) {
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
            {sectionSettings.title || "Why Choose 2nd Inversion Musical School?"}
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {sectionSettings.description || "We provide the best music learning experience with features that help you master your instrument."}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`text-center p-6 rounded-2xl transition-all duration-300 hover:shadow-xl ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-gray-50 hover:bg-gray-100'
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
