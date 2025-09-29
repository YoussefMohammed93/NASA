import { Metadata } from "next";
import Terms from "@/components/Terms";

export const metadata: Metadata = {
  title: "Terms of Service | NASA Explorer",
  description:
    "Terms and conditions for using NASA Explorer. Learn about acceptable use, content rights, and our service agreement.",
  keywords: [
    "terms of service",
    "terms and conditions",
    "user agreement",
    "NASA Explorer",
  ],
};

export default function TermsPage() {
  return <Terms />;
}
