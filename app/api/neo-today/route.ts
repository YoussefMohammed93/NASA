import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY =
    process.env.NASA_API_KEY ||
    process.env.NEXT_PUBLIC_NASA_API_KEY ||
    "DEMO_KEY";
  const today = new Date().toISOString().split("T")[0];
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${API_KEY}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: "NEO upstream error", status: res.status },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "NEO fetch failed" }, { status: 500 });
  }
}
