'use client'

import Link from 'next/link'
import { Course } from '@/data/coursesData'
import { ShoppingCart, Star } from 'lucide-react'

interface CourseCardProps {
  course: Course
  isInCart: boolean
  onAddToCart: () => void
}

export default function CourseCard({ course, isInCart, onAddToCart }: CourseCardProps) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="bg-gradient-to-br from-violet-600 to-indigo-600 px-6 py-5 text-white">
        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-white/90">
            {course.level}
          </span>
          <div className="inline-flex items-center gap-2 text-sm text-white/80">
            <Star className="h-4 w-4 text-yellow-300" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
        </div>
        <h3 className="mt-5 text-2xl font-semibold leading-tight text-white">{course.title}</h3>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Instructor</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{course.instructor}</p>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Duration</p>
            <p className="mt-2 text-base font-semibold text-slate-900">{course.duration}</p>
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Price</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">₹{course.price.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Link
            href={`/courses/${course.id}`}
            className="btn-premium-base btn-premium-secondary px-4 py-3 text-sm font-semibold"
          >
            View Details
          </Link>
          <button
            onClick={onAddToCart}
            disabled={isInCart}
            className={`btn-premium-base px-4 py-3 text-sm font-semibold ${
              isInCart
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border-none shadow-none'
                : 'btn-premium-secondary'
            }`}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isInCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}
