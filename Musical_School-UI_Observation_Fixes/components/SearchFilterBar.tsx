'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, ChevronDown, X } from 'lucide-react'

interface Course {
  id: string
  title: string
  instructor: string
  level: string
  duration: string
  price: number
  rating: number
  students: number
  image: string
  description: string
  highlights: string[]
  category: string
}

interface SearchFilterBarProps {
  courses: Course[]
  onFilteredCourses: (courses: Course[]) => void
}

export default function SearchFilterBar({ courses, onFilteredCourses, isDarkMode }: { courses: Course[], onFilteredCourses: (courses: Course[]) => void, isDarkMode?: boolean }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedLevel, setSelectedLevel] = useState('All Levels')
  const [selectedPrice, setSelectedPrice] = useState('All Prices')
  const [filteredCourses, setFilteredCourses] = useState(courses)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isLevelOpen, setIsLevelOpen] = useState(false)
  const [isPriceOpen, setIsPriceOpen] = useState(false)

  const categoryRef = useRef<HTMLDivElement>(null)
  const levelRef = useRef<HTMLDivElement>(null)
  const priceRef = useRef<HTMLDivElement>(null)

  const categories = ['All Categories', 'Piano', 'Guitar', 'Vocals', 'Drums', 'Music Theory', 'Violin']
  const levels = ['All Levels', 'Beginner', 'Intermediate', 'Advanced', 'All Levels']
  const prices = ['All Prices', 'Free', '0-500', '500-2000', '2000+']

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false)
      }
      if (levelRef.current && !levelRef.current.contains(event.target as Node)) {
        setIsLevelOpen(false)
      }
      if (priceRef.current && !priceRef.current.contains(event.target as Node)) {
        setIsPriceOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    let filtered = courses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Level filter
    if (selectedLevel !== 'All Levels') {
      filtered = filtered.filter(course => course.level === selectedLevel)
    }

    // Price filter
    if (selectedPrice !== 'All Prices') {
      filtered = filtered.filter(course => {
        const price = course.price
        switch (selectedPrice) {
          case 'Free':
            return price === 0
          case '0-500':
            return price > 0 && price <= 500
          case '500-2000':
            return price > 500 && price <= 2000
          case '2000+':
            return price > 2000
          default:
            return true
        }
      })
    }

    setFilteredCourses(filtered)
    onFilteredCourses(filtered)
  }, [searchTerm, selectedCategory, selectedLevel, selectedPrice, courses, onFilteredCourses])

  const clearAllFilters = () => {
    setSearchTerm('')
    setSelectedCategory('All Categories')
    setSelectedLevel('All Levels')
    setSelectedPrice('All Prices')
  }

  const hasActiveFilters = searchTerm || selectedCategory !== 'All Categories' || 
                          selectedLevel !== 'All Levels' || selectedPrice !== 'All Prices'

  return (
    <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border border-purple-700' : 'bg-white border border-gray-200'}`}>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border border-purple-600 text-white placeholder-gray-400' : 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500'}`}
            />
          </div>
        </div>

        {/* Category Dropdown */}
        <div ref={categoryRef} className="relative">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className={`px-4 py-3 rounded-xl text-left flex items-center justify-between w-full lg:w-48 transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border border-purple-600 text-white hover:border-purple-500' : 'bg-gray-50 border border-gray-300 text-gray-700 hover:border-gray-400'}`}
          >
            <span>{selectedCategory}</span>
            <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </button>
          {isCategoryOpen && (
            <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg z-10 overflow-hidden ${isDarkMode ? 'bg-gray-700 border border-purple-600' : 'bg-white border border-gray-300'}`}>
              <div className="max-h-48 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setIsCategoryOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-purple-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Level Dropdown */}
        <div ref={levelRef} className="relative">
          <button
            onClick={() => setIsLevelOpen(!isLevelOpen)}
            className={`px-4 py-3 rounded-xl text-left flex items-center justify-between w-full lg:w-48 transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border border-purple-600 text-white hover:border-purple-500' : 'bg-gray-50 border border-gray-300 text-gray-700 hover:border-gray-400'}`}
          >
            <span>{selectedLevel}</span>
            <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </button>
          {isLevelOpen && (
            <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg z-10 overflow-hidden ${isDarkMode ? 'bg-gray-700 border border-purple-600' : 'bg-white border border-gray-300'}`}>
              <div className="max-h-48 overflow-y-auto">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setSelectedLevel(level)
                      setIsLevelOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-purple-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Dropdown */}
        <div ref={priceRef} className="relative">
          <button
            onClick={() => setIsPriceOpen(!isPriceOpen)}
            className={`px-4 py-3 rounded-xl text-left flex items-center justify-between w-full lg:w-48 transition-all duration-200 ${isDarkMode ? 'bg-gray-700 border border-purple-600 text-white hover:border-purple-500' : 'bg-gray-50 border border-gray-300 text-gray-700 hover:border-gray-400'}`}
          >
            <span>{selectedPrice}</span>
            <ChevronDown className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
          </button>
          {isPriceOpen && (
            <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg z-10 overflow-hidden ${isDarkMode ? 'bg-gray-700 border border-purple-600' : 'bg-white border border-gray-300'}`}>
              <div className="max-h-48 overflow-y-auto">
                {prices.map((price) => (
                  <button
                    key={price}
                    onClick={() => {
                      setSelectedPrice(price)
                      setIsPriceOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-purple-600' : 'text-gray-700 hover:bg-gray-100'}`}
                  >
                    {price === '0-500' ? 'Free - $500' : price === '500-2000' ? '$500 - $2000' : price === '2000+' ? '$2000+' : price}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm || selectedCategory !== 'All Categories' || selectedLevel !== 'All Levels' || selectedPrice !== 'All Prices') && (
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active filters:</span>
          {searchTerm && (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-purple-700 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
              "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className={`ml-1 ${isDarkMode ? 'hover:text-purple-100' : 'hover:text-purple-900'}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCategory !== 'All Categories' && (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-purple-700 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
              {selectedCategory}
              <button
                onClick={() => setSelectedCategory('All Categories')}
                className={`ml-1 ${isDarkMode ? 'hover:text-purple-100' : 'hover:text-purple-900'}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedLevel !== 'All Levels' && (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-purple-700 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
              {selectedLevel}
              <button
                onClick={() => setSelectedLevel('All Levels')}
                className={`ml-1 ${isDarkMode ? 'hover:text-purple-100' : 'hover:text-purple-900'}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedPrice !== 'All Prices' && (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-purple-700 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
              {selectedPrice === '0-500' ? 'Free - $500' : selectedPrice === '500-2000' ? '$500 - $2000' : selectedPrice === '2000+' ? '$2000+' : selectedPrice}
              <button
                onClick={() => setSelectedPrice('All Prices')}
                className={`ml-2 ${isDarkMode ? 'hover:text-purple-100' : 'hover:text-purple-600'}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className={`text-sm font-medium transition-colors ${isDarkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  )
}
