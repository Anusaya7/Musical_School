'use client'

import React from 'react'
import Image from 'next/image'

export const instrumentIllustrations = {
  piano: '/images/instruments/piano.svg',
  guitar: '/images/instruments/guitar.svg',
  drums: '/images/instruments/drums.svg',
  vocals: '/images/instruments/microphone.svg',
  violin: '/images/instruments/violin.svg',
  bass: '/images/instruments/bass-guitar.svg',
  saxophone: '/images/instruments/saxophone.svg',
  theory: '/images/instruments/music-theory.svg'
}

interface InstrumentIllustrationProps {
  category: string
  className?: string
  size?: number
}

export default function InstrumentIllustration({
  category,
  className = '',
  size = 58
}: InstrumentIllustrationProps) {
  const normCat = category.toLowerCase().trim()
  let src = instrumentIllustrations.piano

  if (normCat.includes('piano')) {
    src = instrumentIllustrations.piano
  } else if (normCat.includes('guitar') && (normCat.includes('bass') || normCat.includes('low'))) {
    src = instrumentIllustrations.bass
  } else if (normCat.includes('guitar')) {
    src = instrumentIllustrations.guitar
  } else if (normCat.includes('drum')) {
    src = instrumentIllustrations.drums
  } else if (
    normCat.includes('vocal') || 
    normCat.includes('voice') || 
    normCat.includes('sing') || 
    normCat.includes('microphone')
  ) {
    src = instrumentIllustrations.vocals
  } else if (normCat.includes('violin')) {
    src = instrumentIllustrations.violin
  } else if (normCat.includes('sax')) {
    src = instrumentIllustrations.saxophone
  } else if (
    normCat.includes('theory') || 
    normCat.includes('note') || 
    normCat.includes('music-theory') ||
    normCat.includes('sheet')
  ) {
    src = instrumentIllustrations.theory
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <Image
        src={src}
        alt={`${category} illustration`}
        width={size}
        height={size}
        className="object-contain transition-transform duration-300 ease-out group-hover:scale-[1.08] group-hover:rotate-[2deg]"
        loading="lazy"
      />
    </div>
  )
}
