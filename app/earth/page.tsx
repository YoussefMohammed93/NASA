import { Metadata } from "next";
import EarthGallery from "@/components/EarthGallery";

export const metadata: Metadata = {
  title: "Earth from Space | NASA Explorer",
  description:
    "View stunning images of Earth from NASA's EPIC (DSCOVR) satellite, capturing our planet from the unique vantage point of the L1 Lagrange point.",
  keywords: ["NASA", "Earth", "EPIC", "DSCOVR", "satellite", "space", "planet"],
};

export default function EarthPage() {
  return <EarthGallery />;
}
