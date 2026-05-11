export default function InstructorInfo() {
  return (
    <section id="instructor" className="py-16 bg-white relative">
      {/* Yellow Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 bg-yellow-400 rounded-br-full"></div>
      <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-400 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 bg-yellow-400 rounded-tr-full"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400 rounded-tl-full"></div>
      
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Your Instructor</h2>
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg p-8 shadow-lg border-2 border-yellow-300">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center text-white text-4xl font-bold">
              IA
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">instructor all in one</h3>
              <p className="text-gray-600 mb-4">
                Professional music educator with over 10 years of experience in teaching various instruments 
                and music theory. Specialized in piano, guitar, and vocal training.
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">Piano</span>
                <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">Guitar</span>
                <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">Vocal Training</span>
                <span className="bg-secondary text-white px-3 py-1 rounded-full text-sm">Music Theory</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
