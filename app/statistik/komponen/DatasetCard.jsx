import Link from "next/link";

export default function DatasetCard({ item }) {
  return (
    <Link href={`/statistik/${item.id}`} className="block hover:shadow-md transition">
      <article className="bg-white/90 border rounded-2xl p-4 shadow-sm">
        <h3 className="font-semibold text-lg mb-1">
          {item?.nama_elemen || "-"}
        </h3>
        <p className="text-sm text-gray-600">
          {item?.nama_instansi || ""}
        </p>
        {item?.periode && (
          <p className="text-xs mt-2 text-gray-500">Periode: {item.periode}</p>
        )}
      </article>
    </Link>
  );
}
