"use client";

import {
  Search,
  Eye,
  Share2,
  ArrowRight,
  Camera,
  Rocket,
  Satellite,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Choose Your Dataset",
    description:
      "Pick from Mars rover photos, astronomy images, or near-Earth objects to start exploring.",
    icon: Search,
    cta: "Browse Datasets",
    href: "/apod",
    features: [
      { icon: Camera, label: "Daily Space Photos" },
      { icon: Rocket, label: "Mars Rover Images" },
      { icon: Satellite, label: "Asteroid Tracking" },
    ],
  },
  {
    number: "02",
    title: "Explore the Data",
    description:
      "Dive deep into NASA's collection with real-time data, detailed metadata, and stunning visuals.",
    icon: Eye,
    cta: "Start Exploring",
    href: "/mars",
    features: [
      { icon: Search, label: "Advanced Filters" },
      { icon: Eye, label: "High-Res Viewing" },
      { icon: ArrowRight, label: "Related Content" },
    ],
  },
  {
    number: "03",
    title: "Save & Share",
    description:
      "Bookmark your favorites, download images, and share discoveries with the space community.",
    icon: Share2,
    cta: "View Gallery",
    href: "/asteroids",
    features: [
      { icon: Share2, label: "Social Sharing" },
      { icon: ArrowRight, label: "Direct Links" },
      { icon: Eye, label: "Personal Collection" },
    ],
  },
] as const;

export default function GettingStarted() {
  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Getting Started
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2 font-body max-w-2xl mx-auto">
            Start your space exploration journey in three simple steps. From
            discovery to sharing, we&apos;ve made it effortless.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="group relative bg-card text-card-foreground border rounded-4xl p-6 hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            >
              <div className="absolute -top-3 -left-3 z-10">
                <div className="bg-primary text-primary-foreground dark:text-foreground rounded-2xl px-3 py-1.5 text-sm font-bold font-heading border-2 border-background">
                  {step.number}
                </div>
              </div>
              <div className="mb-6 mt-4">
                <div className="rounded-2xl bg-primary/10 text-primary p-4 w-fit group-hover:bg-primary/20 transition-colors">
                  <step.icon className="h-8 w-8" />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-heading font-semibold text-lg sm:text-xl leading-tight mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="space-y-2">
                  {step.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground"
                    >
                      <feature.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="font-body">{feature.label}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2">
                  <Link href={step.href}>
                    <Button className="w-full rounded-2xl font-heading dark:text-foreground">
                      {step.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-border">
                  <div className="absolute -right-1 -top-1 w-2 h-2 bg-primary rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-body">
              Ready to start your space exploration journey?
            </p>
            <Link href="/apod">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground dark:text-foreground font-heading rounded-2xl"
              >
                Begin Exploring
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
