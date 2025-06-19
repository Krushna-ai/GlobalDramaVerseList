import { Link } from "wouter";
import { Star, Bookmark, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Content } from "@shared/schema";

interface ContentCardProps {
  content: Content;
  variant?: "default" | "horizontal" | "imdb";
}

export default function ContentCard({ content, variant = "default" }: ContentCardProps) {
  if (variant === "horizontal") {
    return (
      <Link href={`/content/${content.id}`}>
        <div className="flex bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group border border-gray-200">
          <div className="w-32 flex-shrink-0 relative">
            <img 
              src={content.imageUrl} 
              alt={content.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-lg line-clamp-1 text-gray-900 group-hover:text-blue-600 transition-colors">{content.title}</h4>
              <div className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded text-sm font-bold ml-2">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {content.rating}
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-2 font-medium">
              ({content.year}) • {content.genre.slice(0, 2).join(", ")}
            </p>
            <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">{content.description}</p>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "imdb") {
    return (
      <Link href={`/content/${content.id}`}>
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-200 transform hover:-translate-y-1">
          <div className="relative">
            <div className="aspect-[2/3] relative overflow-hidden">
              <img 
                src={content.imageUrl} 
                alt={content.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Bookmark className="w-6 h-6 text-white hover:text-yellow-400 cursor-pointer" />
              </div>
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center justify-center">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-all duration-300 shadow-xl">
                    <Play className="w-4 h-4 fill-current" />
                    <span className="font-semibold">Explore</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-3 left-3">
              <div className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-lg font-bold text-sm shadow-lg">
                <Star className="w-3 h-3 mr-1 fill-current" />
                {content.rating}
              </div>
            </div>
          </div>
          <div className="p-4">
            <h4 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-1 text-gray-900">
              {content.title}
            </h4>
            <p className="text-gray-600 text-sm mb-2 font-medium">({content.year})</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {content.genre.slice(0, 2).map((genre) => (
                <span key={genre} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {genre}
                </span>
              ))}
            </div>
            <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">{content.description}</p>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/content/${content.id}`}>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group cursor-pointer">
        <div className="aspect-[3/4] relative overflow-hidden">
          <img 
            src={content.imageUrl} 
            alt={content.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <div className="flex items-center bg-emerald-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
              <Star className="w-3 h-3 mr-1 fill-current" />
              {content.rating}
            </div>
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {content.title}
          </h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {content.genre.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>
          <p className="text-slate-600 text-sm mb-2">{content.year} • {content.country}</p>
          <p className="text-slate-600 text-sm line-clamp-3">{content.description}</p>
        </div>
      </div>
    </Link>
  );
}
