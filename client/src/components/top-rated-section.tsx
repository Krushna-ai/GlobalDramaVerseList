import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import ContentCard from "./content-card";
import { Button } from "@/components/ui/button";
import type { Content } from "@shared/schema";

export default function TopRatedSection() {
  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/contents/top-rated"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="text-center mb-12">
              <div className="h-8 bg-gray-600 rounded w-64 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-600 rounded w-96 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-600 h-32 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-white mb-4">
            GDVL Elite Collection
          </h3>
          <p className="text-lg text-gray-300">
            Discover the highest-rated dramas and movies curated by our global community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {contents?.slice(0, 6).map((content, index) => (
            <div key={content.id} className="flex bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-700">
              <div className="w-4 bg-gradient-to-b from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg transform -rotate-90 whitespace-nowrap">
                  #{index + 1}
                </span>
              </div>
              <Link href={`/content/${content.id}`}>
                <div className="flex flex-1">
                  <div className="w-32 flex-shrink-0 relative">
                    <img 
                      src={content.imageUrl} 
                      alt={content.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg line-clamp-1 text-white group-hover:text-purple-400 transition-colors">{content.title}</h4>
                      <div className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded text-sm font-bold ml-2">
                        <span>{content.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm mb-2 font-medium">
                      ({content.year}) • {content.genre.slice(0, 2).join(", ")}
                    </p>
                    <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">{content.description}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/browse?filter=top-rated">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Explore Elite Collection
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
