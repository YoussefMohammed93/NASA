"use client";

import { Shield, Zap, Globe, Code, CheckCircle, Rocket } from "lucide-react";

const benefits = [
  {
    title: "Official NASA Data",
    description:
      "Direct access to authentic space data from NASA's public APIs with real-time updates.",
    icon: Shield,
    highlight: "Verified & Trusted",
  },
  {
    title: "Lightning Fast",
    description:
      "Optimized performance with smart caching and modern web technologies for instant results.",
    icon: Zap,
    highlight: "Sub-second Loading",
  },
  {
    title: "Always Accessible",
    description:
      "Designed for everyone with screen reader support, keyboard navigation, and responsive design.",
    icon: Globe,
    highlight: "WCAG Compliant",
  },
  {
    title: "Open Source",
    description:
      "Built transparently with modern React, Next.js, and open APIs. Contribute on GitHub.",
    icon: Code,
    highlight: "MIT Licensed",
  },
] as const;

export default function ValueProps() {
  return (
    <section className="w-full bg-muted/35">
      <div className="max-w-7xl mx-auto px-5 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
            Why NASA Explorer?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-2 font-body max-w-2xl mx-auto">
            The most reliable and user-friendly way to explore NASA&apos;s vast
            collection of space data and imagery.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="group relative bg-card text-card-foreground border rounded-4xl p-6 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <div className="mb-4">
                <div className="rounded-2xl bg-primary/10 text-primary p-3 w-fit group-hover:bg-primary/20 transition-colors">
                  <benefit.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <h3 className="font-heading font-semibold text-base sm:text-lg leading-tight">
                    {benefit.title}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-3">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-muted-foreground font-body">
                      {benefit.highlight}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  {benefit.description}
                </p>
              </div>
              <div className="absolute top-4 right-4 opacity-30 dark:opacity-50 dark:group-hover:opacity-80 group-hover:opacity-50 transition-opacity">
                <span className="text-2xl font-bold font-heading">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 border border-border bg-primary/10 dark:bg-secondary text-primary dark:text-foreground px-4 py-2 rounded-full text-sm font-medium font-body">
            <Rocket className="h-4 w-4" />
            <span>Ready to explore the universe?</span>
          </div>
        </div>
      </div>
    </section>
  );
}
