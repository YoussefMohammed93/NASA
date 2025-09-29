import { Metadata } from "next";
import Docs from "@/components/Docs";

export const metadata: Metadata = {
  title: "Documentation | NASA Explorer",
  description:
    "Complete guide to using NASA Explorer. Learn about all features, APIs, and how to explore space data from NASA's missions.",
  keywords: [
    "NASA",
    "documentation",
    "API",
    "guide",
    "tutorial",
    "space data",
    "astronomy",
    "how to use",
  ],
};

export default function DocsPage() {
  return <Docs />;
}
