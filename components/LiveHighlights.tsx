"use client";

import {
  Camera,
  Rocket,
  Satellite,
  ExternalLink,
  AlertTriangle,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  type ProcessedAPOD,
  type ProcessedNEOData,
  type ProcessedMarsPhoto,
  fetchAllLiveHighlights,
} from "@/lib/nasa-api-service";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function LiveHighlights() {
  const [loading, setLoading] = useState(true);
  const [apodData, setApodData] = useState<ProcessedAPOD | null>(null);
  const [marsData, setMarsData] = useState<ProcessedMarsPhoto | null>(null);
  const [neoData, setNeoData] = useState<ProcessedNEOData | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setErrors([]);

        const result = await fetchAllLiveHighlights();

        setApodData(result.apod);
        setMarsData(result.mars);
        setNeoData(result.neo);
        setErrors(result.errors);
      } catch (err) {
        console.error("Error loading live highlights:", err);
        setErrors(["Failed to load live data"]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <section className="w-full bg-background">
      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Live from NASA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2 font-body">
            Fresh data and discoveries updated daily from space missions.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {/* APOD Card */}
          <div className="bg-card text-card-foreground border rounded-4xl hover:bg-accent hover:text-accent-foreground transition-colors">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-2xl bg-primary/10 text-primary p-2.5">
                  <Camera className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-base sm:text-lg">
                    Astronomy Picture
                  </h3>
                  <p className="text-xs text-muted-foreground font-body sm:text-sm">
                    Today&apos;s APOD
                  </p>
                </div>
              </div>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ) : errors.length > 0 ? (
                <div className="text-center flex flex-col items-center justify-center py-8 text-muted-foreground min-h-[200px]">
                  <AlertTriangle className="h-8 w-8 mx-auto my-2 text-destructive" />
                  <p className="text-sm">Unable to load image.</p>
                </div>
              ) : apodData ? (
                <div className="space-y-3">
                  <div className="relative h-40 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={apodData.url}
                      alt={apodData.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h4 className="font-heading font-medium text-sm sm:text-base leading-tight line-clamp-2">
                    {apodData.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span className="font-body">{apodData.date}</span>
                  </div>
                </div>
              ) : null}
              <div className="mt-4 pt-4 border-t">
                <Link
                  href="/apod"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors font-heading"
                >
                  Open APOD
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
          {/* Mars Latest Card */}
          <div className="bg-card text-card-foreground border rounded-4xl hover:bg-accent hover:text-accent-foreground transition-colors">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-2xl bg-primary/10 text-primary p-2.5">
                  <Rocket className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-base sm:text-lg">
                    Mars Latest
                  </h3>
                  <p className="text-xs text-muted-foreground font-body sm:text-sm">
                    Fresh from the Red Planet
                  </p>
                </div>
              </div>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-40 w-full rounded-lg" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ) : errors.length > 0 ? (
                <div className="text-center flex flex-col items-center justify-center py-8 text-muted-foreground min-h-[200px]">
                  <AlertTriangle className="h-8 w-8 mx-auto my-2 text-destructive" />
                  <p className="text-sm">Unable to load image.</p>
                </div>
              ) : marsData ? (
                <div className="space-y-3">
                  <div className="relative h-40 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={marsData.img_src}
                      alt={`Mars photo from ${marsData.rover.name}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h4 className="font-heading font-medium text-sm sm:text-base leading-tight">
                    {marsData.rover.name} • {marsData.camera.name}
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span className="font-body">
                        Sol {marsData.sol} • {marsData.earth_date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="font-body">
                        {marsData.camera.full_name}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="mt-4 pt-4 border-t">
                <Link
                  href="/mars"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors font-heading"
                >
                  Open Mars Photos
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
          {/* NEO Today Card */}
          <div className="bg-card text-card-foreground border rounded-4xl hover:bg-accent hover:text-accent-foreground transition-colors">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-2xl bg-primary/10 text-primary p-2.5">
                  <Satellite className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-base sm:text-lg">
                    Near-Earth Objects
                  </h3>
                  <p className="text-xs text-muted-foreground font-body sm:text-sm">
                    Today&apos;s close approaches
                  </p>
                </div>
              </div>
              {loading ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <Skeleton className="h-24 w-24 mx-auto rounded-3xl mb-4" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      <Skeleton className="h-6 w-full rounded-lg" />
                    </div>
                    <Skeleton className="h-3 w-40 mt-2" />
                  </div>
                </div>
              ) : errors.length > 0 ? (
                <div className="text-center flex flex-col items-center justify-center py-8 text-muted-foreground min-h-[200px]">
                  <AlertTriangle className="h-8 w-8 mx-auto my-2 text-destructive" />
                  <p className="text-sm">Unable to load image.</p>
                </div>
              ) : neoData ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="bg-foreground/5 inline-block p-8 rounded-4xl text-3xl font-bold font-heading text-foreground mb-1">
                      {neoData.count}
                    </div>
                    <p className="text-sm text-muted-foreground font-body pt-2">
                      Objects approaching today
                    </p>
                  </div>
                  <div className="space-y-2">
                    {neoData.hazardous_count > 0 && (
                      <div className="flex items-center gap-2 py-2 px-3 rounded-lg bg-destructive/10 text-destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-xs font-body">
                          {neoData.hazardous_count} potentially hazardous
                        </span>
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground font-body pt-2">
                      Closest approach: {neoData.closest_approach_km} km
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="mt-4 pt-4 border-t">
                <Link
                  href="/asteroids"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors font-heading"
                >
                  Track Asteroids
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
