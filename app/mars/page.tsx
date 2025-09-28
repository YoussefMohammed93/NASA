import { Metadata } from "next";
import MarsGallery from "@/components/MarsGallery";

export const metadata: Metadata = {
  title: "Mars Rover Photos - Explore the Red Planet | NASA Explorer",
  description:
    "Explore stunning images from NASA's Mars rovers including Curiosity, Perseverance, Opportunity, and Spirit. View photos by camera, date, and sol with high-resolution downloads.",
  keywords: [
    "NASA",
    "Mars",
    "rover",
    "photos",
    "Curiosity",
    "Perseverance",
    "Opportunity",
    "Spirit",
    "Red Planet",
    "space exploration",
    "Mars images",
  ],
  openGraph: {
    title: "Mars Rover Photos - Explore the Red Planet",
    description:
      "Browse stunning images captured by NASA's Mars rovers across different missions and cameras",
    type: "website",
  },
};

export default function MarsPage() {
  return <MarsGallery />;
}
