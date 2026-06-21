import Banner from "@/components/Home/Banner";
import FeaturedClasses from "@/components/Home/FeaturedClasses";
import InteractiveFeatureSection from "@/components/Home/InteractiveFeatureSection";
import LatestForumPosts from "@/components/Home/LatestForumPosts";
import StatsTelemetrySection from "@/components/Home/StatsTelemetrySection";

export default function Home() {
  return (
    <div className="">
      <Banner />
      <FeaturedClasses />
      <StatsTelemetrySection />
      <LatestForumPosts/>
      <InteractiveFeatureSection/>
    </div>
  );
}
