import { NextRequest, NextResponse } from "next/server";

// Types for NASA DONKI events (minimal fields we use)
type DonkiEventType =
  | "flare"
  | "cme"
  | "geomagneticStorm"
  | "solarEnergeticParticle"
  | "magnetopauseCrossing"
  | "radiationBeltEnhancement"
  | "highSpeedStream";

interface Instrument {
  displayName: string;
}

interface KpIndexEntry {
  kpIndex: number;
  observedTime?: string;
  source?: string;
}

interface DonkiRawEvent {
  flrID?: string;
  activityID?: string;
  gstID?: string;
  sepID?: string;
  mpcID?: string;
  rbeID?: string;
  hssID?: string;
  beginTime?: string;
  eventTime?: string;
  startTime?: string;
  peakTime?: string | null;
  endTime?: string | null;
  sourceLocation?: string | null;
  activeRegionNum?: number | null;
  note?: string;
  linkedEvents?: unknown[];
  classType?: string;
  instruments?: Instrument[];
  speed?: number;
  halfAngle?: number;
  latitude?: number;
  longitude?: number;
  mostAccurateIsEarthDirection?: boolean;
  cmeAnalyses?: unknown[];
  allKpIndex?: KpIndexEntry[];
  kpIndex?: number;
  intensityValue?: number;
}

type DonkiRawEventWithType = DonkiRawEvent & { eventType: DonkiEventType };

