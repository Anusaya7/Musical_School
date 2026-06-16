'use client'

import { useState } from 'react'

interface BookingSystemProps {
  selectedClass: string | null
}

export default function BookingSystem({ selectedClass }: BookingSystemProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    classId: selectedClass || '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Booking submitted:', formData)
    alert('Booking request submitted! We will contact you soon.')
    setFormData({
      name: '',
      email: '',
      phone: '',
      classId: '',
      message: ''
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <section id="booking" className="py-16 bg-white relative">
      {/* Yellow Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-yellow-400 rounded-br-full"></div>
      <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 bg-yellow-400 rounded-tr-full"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-tl-full"></div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Book Your Class</h2>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 rounded-lg p-8 shadow-lg border-2 border-yellow-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Class
                </label>
                <select
                  id="classId"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Choose a class...</option>
                  <option value="morning-piano">Morning Piano Class (3:00 AM - 12:00 PM)</option>
                  <option value="evening-guitar">Evening Guitar Class (3:00 PM - 9:00 PM)</option>
                  <option value="vocal-training">Vocal Training (3:00 PM - 9:00 PM)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:translate-y-[-2px] hover:scale-105"
              >
                Submit Booking Request
              </button>
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center">
                Admin Contact: <strong>Ajinkya Amrule</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
