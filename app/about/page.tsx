import { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About | NASA Explorer",
  description:
    "Learn about NASA Explorer - your gateway to exploring space through NASA's APIs. Discover our mission to make space data accessible and engaging for everyone.",
  keywords: [
    "NASA",
    "space exploration",
    "about",
    "mission",
    "astronomy",
    "education",
    "space data",
    "API",
  ],
};

export default function AboutPage() {
  return <About />;
}
