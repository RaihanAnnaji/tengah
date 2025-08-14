export async function GET(req, { params }) {
    try {
      const { searchParams } = new URL(req.url);
      const qs = searchParams.toString();
      const path = Array.isArray(params.path) ? params.path.join("/") : params.path;
      const upstream = `https://satudata.kulonprogokab.go.id/api/public/${path}${qs ? `?${qs}` : ""}`;
  
      const res = await fetch(upstream, {
        headers: { "Accept": "application/json" },
        next: { revalidate: 60 },
      });
  
      const text = await res.text();
      return new Response(text, {
        status: res.status,
        headers: { "Content-Type": "application/json" }
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Proxy error", detail: String(e) }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
  