export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column - School Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-3">2nd Inversion Musical School</h3>
            <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2">
              <span>Learn Music with Passion</span>
              <span>🎵</span>
            </p>
          </div>

          {/* Center Column - Links */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/courses" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Courses
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Right Column - Contact */}
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-400 text-xs leading-relaxed">
              <p className="flex items-center justify-center md:justify-end gap-2 font-bold text-white">
                <span>👤</span>
                <span>Ajinkya Uddhav Amrule</span>
              </p>
              <p className="flex items-center justify-center md:justify-end gap-2">
                <span>📞</span>
                <a href="tel:+917768838832" className="hover:text-white transition-colors">+91 77688 38832</a>
              </p>
              <p className="flex items-center justify-center md:justify-end gap-2">
                <span>✉️</span>
                <a href="mailto:aamrule90@gmail.com" className="hover:text-white transition-colors">aamrule90@gmail.com</a>
              </p>
              <p className="flex items-center justify-center md:justify-end gap-2">
                <span>📍</span>
                <span>Sr. No. 56/2/30, House No. B2/30, Kawade Nagar, Lane No. 2, Behind Ganesh Mangal Kendra, Pimple Gurav (New Sangvi), Pune – 411061</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 2nd Inversion Musical School. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
