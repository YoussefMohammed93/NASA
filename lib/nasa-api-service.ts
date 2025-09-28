export interface APODResponse {
  title: string;
  url: string;
  hdurl?: string;
  explanation: string;
  date: string;
  media_type: "image" | "video";
  copyright?: string;
  thumbnail_url?: string;
}

export interface MarsPhoto {
  id: number;
  sol: number;
  camera: {
    id: number;
    name: string;
    rover_id: number;
    full_name: string;
  };
  img_src: string;
  earth_date: string;
  rover: {
    id: number;
    name: string;
    landing_date: string;
    launch_date: string;
    status: string;
  };
}

export interface MarsLatestPhotosResponse {
  latest_photos: MarsPhoto[];
}

export interface NEOObject {
  id: string;
  neo_reference_id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity: {
      kilometers_per_second: string;
      kilometers_per_hour: string;
      miles_per_hour: string;
    };
    miss_distance: {
      astronomical: string;
      lunar: string;
      kilometers: string;
      miles: string;
    };
    orbiting_body: string;
  }>;
}

export interface NEOFeedResponse {
  links: {
    next?: string;
    prev?: string;
    self: string;
  };
  element_count: number;
  near_earth_objects: Record<string, NEOObject[]>;
}

export interface ProcessedAPOD {
  title: string;
  url: string;
  date: string;
  media_type: string;
}

export interface ProcessedMarsPhoto {
  id: number;
  img_src: string;
  earth_date: string;
  sol: number;
  camera: {
    name: string;
    full_name: string;
  };
  rover: {
    name: string;
  };
}

export interface ProcessedNEOData {
  count: number;
  hazardous_count: number;
  closest_approach_km: string;
}

// API Service Functions

/**
 * Fetch today's Astronomy Picture of the Day
 */
export async function fetchAPOD(): Promise<ProcessedAPOD> {
  try {
    const response = await fetch(`/api/apod`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`APOD API error: ${response.status}`);
    }

    const data: APODResponse = await response.json();

    return {
      title: data.title,
      url:
        data.media_type === "image" ? data.url : data.thumbnail_url || data.url,
      date: data.date,
      media_type: data.media_type,
    };
  } catch (error) {
    console.error("Error fetching APOD:", error);
    throw new Error("Failed to fetch APOD data");
  }
}

/**
 * Fetch latest Mars rover photo from Perseverance or Curiosity
 */
export async function fetchLatestMarsPhoto(): Promise<ProcessedMarsPhoto> {
  try {
    const response = await fetch(`/api/mars-latest`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Mars Latest API error: ${response.status}`);
    }
    const data: MarsLatestPhotosResponse = await response.json();
    if (data.latest_photos && data.latest_photos.length > 0) {
      const photo = data.latest_photos[0];
      return {
        id: photo.id,
        img_src: photo.img_src,
        earth_date: photo.earth_date,
        sol: photo.sol,
        camera: {
          name: photo.camera.name,
          full_name: photo.camera.full_name,
        },
        rover: {
          name: photo.rover.name,
        },
      };
    }
    throw new Error("No Mars photos available");
  } catch (error) {
    console.error("Error fetching Mars photo:", error);
    throw new Error("Failed to fetch Mars rover data");
  }
}

/**
 * Fetch Near Earth Objects for today
 */
export async function fetchNEOData(): Promise<ProcessedNEOData> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const response = await fetch(`/api/neo-today`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`NEO API error: ${response.status}`);
    }

    const data: NEOFeedResponse = await response.json();

    const todayObjects = data.near_earth_objects[today] || [];
    const hazardousCount = todayObjects.filter(
      (obj) => obj.is_potentially_hazardous_asteroid
    ).length;

    let closestDistance = Infinity;
    todayObjects.forEach((obj) => {
      obj.close_approach_data.forEach((approach) => {
        const distance = parseFloat(
          approach.miss_distance.kilometers.replace(/,/g, "")
        );
        if (distance < closestDistance) {
          closestDistance = distance;
        }
      });
    });

    const closestDistanceFormatted =
      closestDistance === Infinity
        ? "N/A"
        : new Intl.NumberFormat().format(Math.round(closestDistance));

    return {
      count: data.element_count,
      hazardous_count: hazardousCount,
      closest_approach_km: closestDistanceFormatted,
    };
  } catch (error) {
    console.error("Error fetching NEO data:", error);
    throw new Error("Failed to fetch NEO data");
  }
}

/**
 * Fetch all live highlights data in parallel
 */
export async function fetchAllLiveHighlights(): Promise<{
  apod: ProcessedAPOD | null;
  mars: ProcessedMarsPhoto | null;
  neo: ProcessedNEOData | null;
  errors: string[];
}> {
  const results = await Promise.allSettled([
    fetchAPOD(),
    fetchLatestMarsPhoto(),
    fetchNEOData(),
  ]);

  return {
    apod: results[0].status === "fulfilled" ? results[0].value : null,
    mars: results[1].status === "fulfilled" ? results[1].value : null,
    neo: results[2].status === "fulfilled" ? results[2].value : null,
    errors: results
      .map((result) =>
        result.status === "rejected" ? result.reason.message : null
      )
      .filter(Boolean),
  };
}
