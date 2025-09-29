import { Metadata } from "next";
import Privacy from "@/components/Privacy";

export const metadata: Metadata = {
  title: "Privacy Policy | NASA Explorer",
  description:
    "Learn how NASA Explorer handles your data and protects your privacy. We don't collect or store personal information.",
  keywords: ["privacy policy", "data protection", "privacy", "NASA Explorer"],
};

export default function PrivacyPage() {
  return <Privacy />;
}
