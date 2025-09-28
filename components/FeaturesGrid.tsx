"use client";

import {
  Camera,
  Rocket,
  Satellite,
  Globe,
  Zap,
  Image as ImageIcon,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "APOD",
    description: "Today’s astronomy image with expert explanation.",
    href: "/apod",
    icon: Camera,
  },
  {
    title: "Mars Rover",
    description: "Latest images from Curiosity and Perseverance.",
    href: "/mars",
    icon: Rocket,
  },
  {
    title: "Near‑Earth Objects",
    description: "Track asteroids and comets approaching Earth.",
    href: "/asteroids",
    icon: Satellite,
  },
  {
    title: "Earth Imagery",
    description: "High‑resolution satellite views of our planet.",
    href: "/earth",
    icon: Globe,
  },
  {
    title: "Space Weather",
    description: "Solar activity, geomagnetic storms, and alerts.",
    href: "/space-weather",
    icon: Zap,
  },
  {
    title: "Media Gallery",
    description: "Browse NASA’s images, videos, and audio.",
    href: "/gallery",
    icon: ImageIcon,
  },
] as const;

export default function FeaturesGrid() {
  return (
    <section className="w-full border-t bg-background">
      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Explore NASA Data
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2 font-body">
            Jump into popular datasets and start exploring space right away.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group relative block rounded-4xl border bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 text-primary p-2.5">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-base leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground font-body leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-body">
                    Open section
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-primary/0 group-hover:ring-1 transition-[box-shadow,ring]" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
