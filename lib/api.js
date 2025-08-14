const BASE_UPSTREAM = "https://satudata.kulonprogokab.go.id/api/public";

/**
 * SERVER fetch (dipakai di server components / ISR)
 * Ke upstream langsung (server tidak kena CORS), dengan revalidate.
 */
export async function serverFetch(path, { query = {}, revalidate = 60 } = {}) {
  const qs = new URLSearchParams(query).toString();
  const url = `${BASE_UPSTREAM}/${path}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, { next: { revalidate } });
  if (!res.ok) {
    throw new Error(`Upstream error ${res.status}: ${await res.text()}`);
  }
  return res.json();
}

/**
 * CLIENT fetch (dipakai di komponen client kalau perlu)
 * Lewat proxy /api/proxy agar aman dari CORS.
 */
export async function clientFetch(path, { query = {} } = {}) {
  const qs = new URLSearchParams(query).toString();
  const url = `/api/proxy/${path}${qs ? `?${qs}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Proxy error ${res.status}`);
  return res.json();
}

// Helper spesifik API
export async function getList({ page = 1, opd, urusan, revalidate = 60 } = {}) {
  const query = { page };
  if (opd) query.opd = opd;
  if (urusan) query.urusan = urusan;
  return serverFetch("data-ku", { query, revalidate });
}

export async function getElemenDetail(id, { revalidate = 300 } = {}) {
  return serverFetch(`data-ku/elemen-detil/${id}`, { revalidate });
}

// lib/api.js
export async function getDatasetDetail(id, tahunAwal, tahunAkhir) {
  const url = `https://satudata.kulonprogokab.go.id/api/public/data-ku/elemen-detil/${id}?tahun_awal=${tahunAwal}&tahun_akhir=${tahunAkhir}`;
  const res = await fetch(url, { cache: "no-store" }); // SSR
  if (!res.ok) throw new Error("Gagal mengambil data");
  return res.json();
}

// hitung jumlah data, opd, urusan di section sekilas
export async function getSekilasData() {
  const res = await fetch("https://satudata.kulonprogokab.go.id/api/public/data-ku", {
    next: { revalidate: 300 }
  });
  if (!res.ok) throw new Error("Gagal mengambil data sekilas");

  const data = await res.json();

  const list = Array.isArray(data.datas?.data) ? data.datas.data : [];

  return {
    datasetCount: data.datas?.total ?? 0,
    opdCount: new Set(Object.keys(data.pInstansi ?? {}).filter(k => k)).size, // ambil dari pInstansi, buang key kosong
    urusanCount: new Set(Object.keys(data.pUrusan ?? {}).filter(k => k)).size // ambil dari pUrusan, buang key kosong
  };
}

// --- kode di api.js sebelumnya tetap --- //

// Mapping ID → nama subelemen (kosong "" kalau ambil pertama)
const indikatorConfig = [
  { id: "j2ng6ag1rx", sub: "" }, // IPM
  { id: "wOLMpQJnjr", sub: "" }, // Kemiskinan
  { id: "8J1xp3Q1Wr", sub: "Pengangguran" }, // Pengangguran
  { id: "0k9qJoy18J", sub: "Laju Pertumbuhan Ekonomi Kabupaten Kulon Progo" }, // Laju Pertumbuhan Ekonomi
];

export async function getIndikatorData({ revalidate = 300 } = {}) {
  const hasil = [];

  for (const { id, sub } of indikatorConfig) {
    const json = await serverFetch(`data-ku/elemen-detil/${id}`, { revalidate });

    let nama = json?.elemen?.label || "Tidak diketahui";
    let satuan = "";
    let dataObj = {};

    const datas = json?.datas || {};
    let targetKey = null;

    if (sub) {
      // Cari subelemen sesuai nama yang di-mapping
      targetKey = Object.keys(datas).find(
        (k) =>
          datas[k]?.metadata?.nama_elemen?.toLowerCase() === sub.toLowerCase()
      );
    }

    if (!targetKey) {
      // Kalau tidak ada mapping sub atau tidak ketemu → ambil yang pertama
      targetKey = Object.keys(datas)[0];
    }

    if (targetKey) {
      nama = datas[targetKey].metadata.nama_elemen || nama;
      satuan = datas[targetKey].metadata.satuan || "";
      dataObj = datas[targetKey].data || {};
    }

    const tahunList = Object.keys(dataObj)
      .filter((t) => dataObj[t].value !== null)
      .sort((a, b) => b - a);

    if (tahunList.length >= 2) {
      const tBaru = tahunList[0];
      const tLama = tahunList[1];

      hasil.push({
        id: `${id}-${tBaru}`,
        nama,
        satuan,
        tahunA: tLama,
        persenA: dataObj[tLama].value,
        tahunB: tBaru,
        persenB: dataObj[tBaru].value,
      });
    }
  }

  return hasil;
}


