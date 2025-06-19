import Header from "@/components/header";
import BrowseSection from "@/components/browse-section";
import Footer from "@/components/footer";

export default function Browse() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <BrowseSection />
      <Footer />
    </div>
  );
}
