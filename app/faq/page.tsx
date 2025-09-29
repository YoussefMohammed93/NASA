import { Metadata } from "next";
import FAQ from "@/components/FAQ";

export const metadata: Metadata = {
  title: "FAQ | NASA Explorer",
  description:
    "Frequently asked questions about NASA Explorer. Find answers about features, APIs, data sources, and how to use the platform.",
  keywords: [
    "NASA",
    "FAQ",
    "questions",
    "answers",
    "help",
    "support",
    "guide",
    "how to",
  ],
};

export default function FAQPage() {
  return <FAQ />;
}
