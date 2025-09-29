import { NextRequest, NextResponse } from "next/server";

// Types for NASA Images API
interface NasaImageLink {
  href: string;
  rel: string;
  render?: string;
}

interface NasaImageData {
  nasa_id: string;
  title: string;
  description?: string;
  media_type: string;
  date_created: string;
  center?: string;
  keywords?: string[];
  photographer?: string;
  location?: string;
  album?: string[];
}

interface NasaImageItem {
  href: string;
  data: NasaImageData[];
  links?: NasaImageLink[];
}

interface NasaImagesResponse {
  collection: {
    version: string;
    href: string;
    items: NasaImageItem[];
    metadata: {
      total_hits: number;
    };
    links?: NasaImageLink[];
  };
}

interface NormalizedImage {
  id: string;
  title: string;
  description: string;
  dateCreated: string;
  center: string;
  keywords: string[];
  photographer: string;
  location: string;
  thumbnailUrl: string;
  originalUrl: string;
  mediaType: string;
}

interface GalleryResponse {
  images: NormalizedImage[];
  totalHits: number;
  hasMore: boolean;
  page: number;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "space";
    const page = parseInt(searchParams.get("page") || "1");
    const mediaType = searchParams.get("media_type") || "image";
    const yearStart = searchParams.get("year_start") || "";
    const yearEnd = searchParams.get("year_end") || "";
    const center = searchParams.get("center") || "";

    // Build NASA Images API URL
    const baseUrl = "https://images-api.nasa.gov/search";
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      page_size: "24",
      media_type: mediaType,
    });

    if (yearStart) params.append("year_start", yearStart);
    if (yearEnd) params.append("year_end", yearEnd);
    if (center) params.append("center", center);

    const nasaUrl = `${baseUrl}?${params}`;

    const response = await fetch(nasaUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "NASA Images API upstream error", status: response.status },
        { status: 502 }
      );
    }

    const dataUnknown: unknown = await response.json();

    // Type guard for NASA Images response
    if (
      !dataUnknown ||
      typeof dataUnknown !== "object" ||
      !("collection" in dataUnknown)
    ) {
      return NextResponse.json(
        { error: "Invalid NASA Images API response format" },
        { status: 502 }
      );
    }

    const data = dataUnknown as NasaImagesResponse;
    const items = Array.isArray(data.collection.items)
      ? data.collection.items
      : [];

    // Normalize images
    const normalizedImages: NormalizedImage[] = items
      .filter((item) => item.data && item.data.length > 0)
      .map((item) => {
        const imageData = item.data[0];
        const thumbnailLink = item.links?.find(
          (link) => link.rel === "preview"
        );

        // Get original image URL from item.href (manifest URL)
        const originalUrl = item.href;
        const thumbnailUrl = thumbnailLink?.href || "";

        return {
          id: imageData.nasa_id,
          title: imageData.title || "Untitled",
          description: imageData.description || "",
          dateCreated: imageData.date_created,
          center: imageData.center || "",
          keywords: imageData.keywords || [],
          photographer: imageData.photographer || "",
          location: imageData.location || "",
          thumbnailUrl,
          originalUrl,
          mediaType: imageData.media_type,
        };
      });

    const totalHits = data.collection.metadata?.total_hits || 0;
    const hasMore = page * 24 < totalHits;

    const responseData: GalleryResponse = {
      images: normalizedImages,
      totalHits,
      hasMore,
      page,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Gallery API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch gallery data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
