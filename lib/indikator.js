// lib/indikator.js
import { serverFetch } from "./api";

const indikatorList = [
  "j2ng6ag1rx", // IPM
  "wOLMpQJnjr", // Kemiskinan
  "8J1xp3Q1Wr", // Pengangguran
];

export async function getIndikatorData({ revalidate = 300 } = {}) {
  const hasil = [];

  for (const id of indikatorList) {
    const json = await serverFetch(`data-ku/elemen-detil/${id}`, { revalidate });

    let nama = json?.elemen?.label || "Tidak diketahui";
    let satuan = "";
    let dataObj = {};

    const datas = json?.datas || {};
    const targetKey = Object.keys(datas).find(
      (k) => datas[k]?.metadata?.nama_elemen?.toLowerCase() === "pengangguran"
    );

    if (targetKey) {
      nama = datas[targetKey].metadata.nama_elemen;
      satuan = datas[targetKey].metadata.satuan;
      dataObj = datas[targetKey].data;
    } else {
      const firstKey = Object.keys(datas)[0];
      if (firstKey) {
        nama = datas[firstKey].metadata.nama_elemen || nama;
        satuan = datas[firstKey].metadata.satuan || "";
        dataObj = datas[firstKey].data || {};
      }
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
