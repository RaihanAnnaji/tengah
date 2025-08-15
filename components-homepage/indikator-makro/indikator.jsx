// indikator.jsx (Server Component)
import React from 'react'
import Kartu from './kartu'
import SliderMobile from './SliderMobile'
import { getIndikatorData } from '../../lib/api'
import dataDummy from './data' // fallback

export default async function DataStatistik() {
  let dataIndikator = []

  try {
    dataIndikator = await getIndikatorData({ revalidate: 300 })
  } catch (err) {
    console.error('Gagal fetch API indikator, pakai data dummy:', err)
    dataIndikator = dataDummy
  }

  if (!dataIndikator.length) {
    return <p className="text-center py-10">Tidak ada data tersedia</p>
  }

  return (
    <div className="bg-[#EDFCED]">
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        {/* Judul & Subjudul */}
        <h2 className="text-2xl md:text-3xl font-bold text-[#01BBA6]">
          Indikator Makro
        </h2>
        <p className="text-slate-800 mt-1">Capaian Kabupaten Kulon Progo</p>

        {/* Grid desktop */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 mt-10">
          {dataIndikator.map((item, i) => (
            <Kartu key={i} {...item} />
          ))}
        </div>

        {/* Slider mobile (Client Component) */}
        <SliderMobile dataIndikator={dataIndikator} />
      </section>
    </div>
  )
}
