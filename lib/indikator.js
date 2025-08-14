// lib/indikator.js
import { serverFetch } from "./api";

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
