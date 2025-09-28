import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || "";
    const type = searchParams.get("type") || "natural";

    // Validate type
    if (!["natural", "enhanced"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid type. Must be 'natural' or 'enhanced'" },
        { status: 400 }
      );
    }

    let url: string;

    if (date) {
      // Specific date format: YYYY-MM-DD
      url = `https://epic.gsfc.nasa.gov/api/${type}/date/${date}`;
    } else {
      // Latest available images
      url = `https://epic.gsfc.nasa.gov/api/${type}`;
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "NASA-Explorer-App/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "EPIC API upstream error", status: response.status },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Normalize the EPIC response
    const normalizedImages = (data || []).map(
      (item: {
        identifier?: string;
        image: string;
        caption?: string;
        date: string;
        centroid_coordinates?: { lat: number; lon: number };
      }) => {
        const imageDate = item.date || "";
        const [year, month, day] = imageDate.split(" ")[0].split("-");

        return {
          id: item.identifier || item.image,
          image: item.image,
          caption: item.caption || "",
          date: item.date,
          coords: item.centroid_coordinates || { lat: 0, lon: 0 },
          image_url: `https://epic.gsfc.nasa.gov/archive/${type}/${year}/${month}/${day}/png/${item.image}.png`,
          type: type,
        };
      }
    );

    return NextResponse.json({
      images: normalizedImages,
      total: normalizedImages.length,
      date: date || "latest",
      type: type,
    });
  } catch (error) {
    console.error("Earth EPIC API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Earth images",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
