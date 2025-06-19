import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to browse page with search query
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-black sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center space-x-2 cursor-pointer group">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-lg font-black text-sm">
                    GDVL
                  </div>
                  <h1 className="text-xl font-bold text-white">
                    GlobalDramaVerseList
                  </h1>
                </div>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="/">
                <span className={`font-medium transition-all duration-300 cursor-pointer ${
                  location === "/" 
                    ? "text-yellow-400" 
                    : "text-gray-300 hover:text-white"
                }`}>
                  Home
                </span>
              </Link>
              <Link href="/browse">
                <span className={`font-medium transition-all duration-300 cursor-pointer ${
                  location === "/browse" 
                    ? "text-yellow-400" 
                    : "text-gray-300 hover:text-white"
                }`}>
                  Browse
                </span>
              </Link>
              <Link href="/browse?filter=top-rated">
                <span className="text-gray-300 hover:text-white transition-all duration-300 font-medium cursor-pointer">
                  Premium Selection
                </span>
              </Link>
              <Link href="/browse?filter=new-releases">
                <span className="text-gray-300 hover:text-white transition-all duration-300 font-medium cursor-pointer">
                  New Releases
                </span>
              </Link>
              <Link href="/admin">
                <span className="text-gray-300 hover:text-purple-400 transition-all duration-300 font-medium cursor-pointer">
                  Admin
                </span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search dramas, movies, series..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-white text-black border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </form>
            <button className="md:hidden p-2 text-gray-300 hover:text-white transition-all duration-300">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
