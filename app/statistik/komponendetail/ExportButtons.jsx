"use client";

import * as XLSX from "xlsx";

export default function ExportButtons({ datas, years }) {
  const handleExportJSON = () => {
    const jsonData = JSON.stringify(datas);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    const rows = Object.entries(datas).map(([kode, { metadata, data }]) => {
      const row = {
        Kode: kode,
        "Nama Elemen": metadata.nama_elemen,
        Satuan: metadata.satuan,
      };
      years.forEach((y) => {
        row[y] = data[y]?.value ?? "";
      });
      return row;
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    XLSX.writeFile(wb, "data.xlsx");
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportJSON}
        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
      >
        Export JSON
      </button>
      <button
        onClick={handleExportExcel}
        className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 text-sm"
      >
        Export Excel
      </button>
    </div>
  );
}
