'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  id: number
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [mounted, setMounted] = useState(false)
  const messageIdCounterRef = useRef(1)

  useEffect(() => {
    setMounted(true)
    setMessages([
      {
        id: 1,
        text: "Hello! I'm your AI Music Assistant. How can I help you with your musical journey today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ])
  }, [])

  const botResponses = {
    greeting: "Welcome to 2nd Inversion Musical School! I'm here to help you with information about our courses, schedules, and enrollment.",
    courses: "We offer courses in Piano, Guitar, Drums, Vocals, Violin, Music Theory, Bass Guitar, and Saxophone. Each course is designed for different skill levels from beginner to advanced.",
    timing: "Our class timings are:\n- Monday: Closed\n- Tuesday to Sunday:\n  🌅 Morning: 4:00 AM – 12:00 PM\n  🌇 Evening: 3:00 PM – 9:00 PM",
    fees: "Course fees vary by instrument and duration:\n- Piano: $199-$399\n- Guitar: $149-$299\n- Drums: $279-$449\n- Vocals: $299-$499\n- Violin: $349-$599\n- Music Theory: $99-$199",
    enrollment: "Enrollment is simple! You can:\n1. Visit our courses page\n2. Add courses to cart\n3. Complete checkout\n4. Start learning immediately!",
    instructor: "Our lead instructor is Ajinkya Amrule, a distinguished pianist, music educator, and sound engineer with a graduate degree in Sound Engineering.",
    location: "We're located at Sr. No. 56/2/30, House No. B2/30, Kawade Nagar, Lane No. 2, Behind Ganesh Mangal Kendra, Pimple Gurav (New Sangvi), Pune – 411061, Maharashtra, India.",
    contact: "You can reach us at:\n- Phone: +91 77688 38832\n- Email: aamrule90@gmail.com\n- WhatsApp: Click the green WhatsApp button",
    default: "I understand you're interested in our music school. Let me help you with that. Could you tell me more about what specific information you're looking for?"
  }

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return botResponses.greeting
    } else if (message.includes('course') || message.includes('instrument') || message.includes('learn')) {
      return botResponses.courses
    } else if (message.includes('timing') || message.includes('schedule') || message.includes('when')) {
      return botResponses.timing
    } else if (message.includes('fee') || message.includes('cost') || message.includes('price') || message.includes('money')) {
      return botResponses.fees
    } else if (message.includes('enroll') || message.includes('join') || message.includes('admission')) {
      return botResponses.enrollment
    } else if (message.includes('instructor') || message.includes('teacher') || message.includes('ajinkya')) {
      return botResponses.instructor
    } else if (message.includes('address') || message.includes('location') || message.includes('where')) {
      return botResponses.location
    } else if (message.includes('contact') || message.includes('phone') || message.includes('call')) {
      return botResponses.contact
    } else {
      return botResponses.default
    }
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return

    messageIdCounterRef.current += 1
    const userMessage: Message = {
      id: messageIdCounterRef.current,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(() => {
      messageIdCounterRef.current += 1
      const botResponse: Message = {
        id: messageIdCounterRef.current,
        text: getBotResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickActions = [
    "Tell me about courses",
    "What are the timings?",
    "How much do courses cost?",
    "How do I enroll?",
    "Where are you located?"
  ]

  if (!mounted) return null

  return (
    <>
      {/* AI Chatbot Button */}
      <div className="fixed bottom-6 right-24 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-[#FF6FAF] text-white rounded-full shadow-lg hover:bg-[#FF8EBF] transition-all duration-300 flex items-center justify-center group"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></span>
        </button>
      </div>

      {/* Chatbot Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-24 w-96 bg-white rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">AI Music Assistant</h3>
                  <p className="text-xs opacity-90">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-800 border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white text-gray-800 border border-gray-200 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="p-4 bg-white border-t">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(action)}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about music..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                onClick={handleSendMessage}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
