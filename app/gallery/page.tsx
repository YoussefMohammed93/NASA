import { Metadata } from "next";
import Gallery from "@/components/Gallery";

export const metadata: Metadata = {
  title: "Image Gallery | NASA Explorer",
  description:
    "Explore NASA's vast collection of stunning space imagery, from Earth observations to deep space photography. Discover the universe through the lens of NASA's missions.",
  keywords: [
    "NASA",
    "space images",
    "astronomy",
    "photography",
    "Earth",
    "planets",
    "galaxies",
    "space exploration",
    "satellite imagery",
  ],
};

export default function GalleryPage() {
  return <Gallery />;
}
