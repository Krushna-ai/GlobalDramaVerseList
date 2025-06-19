import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Content } from "@shared/schema";

export default function Detail() {
  const { id } = useParams();
  
  const { data: content, isLoading, error } = useQuery<Content>({
    queryKey: ["/api/contents", id],
    queryFn: async () => {
      const response = await fetch(`/api/contents/${id}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Content not found");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading content...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Content Not Found</h1>
            <p className="text-slate-600">The content you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="relative">
        {/* Hero background */}
        <div className="relative h-96 overflow-hidden">
          <img 
            src={content.imageUrl} 
            alt={content.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>
        
        {/* Content overlay */}
        <div className="relative -mt-32 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Poster */}
              <div className="flex-shrink-0 lg:w-80">
                <img 
                  src={content.imageUrl} 
                  alt={content.title}
                  className="w-full max-w-sm mx-auto lg:max-w-none rounded-lg shadow-2xl"
                />
              </div>
              
              {/* Details */}
              <div className="flex-1 pt-8">
                <div className="mb-6">
                  <h1 className="text-4xl lg:text-5xl font-bold mb-2">{content.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-300 mb-4">
                    <span>{content.year}</span>
                    <span>•</span>
                    <span className="capitalize">{content.type}</span>
                    <span>•</span>
                    <span>{content.country}</span>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="bg-yellow-500 text-black px-3 py-2 rounded font-bold text-lg">
                      <Star className="w-5 h-5 inline mr-1 fill-current" />
                      {content.rating}
                    </div>
                    <div className="text-gray-300">
                      <div className="text-sm">IMDb RATING</div>
                      <div className="text-xs text-gray-400">⭐ {content.rating}/10</div>
                    </div>
                  </div>
                </div>
                
                {/* Genres */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {content.genre.map((genre) => (
                      <span key={genre} className="bg-gray-700 text-gray-200 px-3 py-1 rounded-full text-sm hover:bg-gray-600 transition-colors cursor-pointer">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
                
                {/* Plot */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 text-white">Plot</h2>
                  <p className="text-gray-300 text-lg leading-relaxed">{content.description}</p>
                </div>
                
                {/* MDL-style additional info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900 rounded-lg p-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-yellow-400">Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Title:</span>
                        <span className="text-white font-medium">{content.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Year:</span>
                        <span className="text-white">{content.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Country:</span>
                        <span className="text-white">{content.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white capitalize">{content.type}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-yellow-400">Ratings & Reviews</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">IMDb Rating:</span>
                        <span className="text-white font-bold">{content.rating}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Genre:</span>
                        <span className="text-white">{content.genre.join(", ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <span className="text-green-400">Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
