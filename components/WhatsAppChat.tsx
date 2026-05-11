'use client'

import { useState } from 'react'

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')

  const phoneNumber = '917768838832' // 91 for India, then the number without leading 0
  const defaultMessage = 'Hi! I\'m interested in learning music at 2nd Inversion Musical School.'

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(defaultMessage)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  const handleSendMessage = () => {
    const encodedMessage = encodeURIComponent(message || defaultMessage)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
    setIsOpen(false)
    setMessage('')
  }

  return (
    <>
      {/* WhatsApp Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center group"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.074-.488-.125-.193-1.125-2.723-1.252-2.923-.125-.197-.125-.338.013-.485.138-.149.297-.347.446-.521.151-.172.2-.296.074-.488-.125-.193-.546-1.38-.714-1.882-.179-.534-.37-.461-.546-.461-.149 0-.297-.013-.446-.013-.174 0-.456.074-.674.37-.218.297-.828 1.011-.828 2.461 0 1.45 1.055 2.851 1.2 3.032.149.181 2.075 3.168 5.026 4.435.7.302 1.248.481 1.671.616.7.223 1.341.192 1.846.117.564-.083 1.738-.711 1.983-1.398.245-.687.245-1.274.173-1.398-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      </div>

      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-lg shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-green-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.149-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.074-.488-.125-.193-1.125-2.723-1.252-2.923-.125-.197-.125-.338.013-.485.138-.149.297-.347.446-.521.151-.172.2-.296.074-.488-.125-.193-.546-1.38-.714-1.882-.179-.534-.37-.461-.546-.461-.149 0-.297-.013-.446-.013-.174 0-.456.074-.674.37-.218.297-.828 1.011-.828 2.461 0 1.45 1.055 2.851 1.2 3.032.149.181 2.075 3.168 5.026 4.435.7.302 1.248.481 1.671.616.7.223 1.341.192 1.846.117.564-.083 1.738-.711 1.983-1.398.245-.687.245-1.274.173-1.398-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">2nd Inversion Music</h3>
                  <p className="text-xs opacity-90">Typically replies instantly</p>
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

          {/* Body */}
          <div className="p-4">
            <div className="bg-gray-100 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-700">
                Hi! Welcome to 2nd Inversion Musical School. How can we help you today?
              </p>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => setMessage('I want to know about your courses')}
                className="w-full text-left text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors"
              >
                I want to know about your courses
              </button>
              <button
                onClick={() => setMessage('What are the class timings?')}
                className="w-full text-left text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors"
              >
                What are the class timings?
              </button>
              <button
                onClick={() => setMessage('How much do the courses cost?')}
                className="w-full text-left text-sm bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 transition-colors"
              >
                How much do the courses cost?
              </button>
            </div>

            <div className="mt-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                rows={3}
              />
              <button
                onClick={handleSendMessage}
                className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Send on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
