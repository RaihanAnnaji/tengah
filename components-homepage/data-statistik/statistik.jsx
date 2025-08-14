'use client'
import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Kartu from './kartu-sts'
import dataKategori from './data'

const DataStatistik = () => {
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = container.firstChild?.offsetWidth || 1
      const index = Math.round(scrollLeft / cardWidth)
      setActiveIndex(index)
    }
    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSelectFilter = (type, value) => {
    if (!value) return
    const query = type === 'opd'
      ? `?opd=${encodeURIComponent(value)}`
      : `?urusan=${encodeURIComponent(value)}`
    router.push(`/statistik${query}`)
  }

  return (
    <section className="px-4 py-20 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#01BBA6]">Data Statistik Sektoral</h2>
        <p className="text-slate-800 mt-1">
          Data sektoral menggambarkan kondisi spesifik sektor
        </p>
      </div>

      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-4 gap-4">
        {dataKategori.map((item, i) => (
          <Kartu
            key={i}
            {...item}
            onClick={() => handleSelectFilter(item.type, item.filterValue)}
          />
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 -mx-4 scroll-smooth"
        >
          {dataKategori.map((item, i) => (
            <div
              key={i}
              className="snap-center shrink-0 w-full max-w-sm mx-auto"
            >
              <Kartu
                {...item}
                onClick={() => handleSelectFilter(item.type, item.filterValue)}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {dataKategori.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? 'bg-[#01BBA6]' : 'bg-slate-400/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default DataStatistik
