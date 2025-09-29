import { Metadata } from "next";
import SpaceWeatherDashboard from "@/components/SpaceWeatherDashboard";

export const metadata: Metadata = {
  title: "Space Weather | NASA Explorer",
  description:
    "Monitor real-time space weather events including solar flares, coronal mass ejections, and geomagnetic storms from NASA's DONKI database.",
  keywords: [
    "NASA",
    "space weather",
    "solar flares",
    "CME",
    "geomagnetic storms",
    "DONKI",
    "solar activity",
  ],
};

export default function SpaceWeatherPage() {
  return <SpaceWeatherDashboard />;
}
