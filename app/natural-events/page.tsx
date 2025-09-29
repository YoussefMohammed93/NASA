import { Metadata } from "next";
import NaturalEventsDashboard from "@/components/NaturalEventsDashboard";

export const metadata: Metadata = {
  title: "Natural Events | NASA Explorer",
  description:
    "Track real-time natural events around the world including wildfires, storms, volcanoes, and floods from NASA's Earth Observing System Data and Information System (EOSDIS).",
  keywords: [
    "NASA",
    "natural events",
    "EONET",
    "wildfires",
    "storms",
    "volcanoes",
    "floods",
    "earthquakes",
    "earth monitoring",
  ],
};

export default function NaturalEventsPage() {
  return <NaturalEventsDashboard />;
}
