import Kartu from "./kartu";
import { getIndikatorData } from "../../lib/indikator";

function hitungStatus(a, b) {
  return parseFloat(b) > parseFloat(a) ? "naik" : "turun";
}

export default async function Indikator() {
  const dataIndikator = await getIndikatorData({ revalidate: 300 });

  return (
    <div className="bg-[#EDFCED]">
      <section className="px-4 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#01BBA6]">Indikator Makro</h2>
          <p className="text-slate-800 mt-1">Capaian Kabupaten Kulon Progo</p>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid md:grid-cols-4 gap-4">
          {dataIndikator.map((d) => (
            <Kartu
              key={d.id}
              status={hitungStatus(d.persenA, d.persenB)}
              tahunA={d.tahunA}
              persenA={d.persenA}
              tahunB={d.tahunB}
              persenB={d.persenB}
              caption={d.nama}
            />
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex overflow-x-auto gap-4 px-4 -mx-4 scroll-smooth snap-x snap-mandatory">
          {dataIndikator.map((d) => (
            <div key={d.id} className="snap-center shrink-0 w-full max-w-sm mx-auto">
              <Kartu
                status={hitungStatus(d.persenA, d.persenB)}
                tahunA={d.tahunA}
                persenA={d.persenA}
                tahunB={d.tahunB}
                persenB={d.persenB}
                caption={d.nama}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
