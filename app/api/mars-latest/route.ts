import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY =
    process.env.NASA_API_KEY ||
    process.env.NEXT_PUBLIC_NASA_API_KEY ||
    "DEMO_KEY";
  const base = "https://api.nasa.gov/mars-photos/api/v1/rovers";
  const rovers = ["perseverance", "curiosity"];

  for (const rover of rovers) {
    const url = `${base}/${rover}/latest_photos?api_key=${API_KEY}`;
    try {
      const res = await fetch(url, { next: { revalidate: 1800 } });
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.latest_photos?.length) {
        return NextResponse.json(data, { status: 200 });
      }
    } catch {
      // try next rover
      continue;
    }
  }

  return NextResponse.json(
    { error: "No latest photos available" },
    { status: 404 }
  );
}
