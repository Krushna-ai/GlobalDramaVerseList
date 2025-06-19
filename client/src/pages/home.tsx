import Header from "@/components/header";
import Hero from "@/components/hero";
import FeaturedSection from "@/components/featured-section";
import TopRatedSection from "@/components/top-rated-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <Hero />
      <FeaturedSection />
      <TopRatedSection />
      <Footer />
    </div>
  );
}
