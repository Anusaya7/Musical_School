'use client'

import Link from 'next/link'
import { Star, Clock, User, ArrowRight, ShoppingCart, Check } from 'lucide-react'
import {
  Course,
  formatCoursePrice,
  getCategoryGradient,
  getLevelBadgeClass,
} from '@/data/coursesData'

interface CourseCardProps {
  course: Course
  isInCart: boolean
  onAddToCart: (course: Course) => void
  showBooking?: boolean
  bookingSlot?: React.ReactNode
}

export default function CourseCard({
  course,
  isInCart,
  onAddToCart,
  showBooking = false,
  bookingSlot,
}: CourseCardProps) {
  const gradient = getCategoryGradient(course.category)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/20">
      {/* Gradient header */}
      <div className={`relative h-44 bg-gradient-to-br ${gradient} p-6`}>
        <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_55%)]" />

        <div className="relative flex h-full flex-col justify-between">
          <span
            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getLevelBadgeClass(course.level)}`}
          >
            {course.level}
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-white/70">
              {course.category.replace('-', ' ')}
            </p>
            <h3 className="mt-1 text-xl font-bold leading-tight text-white">{course.title}</h3>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
          <User className="h-4 w-4 shrink-0 text-purple-400" />
          <span className="font-medium text-white">{course.instructor}</span>
        </div>

        <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-slate-400">
          {course.description}
        </p>

        <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
            <Clock className="h-4 w-4 text-purple-400" />
            <span className="text-slate-300">{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-white">{course.rating}</span>
          </div>
        </div>

        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Course Fee</p>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              {formatCoursePrice(course.price)}
            </p>
          </div>
          <span className="rounded-full bg-purple-500/20 px-2.5 py-1 text-xs font-medium text-purple-300">
            {course.level}
          </span>
        </div>

        {showBooking && bookingSlot && <div className="mb-4">{bookingSlot}</div>}

        <div className="mt-auto flex gap-2">
          <Link
            href={`/courses/${course.id}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-purple-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-purple-500/30"
          >
            View Details
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            onClick={() => onAddToCart(course)}
            disabled={isInCart}
            aria-label={isInCart ? 'Already in cart' : 'Add to cart'}
            className={`inline-flex items-center justify-center rounded-xl px-3 py-2.5 transition-all ${
              isInCart
                ? 'cursor-not-allowed bg-emerald-500/20 text-emerald-400'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isInCart ? <Check className="h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </article>
  )
}
