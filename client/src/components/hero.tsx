import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Play, Star, TrendingUp, Film } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Content } from "@shared/schema";

export default function Hero() {
  const { data: featured } = useQuery<Content[]>({
    queryKey: ["/api/contents/featured"],
  });

  const heroContent = featured?.[0];

  return (
    <section className="relative min-h-[80vh] bg-black text-white overflow-hidden">
      {/* Hero Background Image */}
      {heroContent && (
        <div className="absolute inset-0">
          <img 
            src={heroContent.imageUrl} 
            alt={heroContent.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>
      )}
      
      <div className="relative z-10 flex items-center min-h-[80vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            {heroContent ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-purple-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold text-lg">{heroContent.rating}</span>
                  <span className="text-gray-300">GDVL RATING</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black leading-tight">
                  {heroContent.title}
                </h1>
                
                <div className="flex items-center space-x-4 text-gray-300">
                  <span className="bg-gray-700 px-2 py-1 rounded text-sm font-medium">
                    {heroContent.type.toUpperCase()}
                  </span>
                  <span>{heroContent.year}</span>
                  <span>•</span>
                  <span>{heroContent.genre.slice(0, 2).join(", ")}</span>
                </div>
                
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl">
                  {heroContent.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href={`/content/${heroContent.id}`}>
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:scale-105 shadow-2xl"
                    >
                      <Play className="w-5 h-5 mr-3 fill-current" />
                      Explore Details
                    </Button>
                  </Link>
                  <Link href="/browse">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-2 border-white text-white hover:bg-white hover:text-black font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300"
                    >
                      <Film className="w-5 h-5 mr-3" />
                      Browse All
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">GlobalDramaVerseList</span>
                  <br />
                  <span className="text-white">Premium Entertainment Hub</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-200 leading-relaxed max-w-xl">
                  Discover ratings, reviews, and curated collections of the world's finest dramas, movies, and series.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/browse">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 hover:scale-105 shadow-2xl"
                    >
                      <TrendingUp className="w-5 h-5 mr-3" />
                      Start Exploring
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
    </section>
  );
}