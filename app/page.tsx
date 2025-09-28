import Hero from "@/components/Hero";
import Header from "@/components/Header";
import ValueProps from "@/components/ValueProps";
import FeaturesGrid from "@/components/FeaturesGrid";
import LiveHighlights from "@/components/LiveHighlights";
import GettingStarted from "@/components/GettingStarted";

export default function MainPage() {
  return (
    <div>
      <Header />
      <Hero />
      <FeaturesGrid />
      <LiveHighlights />
      <ValueProps />
      <GettingStarted />
    </div>
  );
}
