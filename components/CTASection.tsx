export default function CTASection() {
  return (
    <section className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 relative overflow-hidden">
      {/* Yellow Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-yellow-400 rounded-br-full opacity-80 z-10"></div>
      <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-bl-full opacity-80 z-10"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 bg-yellow-400 rounded-tr-full opacity-80 z-10"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-tl-full opacity-80 z-10"></div>
      {/* Background Sparkles */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full opacity-5 animate-pulse" />
        <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full opacity-3 animate-pulse" />
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-white rounded-full opacity-4 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-16 h-16 bg-white rounded-full opacity-6 animate-pulse" />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Title with Animation */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in-up">
          Ready to Start Your Musical Journey? 🎵
        </h2>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-12 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Join our community of passionate musicians and unlock your full potential with expert guidance and comprehensive training.
        </p>

        {/* Buttons Container */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {/* Browse Courses - Primary Light Button */}
          <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-gray-50">
            Browse Courses
          </button>

          {/* Get in Touch - Outline Button */}
          <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-white hover:text-blue-600">
            Get in Touch
          </button>

          {/* Sign Up Now - Highlight Gradient Button */}
          <button className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:from-yellow-500 hover:to-orange-600">
            Sign Up Now
          </button>
        </div>
      </div>

      {/* Floating Buttons - Fixed Bottom Right */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* Voice Button */}
        <button className="w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group">
          <span className="text-xl">🎤</span>
          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
        </button>

        {/* Chat Button */}
        <button className="w-14 h-14 bg-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group">
          <span className="text-xl">💬</span>
          <div className="absolute inset-0 bg-purple-500 rounded-full animate-ping opacity-20"></div>
        </button>

        {/* WhatsApp Button */}
        <button className="w-14 h-14 bg-green-500 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center group">
          <span className="text-xl">🟢</span>
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  )
}
