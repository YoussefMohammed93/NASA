import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const API_KEY =
    process.env.NASA_API_KEY ||
    process.env.NEXT_PUBLIC_NASA_API_KEY ||
    "DEMO_KEY";

  // Extract date parameter from URL
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  // Validate date format (YYYY-MM-DD) and range
  const validateDate = (dateString: string | null): string | null => {
    if (!dateString) return null;

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return null;

    const inputDate = new Date(dateString);
    const minDate = new Date("1995-06-16"); // First APOD
    const maxDate = new Date(); // Today

    if (inputDate < minDate || inputDate > maxDate) return null;

    return dateString;
  };

  const validDate = validateDate(date);

  // Build URL with optional date parameter
  let url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&thumbs=true`;
  if (validDate) {
    url += `&date=${validDate}`;
  }

  try {
    // Use no-cache for dynamic date requests
    const cacheOptions = validDate
      ? { cache: "no-store" as const }
      : { next: { revalidate: 3600 } };
    const res = await fetch(url, cacheOptions);

    if (!res.ok) {
      return NextResponse.json(
        { error: "APOD upstream error", status: res.status },
        { status: 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("APOD API Error:", error);
    return NextResponse.json({ error: "APOD fetch failed" }, { status: 500 });
  }
}
