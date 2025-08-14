import Banner from "../components-homepage/banner";
import SekilasWrapper from "../components-homepage/SekilasWrapper";
import Indikator from "../components-homepage/indikator-makro/indikator";
import Statistik from "../components-homepage/data-statistik/statistik";
import Terbaru from "../components-homepage/terbaru";

export default function Home() {
  return (
    <main>
      <Banner />
      <SekilasWrapper />
      <Indikator />
      <Statistik />
      <Terbaru />
    </main>
  );
}