export async function GET(request: NextRequest) {
  try {
    const API_KEY =
      process.env.NASA_API_KEY ||
      process.env.NEXT_PUBLIC_NASA_API_KEY ||
      "DEMO_KEY";

    const { searchParams } = new URL(request.url);
    const eventType = searchParams.get("type") || "all";
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    // Default to last 7 days if no dates provided
    const defaultEndDate = new Date().toISOString().split("T")[0];
    const defaultStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const finalStartDate = startDate || defaultStartDate;
    const finalEndDate = endDate || defaultEndDate;

    // NASA DONKI API endpoints
    const endpoints = {
      flare: `https://api.nasa.gov/DONKI/FLR?startDate=${finalStartDate}&endDate=${finalEndDate}&api_key=${API_KEY}`,
      cme: `https://api.nasa.gov/DONKI/CME?startDate=${finalStartDate}&endDate=${finalEndDate}&api_key=${API_KEY}`,
      geomagneticStorm: `https://api.nasa.gov/DONKI/GST?startDate=${finalStartDate}&endDate=${finalEndDate}&api_key=${API_KEY}`,
      solarEnergeticParticle: `https://api.nasa.gov/DONKI/SEP?startDate=${finalStartDate}&endDate=${finalEndDate}&api_key=${API_KEY}`,
      magnetopauseCrossing: `https://api.nasa.gov/DONKI/MPC?startDate=${finalStartDate}&endDate=${finalEndDate}&api_key=${API_KEY}`,
      radiationBeltEnhancement: `https://api.nasa.gov/DONKI/RBE?startDate=${finalStartDate}&endDate=${finalEndDate}&api_key=${API_KEY}`,
      highSpeedStream: `https://api.nasa.gov/DONKI/HSS?startDate=${finalStartDate}&endDate=${finalEndDate}&api_key=${API_KEY}`,
    };

    let events: DonkiRawEventWithType[] = [];

    if (eventType === "all") {
      // Fetch all event types
      const promises = Object.entries(endpoints).map(async ([type, url]) => {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const dataUnknown: unknown = await response.json();
            const arr: DonkiRawEvent[] = Array.isArray(dataUnknown)
              ? (dataUnknown as DonkiRawEvent[])
              : [];
            return arr.map((event) => ({
              ...event,
              eventType: type as DonkiEventType,
            }));
          }
          return [];
        } catch (error) {
          console.warn(`Failed to fetch ${type}:`, error);
          return [];
        }
      });

      const results = await Promise.all(promises);
      events = results.flat();
    } else {
      // Fetch specific event type
      const url = endpoints[eventType as keyof typeof endpoints];
      if (!url) {
        return NextResponse.json(
          { error: "Invalid event type" },
          { status: 400 }
        );
      }

      const response = await fetch(url);
      if (!response.ok) {
        return NextResponse.json(
          { error: "DONKI API upstream error", status: response.status },
          { status: 502 }
        );
      }

      const dataUnknown: unknown = await response.json();
      const arr: DonkiRawEvent[] = Array.isArray(dataUnknown)
        ? (dataUnknown as DonkiRawEvent[])
        : [];
      events = arr.map((event) => ({
        ...event,
        eventType: eventType as DonkiEventType,
      }));
    }

    // Normalize and sort events
    const normalizedEvents = events
      .map((event: DonkiRawEventWithType) => {
        const baseEvent = {
          id:
            event.flrID ||
            event.activityID ||
            event.gstID ||
            event.sepID ||
            event.mpcID ||
            event.rbeID ||
            event.hssID ||
            `${event.eventType}-${Date.now()}-${Math.random()}`,
          eventType: event.eventType,
          // Guarantee a string for beginTime for downstream consumers
          beginTime:
            event.beginTime || event.eventTime || event.startTime || "",
          peakTime: event.peakTime || null,
          endTime: event.endTime || null,
          sourceLocation: event.sourceLocation || null,
          activeRegionNum: event.activeRegionNum || null,
          note: event.note || "",
          linkedEvents: event.linkedEvents || [],
        };

        // Add type-specific properties
        switch (event.eventType) {
          case "flare":
            return {
              ...baseEvent,
              classType: event.classType,
              instruments: event.instruments || [],
            };
          case "cme":
            return {
              ...baseEvent,
              speed: event.speed,
              halfAngle: event.halfAngle,
              latitude: event.latitude,
              longitude: event.longitude,
              mostAccurateIsEarthDirection: event.mostAccurateIsEarthDirection,
              cmeAnalyses: event.cmeAnalyses || [],
            };
          case "geomagneticStorm":
            return {
              ...baseEvent,
              allKpIndex: event.allKpIndex || [],
              kpIndex: event.kpIndex,
            };
          case "solarEnergeticParticle":
            return {
              ...baseEvent,
              instruments: event.instruments || [],
              intensityValue: event.intensityValue,
            };
          case "magnetopauseCrossing":
            return {
              ...baseEvent,
              instruments: event.instruments || [],
            };
          case "radiationBeltEnhancement":
            return {
              ...baseEvent,
              instruments: event.instruments || [],
            };
          case "highSpeedStream":
            return {
              ...baseEvent,
              instruments: event.instruments || [],
              speed: event.speed,
            };
          default:
            return baseEvent;
        }
      })
      .sort((a, b) => {
        const tb = Date.parse(b.beginTime ?? "");
        const ta = Date.parse(a.beginTime ?? "");
        const nb = Number.isNaN(tb) ? 0 : tb;
        const na = Number.isNaN(ta) ? 0 : ta;
        return nb - na;
      });

    // Calculate summary statistics
    const summary = {
      total: normalizedEvents.length,
      flares: normalizedEvents.filter((e) => e.eventType === "flare").length,
      cmes: normalizedEvents.filter((e) => e.eventType === "cme").length,
      geomagneticStorms: normalizedEvents.filter(
        (e) => e.eventType === "geomagneticStorm"
      ).length,
      solarEnergeticParticles: normalizedEvents.filter(
        (e) => e.eventType === "solarEnergeticParticle"
      ).length,
      dateRange: {
        start: finalStartDate,
        end: finalEndDate,
      },
    };

    return NextResponse.json({
      events: normalizedEvents,
      summary,
      dateRange: {
        start: finalStartDate,
        end: finalEndDate,
      },
    });
  } catch (error) {
    console.error("Space Weather API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch space weather data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
