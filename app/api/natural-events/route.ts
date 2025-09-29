import { NextRequest, NextResponse } from "next/server";

// Types for NASA EONET Natural Events
interface EonetGeometry {
  type: "Point" | "Polygon";
  coordinates: number[] | number[][];
}

interface EonetSource {
  id: string;
  url: string;
}

interface EonetCategory {
  id: string;
  title: string;
}

interface EonetRawEvent {
  id: string;
  title: string;
  description?: string;
  link: string;
  closed?: string | null;
  categories: EonetCategory[];
  sources: EonetSource[];
  geometry: EonetGeometry[];
}

interface NormalizedEvent {
  id: string;
  title: string;
  description: string;
  link: string;
  status: "Open" | "Closed";
  closedDate: string | null;
  categories: EonetCategory[];
  sources: EonetSource[];
  coordinates: {
    lat: number;
    lon: number;
  } | null;
  geometry: EonetGeometry[];
  lastUpdated: string;
}

interface NaturalEventsResponse {
  events: NormalizedEvent[];
  summary: {
    total: number;
    open: number;
    closed: number;
    categories: Record<string, number>;
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const limit = searchParams.get("limit") || "50";
    const days = searchParams.get("days") || "30";

    // Build EONET API URL
    const baseUrl = "https://eonet.gsfc.nasa.gov/api/v3/events";
    const params = new URLSearchParams({
      limit,
      days,
    });

    if (category && category !== "all") {
      params.append("category", category);
    }

    if (status && status !== "all") {
      params.append("status", status.toLowerCase());
    }

    const eonetUrl = `${baseUrl}?${params}`;

    const response = await fetch(eonetUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "EONET API upstream error", status: response.status },
        { status: 502 }
      );
    }

    const dataUnknown: unknown = await response.json();

    // Type guard for EONET response
    if (
      !dataUnknown ||
      typeof dataUnknown !== "object" ||
      !("events" in dataUnknown)
    ) {
      return NextResponse.json(
        { error: "Invalid EONET API response format" },
        { status: 502 }
      );
    }

    const data = dataUnknown as { events: EonetRawEvent[] };
    const rawEvents = Array.isArray(data.events) ? data.events : [];

    // Normalize events
    const normalizedEvents: NormalizedEvent[] = rawEvents.map((event) => {
      // Extract coordinates from geometry (use first point if available)
      let coordinates: { lat: number; lon: number } | null = null;
      if (event.geometry && event.geometry.length > 0) {
        const firstGeom = event.geometry[0];
        if (
          firstGeom.type === "Point" &&
          Array.isArray(firstGeom.coordinates)
        ) {
          const coords = firstGeom.coordinates as number[];
          if (coords.length >= 2) {
            coordinates = {
              lon: coords[0],
              lat: coords[1],
            };
          }
        }
      }

      return {
        id: event.id,
        title: event.title,
        description: event.description || "",
        link: event.link,
        status: event.closed ? "Closed" : "Open",
        closedDate: event.closed || null,
        categories: event.categories || [],
        sources: event.sources || [],
        coordinates,
        geometry: event.geometry || [],
        lastUpdated: new Date().toISOString(),
      };
    });

    // Calculate summary statistics
    const summary = {
      total: normalizedEvents.length,
      open: normalizedEvents.filter((e) => e.status === "Open").length,
      closed: normalizedEvents.filter((e) => e.status === "Closed").length,
      categories: normalizedEvents.reduce((acc, event) => {
        event.categories.forEach((cat) => {
          acc[cat.title] = (acc[cat.title] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>),
    };

    const responseData: NaturalEventsResponse = {
      events: normalizedEvents,
      summary,
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Natural Events API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch natural events data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
