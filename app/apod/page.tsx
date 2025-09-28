import { Metadata } from "next";
import APODViewer from "@/components/APODViewer";

export const metadata: Metadata = {
  title: "Astronomy Picture of the Day | NASA Explorer",
  description:
    "Discover the cosmos with NASA's Astronomy Picture of the Day. Explore stunning space imagery with expert explanations, updated daily.",
  keywords: [
    "NASA",
    "APOD",
    "astronomy",
    "space",
    "pictures",
    "cosmos",
    "universe",
  ],
  openGraph: {
    title: "Astronomy Picture of the Day | NASA Explorer",
    description:
      "Discover the cosmos with NASA's Astronomy Picture of the Day. Explore stunning space imagery with expert explanations, updated daily.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Astronomy Picture of the Day | NASA Explorer",
    description:
      "Discover the cosmos with NASA's Astronomy Picture of the Day. Explore stunning space imagery with expert explanations, updated daily.",
  },
};

export default function APODPage() {
  return (
    <div className="min-h-screen bg-background">
      <APODViewer />
    </div>
  );
}
