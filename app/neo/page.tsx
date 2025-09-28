import { Metadata } from "next";
import NEODashboard from "@/components/NEODashboard";

export const metadata: Metadata = {
  title: "NEO Dashboard - Near Earth Objects | NASA Explorer",
  description:
    "Track near-Earth asteroids and comets. View potentially hazardous objects, sizes, distances, and approach dates from NASA's NEO database.",
  keywords: [
    "NASA",
    "NEO",
    "asteroids",
    "near earth objects",
    "space",
    "astronomy",
  ],
  openGraph: {
    title: "NEO Dashboard - Track Near Earth Objects",
    description:
      "Monitor potentially hazardous asteroids and their approach dates",
    type: "website",
  },
};

export default function NEOPage() {
  return <NEODashboard />;
}
