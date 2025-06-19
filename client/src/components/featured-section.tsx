import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import ContentCard from "./content-card";
import type { Content } from "@shared/schema";

export default function FeaturedSection() {
  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/contents/featured"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-700 aspect-[2/3] rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-white">Featured titles</h3>
          <Link href="/browse">
            <span className="text-yellow-400 hover:text-yellow-300 font-semibold flex items-center cursor-pointer">
              See all titles <ArrowRight className="ml-1 w-4 h-4" />
            </span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {contents?.slice(0, 10).map((content) => (
            <ContentCard key={content.id} content={content} variant="imdb" />
          ))}
        </div>
      </div>
    </section>
  );
}
