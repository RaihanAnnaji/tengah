"use client";

function getStatusColor(status) {
  switch (status) {
    case 1: return "text-black";
    case 2: return "text-yellow-500";
    case 3: return "text-red-500";
    case 4: return "text-gray-400";
    default: return "text-black";
  }
}

export default function TabelDetail({ datas, years }) {
  const rows = Object.entries(datas);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-sm">
            <th className="border px-2 py-1">Kode</th>
            <th className="border px-2 py-1">Nama Elemen</th>
            <th className="border px-2 py-1">Satuan</th>
            {years.map((y) => (
              <th key={y} className="border px-2 py-1">{y}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([_, { metadata, data }], index) => (
            <tr key={index} className="text-sm">
              {/* Ganti kode asli dengan nomor urut */}
              <td className="border px-2 py-1 text-center">{index + 1}</td>
              <td className="border px-2 py-1">{metadata.nama_elemen}</td>
              <td className="border px-2 py-1">{metadata.satuan || "-"}</td>
              {years.map((y) => {
                const cell = data[y] || {};
                return (
                  <td
                    key={y}
                    className={`border px-2 py-1 ${getStatusColor(cell.status)}`}
                  >
                    {cell.value ?? "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
