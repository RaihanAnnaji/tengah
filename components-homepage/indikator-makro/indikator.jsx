import Kartu from "./kartu";
import { getIndikatorData } from "../../lib/api";

export default async function Indikator() {
  const dataIndikator = await getIndikatorData({ revalidate: 300 });

  return (
    <div className="bg-[#EDFCED]">
      <section className="px-4 py-20 max-w-7xl mx-auto">
        {/* Judul */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#01BBA6]">
            Indikator Makro
          </h2>
          <p className="text-slate-800 mt-1">Capaian Kabupaten Kulon Progo</p>
        </div>

        {/* List kartu */}
        <div className="grid grid-flow-col md:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory px-4 md:px-0 items-stretch">
          {dataIndikator.map((d) => (
            <div
              key={d.id}
              className="snap-center shrink-0 w-full min-w-[280px] max-w-sm md:max-w-none mx-auto flex"
            >
              <Kartu {...d} className="h-full w-full" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
