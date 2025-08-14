"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Section({ title, children }) {
  return (
    <div className="bg-white/80 backdrop-blur border rounded-2xl p-4 mb-4 shadow-sm">
      <div className="font-semibold mb-3">{title}</div>
      {children}
    </div>
  );
}

function TextFilter({ placeholder, value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring"
    />
  );
}

export default function FilterSidebar({ initialOpd = "", initialUrusan = "", pInstansi = {}, pUrusan = {} }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [opdQuery, setOpdQuery] = useState("");
  const [urusanQuery, setUrusanQuery] = useState("");

  const opdList = useMemo(() => {
    const entries = Object.entries(pInstansi || {});
    return entries.filter(([key, label]) =>
      String(label).toLowerCase().includes(opdQuery.toLowerCase())
    );
  }, [pInstansi, opdQuery]);

  const urusanList = useMemo(() => {
    const entries = Object.entries(pUrusan || {});
    return entries.filter(([key, label]) =>
      String(label).toLowerCase().includes(urusanQuery.toLowerCase())
    );
  }, [pUrusan, urusanQuery]);

  const updateQuery = (patch) => {
    const n = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (!v) n.delete(k);
      else n.set(k, v);
    });
    // Reset page ke 1 saat ganti filter
    n.set("page", "1");
    router.push(`${pathname}?${n.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* OPD */}
      <Section title="Filter OPD">
        <div className="mb-3">
          <TextFilter
            placeholder="Cari kategori OPD"
            value={opdQuery}
            onChange={setOpdQuery}
          />
        </div>

        <label className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            name="opd"
            checked={!initialOpd}
            onChange={() => updateQuery({ opd: "" })}
          />
          <span>Semua Data</span>
        </label>

        <div className="max-h-64 overflow-auto pr-1 space-y-2">
          {opdList.map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="radio"
                name="opd"
                checked={String(initialOpd) === String(key)}
                onChange={() => updateQuery({ opd: key })}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </Section>

      {/* Urusan */}
      <Section title="Filter Kategori Urusan">
        <div className="mb-3">
          <TextFilter
            placeholder="Cari kategori Urusan"
            value={urusanQuery}
            onChange={setUrusanQuery}
          />
        </div>

        <label className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            name="urusan"
            checked={!initialUrusan}
            onChange={() => updateQuery({ urusan: "" })}
          />
          <span>Semua Data</span>
        </label>

        <div className="max-h-64 overflow-auto pr-1 space-y-2">
          {urusanList.map(([key, label]) => (
            <label key={key} className="flex items-center gap-2">
              <input
                type="radio"
                name="urusan"
                checked={String(initialUrusan) === String(key)}
                onChange={() => updateQuery({ urusan: key })}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
}
