'use client'

import { useState, useRef, useEffect } from 'react'

export default function VoiceAITeacher() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [conversation, setConversation] = useState<Array<{role: string, text: string}>>([])
  const [mounted, setMounted] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        setTranscript('')
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
        processVoiceCommand(transcript)
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [mounted])

  const processVoiceCommand = async (command: string) => {
    const lowerCommand = command.toLowerCase()
    let response = ''

    // Music theory responses
    if (lowerCommand.includes('what is a scale')) {
      response = "A scale is a sequence of musical notes ordered by pitch. The most common is the major scale, which follows the pattern: whole, whole, half, whole, whole, whole, half steps."
    } else if (lowerCommand.includes('what is a chord')) {
      response = "A chord is a combination of three or more notes played simultaneously. The most basic chord is a triad, consisting of a root note, third, and fifth."
    } else if (lowerCommand.includes('what is rhythm')) {
      response = "Rhythm is the timing of musical sounds and silences. It includes the beat, tempo, and duration of notes. Think of it as the heartbeat of music!"
    }
    // Instrument guidance
    else if (lowerCommand.includes('how to play piano')) {
      response = "To play piano, start with proper posture: sit straight with feet flat on the floor. Place your curved fingers on the keys, and use your fingertips to press down firmly but gently. Practice scales to build finger strength and coordination."
    } else if (lowerCommand.includes('how to hold guitar')) {
      response = "Hold the guitar with the curve on your right leg if you're right-handed. Keep your back straight and shoulders relaxed. Your left hand should press the frets while your right hand strums or picks the strings."
    }
    // Practice tips
    else if (lowerCommand.includes('how to practice')) {
      response = "Effective practice involves: 1) Setting specific goals, 2) Starting with warm-ups, 3) Practicing slowly and accurately, 4) Using a metronome, 5) Taking breaks, and 6) Recording yourself to track progress."
    } else if (lowerCommand.includes('how long should i practice')) {
      response = "For beginners, 15-30 minutes daily is ideal. As you advance, you can increase to 45-60 minutes. Consistency is more important than duration - 20 minutes every day is better than 2 hours once a week!"
    }
    // General music questions
    else if (lowerCommand.includes('what is music')) {
      response = "Music is the art of arranging sounds in time to produce composition through melody, harmony, rhythm, and timbre. It's a universal language that expresses emotions and tells stories without words."
    } else if (lowerCommand.includes('help me learn')) {
      response = "I'm here to help! You can ask me about music theory, instrument techniques, practice methods, or any music-related questions. What would you like to learn about today?"
    }
    // Default response
    else {
      response = "That's an interesting question! As your AI music teacher, I can help you with music theory, instrument techniques, and practice tips. Try asking me about scales, chords, rhythm, or how to play specific instruments."
    }

    setAiResponse(response)
    setConversation(prev => [...prev, { role: 'student', text: command }, { role: 'teacher', text: response }])
    
    // Speak the response
    speakText(response)
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleListening = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
      } else {
        recognitionRef.current.start()
      }
    }
  }

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <>
      {/* Voice AI Teacher Button */}
      <div className="fixed bottom-6 right-44 z-40">
        <button
          onClick={() => {
            if (isListening) {
              toggleListening()
            } else if (isSpeaking) {
              stopSpeaking()
            } else {
              toggleListening()
            }
          }}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : isSpeaking 
              ? 'bg-orange-500 hover:bg-orange-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isListening ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          ) : isSpeaking ? (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          ) : (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          )}
        </button>
      </div>

      {/* Voice AI Teacher Popup */}
      {(isListening || isSpeaking || conversation.length > 0) && (
        <div className="fixed bottom-24 right-44 w-96 bg-white rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Voice AI Music Teacher</h3>
                  <p className="text-xs opacity-90">
                    {isListening ? "Listening..." : isSpeaking ? "Speaking..." : "Ready to help"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setConversation([])
                  setTranscript('')
                  setAiResponse('')
                  if (isListening) toggleListening()
                  if (isSpeaking) stopSpeaking()
                }}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Current Interaction */}
            {isListening && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">Listening...</p>
                <p className="text-blue-600">{transcript || "Say something about music..."}</p>
              </div>
            )}

            {isSpeaking && aiResponse && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium mb-1">AI Teacher says:</p>
                <p className="text-green-700">{aiResponse}</p>
              </div>
            )}

            {/* Conversation History */}
            {conversation.length > 0 && (
              <div className="mb-4 max-h-64 overflow-y-auto">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Conversation:</h4>
                {conversation.map((item, index) => (
                  <div key={index} className={`mb-2 p-2 rounded-lg ${
                    item.role === 'student' ? 'bg-gray-100' : 'bg-blue-50'
                  }`}>
                    <p className="text-xs font-medium text-gray-600 mb-1">
                      {item.role === 'student' ? 'You' : 'AI Teacher'}
                    </p>
                    <p className="text-sm text-gray-800">{item.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Instructions */}
            <div className="text-xs text-gray-500 text-center">
              {isListening 
                ? "I'm listening... Speak clearly about music topics"
                : isSpeaking 
                ? "AI Teacher is speaking..."
                : "Click the microphone to start asking music questions"
              }
            </div>
          </div>
        </div>
      )}
    </>
  )
}
