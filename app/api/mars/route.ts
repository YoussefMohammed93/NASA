import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const API_KEY =
      process.env.NASA_API_KEY ||
      process.env.NEXT_PUBLIC_NASA_API_KEY ||
      "DEMO_KEY";

    const { searchParams } = new URL(request.url);
    const rover = searchParams.get("rover") || "curiosity";
    const camera = searchParams.get("camera") || "";
    const sol = searchParams.get("sol") || "";
    const earthDate = searchParams.get("earth_date") || "";
    const page = parseInt(searchParams.get("page") || "1");

    // Build URL based on parameters
    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?api_key=${API_KEY}&page=${page}`;

    if (sol) {
      url += `&sol=${sol}`;
    } else if (earthDate) {
      url += `&earth_date=${earthDate}`;
    } else {
      // Default to latest sol if no date specified
      url += `&sol=1000`;
    }

    if (camera) {
      url += `&camera=${camera}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Mars Rover API upstream error", status: response.status },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Convert HTTP URLs to HTTPS for security and browser compatibility
    const photosWithHttps = (data.photos || []).map(
      (photo: { img_src?: string; [key: string]: unknown }) => ({
        ...photo,
        img_src:
          photo.img_src?.replace(/^http:\/\//, "https://") || photo.img_src,
      })
    );

    return NextResponse.json({
      photos: photosWithHttps,
      rover: rover,
      total_results: photosWithHttps.length,
      page: page,
    });
  } catch (error) {
    console.error("Mars API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
