import { NextResponse } from "next/server";

export async function GET() {
  const API_KEY =
    process.env.NASA_API_KEY ||
    process.env.NEXT_PUBLIC_NASA_API_KEY ||
    "DEMO_KEY";
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&thumbs=true`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return NextResponse.json(
        { error: "APOD upstream error", status: res.status },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ error: "APOD fetch failed" }, { status: 500 });
    
  }
}
