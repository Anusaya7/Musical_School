'use client'

import Link from 'next/link'
import { Course } from '@/data/coursesData'
import { ShoppingCart, Star, Check } from 'lucide-react'

interface CourseCardProps {
  course: Course
  isInCart: boolean
  onAddToCart: () => void
}

export default function CourseCard({ course, isInCart, onAddToCart }: CourseCardProps) {
  return (
    <div className="group rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 shadow-2xl transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl">
      <div className="rounded-3xl bg-white p-6 h-full flex flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700">
              {course.level}
            </span>
            <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              {course.rating}
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-3">{course.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">{course.description}</p>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span>Instructor</span>
              <span className="font-semibold text-gray-900">{course.instructor}</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <span>Duration</span>
              <span className="font-semibold text-gray-900">{course.duration}</span>
            </div>
            <div className="flex items-center justify-between pt-3">
              <span>Price</span>
              <span className="font-semibold text-gray-900">₹{course.price.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          <Link
            href={`/courses/${course.id}`}
            className="inline-flex items-center justify-center rounded-2xl border border-transparent bg-gradient-to-r from-purple-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-purple-700 hover:to-fuchsia-700"
          >
            View Details
          </Link>
          <button
            type="button"
            onClick={onAddToCart}
            disabled={isInCart}
            className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
              isInCart
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                In Cart
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
