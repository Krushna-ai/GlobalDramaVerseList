import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ContentCard from "./content-card";
import type { Content } from "@shared/schema";

const genres = ["Action", "Drama", "Crime", "Romance", "Comedy", "Thriller", "Biography", "Animation"];
const countries = ["India", "South Korea", "Japan", "United States", "Spain", "UK", "Thailand", "China"];
const ratings = [
  { label: "All Ratings", value: 0 },
  { label: "8.0+ (Excellent)", value: 8.0 },
  { label: "7.0+ (Good)", value: 7.0 },
  { label: "6.0+ (Average)", value: 6.0 },
];

export default function BrowseSection() {
  const [location] = useLocation();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [yearFrom, setYearFrom] = useState<string>("");
  const [yearTo, setYearTo] = useState<string>("");
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract search query from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    if (search) {
      setSearchQuery(search);
    }
  }, [location]);

  const { data: contents, isLoading, refetch } = useQuery<Content[]>({
    queryKey: ["/api/contents"],
    select: (data) => {
      let filtered = data || [];

      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(content =>
          content.title.toLowerCase().includes(query) ||
          content.description.toLowerCase().includes(query) ||
          content.genre.some(g => g.toLowerCase().includes(query))
        );
      }

      // Apply genre filter
      if (selectedGenres.length > 0) {
        filtered = filtered.filter(content =>
          content.genre.some(g => selectedGenres.includes(g))
        );
      }

      // Apply country filter
      if (selectedCountry) {
        filtered = filtered.filter(content => content.country === selectedCountry);
      }

      // Apply rating filter
      if (minRating > 0) {
        filtered = filtered.filter(content => parseFloat(content.rating) >= minRating);
      }

      // Apply year filter
      if (yearFrom || yearTo) {
        filtered = filtered.filter(content => {
          const year = parseInt(content.year);
          const from = yearFrom ? parseInt(yearFrom) : 1900;
          const to = yearTo ? parseInt(yearTo) : 2030;
          return year >= from && year <= to;
        });
      }

      // Apply sorting
      switch (sortBy) {
        case "highest-rated":
          filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
          break;
        case "newest":
          filtered.sort((a, b) => parseInt(b.year) - parseInt(a.year));
          break;
        case "oldest":
          filtered.sort((a, b) => parseInt(a.year) - parseInt(b.year));
          break;
        default:
          // Most popular - keep original order
          break;
      }

      return filtered;
    },
  });

  const handleGenreChange = (genre: string, checked: boolean) => {
    if (checked) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    }
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedCountry("");
    setYearFrom("");
    setYearTo("");
    setMinRating(0);
    setSearchQuery("");
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-64 mb-8"></div>
            <div className="flex gap-8">
              <div className="w-1/4">
                <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="h-6 bg-gray-700 rounded mb-4"></div>
                  <div className="space-y-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-4 bg-gray-700 rounded"></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-3/4">
                <div className="grid grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="bg-gray-700 aspect-[2/3] rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 sticky top-24">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-lg text-white">Advanced Search</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-yellow-400 hover:text-yellow-300">
                  Clear All
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-3 block">
                    Genres
                  </Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {genres.map((genre) => (
                      <div key={genre} className="flex items-center space-x-2">
                        <Checkbox
                          id={genre}
                          checked={selectedGenres.includes(genre)}
                          onCheckedChange={(checked) => 
                            handleGenreChange(genre, checked as boolean)
                          }
                          className="border-gray-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500"
                        />
                        <Label
                          htmlFor={genre}
                          className="text-sm font-normal cursor-pointer text-gray-300 hover:text-white"
                        >
                          {genre}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">
                    Country/Region
                  </Label>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="All Countries" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="" className="text-white hover:bg-gray-700">All Countries</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country} className="text-white hover:bg-gray-700">
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">
                    Year Range
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="From"
                      value={yearFrom}
                      onChange={(e) => setYearFrom(e.target.value)}
                      className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    />
                    <Input
                      type="number"
                      placeholder="To"
                      value={yearTo}
                      onChange={(e) => setYearTo(e.target.value)}
                      className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-300 mb-2 block">
                    Minimum Rating
                  </Label>
                  <Select 
                    value={minRating.toString()} 
                    onValueChange={(value) => setMinRating(parseFloat(value))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {ratings.map((rating) => (
                        <SelectItem key={rating.value} value={rating.value.toString()} className="text-white hover:bg-gray-700">
                          {rating.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h3 className="text-2xl font-bold text-white">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Browse All Titles"}
              </h3>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">
                  Showing {contents?.length || 0} titles
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40 bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="popular" className="text-white hover:bg-gray-700">Most Popular</SelectItem>
                    <SelectItem value="highest-rated" className="text-white hover:bg-gray-700">Highest Rated</SelectItem>
                    <SelectItem value="newest" className="text-white hover:bg-gray-700">Newest First</SelectItem>
                    <SelectItem value="oldest" className="text-white hover:bg-gray-700">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {contents && contents.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {contents.map((content) => (
                  <ContentCard key={content.id} content={content} variant="imdb" />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h4 className="text-xl font-semibold text-white mb-2">
                  No titles found
                </h4>
                <p className="text-gray-400 mb-4">
                  Try adjusting your search filters
                </p>
                <Button onClick={clearFilters} className="bg-yellow-500 hover:bg-yellow-400 text-black">Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
