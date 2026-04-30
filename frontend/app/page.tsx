import { Hero } from "./components/home/Hero";
import { NavBar } from "./components/NavBar/navBar";
import { DashboardFeature } from "./components/home/DashboardFeature";
import { HoldingsFeature } from "./components/home/HoldingsFeature";
import { HistoryFeature } from "./components/home/HistoryFeature";
import { CTASection } from "./components/home/CTASection";
import { MarketFeature } from "./components/home/MarketFeature";
export default function Home() {

  return (
    <div className="flex flex-col max-w-full  ">
      <Hero />
      <DashboardFeature />
      <HoldingsFeature />
      <HistoryFeature />
      <MarketFeature />
      <CTASection />
    </div>
  )
}