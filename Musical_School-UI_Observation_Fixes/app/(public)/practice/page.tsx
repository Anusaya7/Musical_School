'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Header from '@/components/Header'
import { useTheme } from '@/contexts/ThemeContext'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Music,
  Piano,
  Guitar,
  Drum,
  Mic,
  Clock,
  TrendingUp,
  Calendar,
  Award,
  Target,
  BarChart3,
  Flame,
  Play,
  Pause,
  CheckCircle,
  Download,
  FileText
} from 'lucide-react'

interface Exercise {
  id: string
  title: string
  description: string
  duration: number
  videoUrl?: string
  sheetUrl?: string
  level: string
  category: string
  completed: boolean
}

function PracticePageContent() {
  const { theme } = useTheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const instrument = searchParams.get('instrument') || 'piano'
  const [selectedLevel, setSelectedLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)

  // Mock exercise data
  const exerciseData: { [key: string]: { [level: string]: Exercise[] } } = {
    piano: {
      beginner: [
        {
          id: 'p1',
          title: 'Basic Finger Positioning',
          description: 'Learn proper hand positioning and finger numbers',
          duration: 15,
          videoUrl: '#',
          sheetUrl: '#',
          level: 'beginner',
          category: 'Technique',
          completed: false
        },
        {
          id: 'p2',
          title: 'C Major Scale',
          description: 'Master the C major scale with proper fingering',
          duration: 20,
          videoUrl: '#',
          sheetUrl: '#',
          level: 'beginner',
          category: 'Scales',
          completed: false
        }
      ]
    },
    guitar: {
      beginner: [
        {
          id: 'g1',
          title: 'Holding the Guitar',
          description: 'Proper posture and hand positioning',
          duration: 15,
          videoUrl: '#',
          sheetUrl: '#',
          level: 'beginner',
          category: 'Technique',
          completed: false
        },
        {
          id: 'g2',
          title: 'Basic Open Chords',
          description: 'Learn E, A, D, G, C, and F chords',
          duration: 30,
          videoUrl: '#',
          sheetUrl: '#',
          level: 'beginner',
          category: 'Chords',
          completed: false
        }
      ]
    },
    drums: {
      beginner: [
        {
          id: 'd1',
          title: 'Basic Grip and Posture',
          description: 'Proper drum stick grip and sitting position',
          duration: 15,
          videoUrl: '#',
          sheetUrl: '#',
          level: 'beginner',
          category: 'Technique',
          completed: false
        }
      ]
    },
    vocals: {
      beginner: [
        {
          id: 'v1',
          title: 'Breathing Basics',
          description: 'Proper diaphragmatic breathing',
          duration: 20,
          videoUrl: '#',
          sheetUrl: '#',
          level: 'beginner',
          category: 'Technique',
          completed: false
        }
      ]
    }
  }

  useEffect(() => {
    const levelExercises = exerciseData[instrument]?.[selectedLevel] || []
    setExercises(levelExercises)
  }, [instrument, selectedLevel])

  const getInstrumentIcon = (instrument: string) => {
    switch (instrument) {
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
      default: return instrument
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = () => {
    setIsTimerRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimeElapsed(0)
  }

  const markAsCompleted = (exerciseId: string) => {
    const updatedExercises = exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, completed: true } : ex
    )
    setExercises(updatedExercises)
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <button
            onClick={() => router.push('/student')}
            className={`mb-6 flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-gray-800 text-gray-300' 
                : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            <span>← Back to Dashboard</span>
          </button>

          <h1 className={`text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {getInstrumentName(instrument)} Practice
          </h1>
          <p className={`text-xl ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Master your {getInstrumentName(instrument).toLowerCase()} with structured lessons
          </p>
        </div>

        {/* Level Selection */}
        <div className={`rounded-xl p-6 mb-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Select Level</h2>
          
          <div className="grid grid-cols-3 gap-4">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`py-3 px-4 rounded-lg font-medium transition-all ${
                  selectedLevel === level
                    ? 'bg-purple-600 text-white'
                    : theme === 'dark'
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Exercise List */}
        <div className={`rounded-xl p-6 mb-8 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-xl font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Exercises
          </h2>
          
          <div className="space-y-4">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                } ${exercise.completed ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-100'
                      }`}>
                        <div className="text-purple-600">
                          {getInstrumentIcon(instrument)}
                        </div>
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>{exercise.title}</h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>{exercise.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark' 
                          ? 'bg-purple-900/30 text-purple-400' 
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {exercise.level}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        theme === 'dark' 
                          ? 'bg-blue-900/30 text-blue-400' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {exercise.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center space-x-2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>{exercise.duration} minutes</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-2">
                    {exercise.videoUrl && (
                      <button className={`px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center`}>
                        <Play className="w-3 h-3 mr-1" />
                        Watch Video
                      </button>
                    )}
                    
                    {exercise.sheetUrl && (
                      <button className={`px-3 py-1 border border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-sm font-medium rounded-lg transition-colors flex items-center`}>
                        <Download className="w-3 h-3 mr-1" />
                        Download Sheet
                      </button>
                    )}
                  </div>
                  
                  {!exercise.completed && (
                    <button
                      onClick={() => markAsCompleted(exercise.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Practice Timer */}
        {currentExercise && (
          <div className={`rounded-xl p-6 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          } shadow-lg`}>
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Practice Timer</h3>
            
            <div className="flex items-center justify-between mb-4">
              <div className={`text-4xl font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {formatTime(timeElapsed)}
              </div>
              
              <div className="flex space-x-3">
                {!isTimerRunning ? (
                  <button
                    onClick={startTimer}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors flex items-center"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </button>
                )}
                
                <button
                  onClick={resetTimer}
                  className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center ${
                    theme === 'dark' 
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PracticePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PracticePageContent />
    </Suspense>
  )
}
