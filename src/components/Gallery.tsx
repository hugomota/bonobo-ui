import { useEffect, useRef, useState } from 'react'

export interface GalleryPhoto {
  src: string
  /** Tried when `src` doesn't load (e.g. a smaller thumbnail). */
  fallback?: string
}

export interface GalleryProps {
  photos: GalleryPhoto[]
  labels?: { previous?: string; next?: string; unavailable?: string; empty?: string }
  className?: string
}

/**
 * Photos one at a time on a dark stage: big ‹ › buttons, swipe, arrow keys
 * and a counter. The next photo is loaded ahead so swiping never waits.
 */
export function Gallery({ photos, labels = {}, className }: GalleryProps) {
  const [index, setIndex] = useState(0)
  const [failed, setFailed] = useState<Record<number, 'fallback' | 'gone'>>({})
  const swipeX = useRef<number | null>(null)
  const count = photos.length
  const current = count ? ((index % count) + count) % count : 0
  const go = (step: number) => setIndex((i) => i + step)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setIndex((i) => i - 1)
      if (e.key === 'ArrowRight') setIndex((i) => i + 1)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (count > 1) new Image().src = photos[(current + 1) % count].src
  }, [current, count, photos])

  const photo = photos[current]
  const state = failed[current]
  const src = photo && (state === 'fallback' ? photo.fallback : photo.src)

  return (
    <div
      className={['bn-gallery', className].filter(Boolean).join(' ')}
      onPointerDown={(e) => (swipeX.current = e.clientX)}
      onPointerUp={(e) => {
        if (swipeX.current === null) return
        const dx = e.clientX - swipeX.current
        swipeX.current = null
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
      }}
    >
      {src && state !== 'gone' ? (
        <img
          key={src}
          className="bn-gallery__photo"
          src={src}
          alt=""
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() =>
            setFailed((f) => ({
              ...f,
              [current]: photo.fallback && state !== 'fallback' ? 'fallback' : 'gone',
            }))
          }
        />
      ) : (
        <p className="bn-gallery__empty">
          {count ? (labels.unavailable ?? 'Photo unavailable') : (labels.empty ?? 'No photos')}
        </p>
      )}
      {count > 1 && (
        <>
          <button
            type="button"
            className="bn-gallery__nav bn-gallery__nav--prev"
            aria-label={labels.previous ?? 'Previous photo'}
            onClick={() => go(-1)}
          >
            <Chevron left />
          </button>
          <button
            type="button"
            className="bn-gallery__nav bn-gallery__nav--next"
            aria-label={labels.next ?? 'Next photo'}
            onClick={() => go(1)}
          >
            <Chevron />
          </button>
          <span className="bn-gallery__counter">
            {current + 1} / {count}
          </span>
        </>
      )}
    </div>
  )
}

function Chevron({ left }: { left?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" aria-hidden="true">
      <path
        d={left ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
