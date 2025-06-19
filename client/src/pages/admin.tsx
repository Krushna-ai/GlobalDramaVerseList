import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Content, InsertContent } from "@shared/schema";

interface ContentFormData extends Omit<InsertContent, 'genre' | 'director' | 'writer' | 'cast' | 'tags' | 'awards' | 'trivia' | 'quotes' | 'soundtrack'> {
  genre: string;
  director: string;
  writer: string;
  cast: string;
  tags: string;
  awards: string;
  trivia: string;
  quotes: string;
  soundtrack: string;
}

const defaultFormData: ContentFormData = {
  title: "",
  originalTitle: "",
  description: "",
  synopsis: "",
  genre: "",
  year: "",
  country: "",
  rating: "0.0",
  imageUrl: "",
  posterUrl: "",
  backgroundUrl: "",
  trailerUrl: "",
  type: "drama",
  status: "completed",
  episodes: "",
  duration: "",
  language: "",
  director: "",
  writer: "",
  cast: "",
  network: "",
  aired: "",
  tags: "",
  contentRating: "",
  budget: "",
  revenue: "",
  awards: "",
  trivia: "",
  quotes: "",
  soundtrack: "",
  createdBy: "admin"
};

export default function Admin() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [formData, setFormData] = useState<ContentFormData>(defaultFormData);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: contents, isLoading } = useQuery<Content[]>({
    queryKey: ["/api/admin/contents"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertContent) => {
      const response = await fetch("/api/admin/contents", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error('Failed to create');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contents"] });
      setIsFormOpen(false);
      setFormData(defaultFormData);
      toast({ title: "Success", description: "Content created successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create content", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertContent> }) => {
      const response = await fetch(`/api/admin/contents/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error('Failed to update');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contents"] });
      setEditingContent(null);
      setFormData(defaultFormData);
      toast({ title: "Success", description: "Content updated successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update content", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/contents/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error('Failed to delete');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/contents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/contents"] });
      toast({ title: "Success", description: "Content deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete content", variant: "destructive" });
    }
  });

  const handleInputChange = (field: keyof ContentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const processedData: InsertContent = {
      ...formData,
      genre: formData.genre.split(',').map(g => g.trim()).filter(g => g),
      director: formData.director.split(',').map(d => d.trim()).filter(d => d),
      writer: formData.writer.split(',').map(w => w.trim()).filter(w => w),
      cast: formData.cast.split(',').map(c => c.trim()).filter(c => c),
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      awards: formData.awards.split(',').map(a => a.trim()).filter(a => a),
      trivia: formData.trivia.split('\n').map(t => t.trim()).filter(t => t),
      quotes: formData.quotes.split('\n').map(q => q.trim()).filter(q => q),
      soundtrack: formData.soundtrack.split(',').map(s => s.trim()).filter(s => s),
      originalTitle: formData.originalTitle || null,
      posterUrl: formData.posterUrl || null,
      backgroundUrl: formData.backgroundUrl || null,
      trailerUrl: formData.trailerUrl || null,
      synopsis: formData.synopsis || null,
      episodes: formData.episodes || null,
      network: formData.network || null,
      aired: formData.aired || null,
      contentRating: formData.contentRating || null,
      budget: formData.budget || null,
      revenue: formData.revenue || null,
    };

    if (editingContent) {
      updateMutation.mutate({ id: editingContent.id, data: processedData });
    } else {
      createMutation.mutate(processedData);
    }
  };

  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setFormData({
      ...content,
      originalTitle: content.originalTitle || "",
      posterUrl: content.posterUrl || "",
      backgroundUrl: content.backgroundUrl || "",
      trailerUrl: content.trailerUrl || "",
      synopsis: content.synopsis || "",
      episodes: content.episodes || "",
      network: content.network || "",
      aired: content.aired || "",
      contentRating: content.contentRating || "",
      budget: content.budget || "",
      revenue: content.revenue || "",
      genre: content.genre.join(', '),
      director: content.director?.join(', ') || "",
      writer: content.writer?.join(', ') || "",
      cast: content.cast?.join(', ') || "",
      tags: content.tags?.join(', ') || "",
      awards: content.awards?.join(', ') || "",
      trivia: content.trivia?.join('\n') || "",
      quotes: content.quotes?.join('\n') || "",
      soundtrack: content.soundtrack?.join(', ') || "",
    });
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingContent(null);
    setFormData(defaultFormData);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Content Management</h1>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Content
          </Button>
        </div>

        {isFormOpen && (
          <Card className="mb-8 bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {editingContent ? "Edit Content" : "Add New Content"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                    <TabsTrigger value="basic" className="text-white">Basic Info</TabsTrigger>
                    <TabsTrigger value="media" className="text-white">Media & Images</TabsTrigger>
                    <TabsTrigger value="details" className="text-white">Details</TabsTrigger>
                    <TabsTrigger value="extended" className="text-white">Extended Info</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title" className="text-white">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="originalTitle" className="text-white">Original Title</Label>
                        <Input
                          id="originalTitle"
                          value={formData.originalTitle || ""}
                          onChange={(e) => handleInputChange('originalTitle', e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type" className="text-white">Type *</Label>
                        <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="drama" className="text-white">Drama</SelectItem>
                            <SelectItem value="movie" className="text-white">Movie</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status" className="text-white">Status</Label>
                        <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                          <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700">
                            <SelectItem value="completed" className="text-white">Completed</SelectItem>
                            <SelectItem value="ongoing" className="text-white">Ongoing</SelectItem>
                            <SelectItem value="upcoming" className="text-white">Upcoming</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="year" className="text-white">Year *</Label>
                        <Input
                          id="year"
                          value={formData.year}
                          onChange={(e) => handleInputChange('year', e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-white">Country *</Label>
                        <Input
                          id="country"
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="language" className="text-white">Language *</Label>
                        <Input
                          id="language"
                          value={formData.language}
                          onChange={(e) => handleInputChange('language', e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating" className="text-white">Rating (0-10) *</Label>
                        <Input
                          id="rating"
                          type="number"
                          step="0.1"
                          min="0"
                          max="10"
                          value={formData.rating}
                          onChange={(e) => handleInputChange('rating', e.target.value)}
                          required
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="genre" className="text-white">Genres (comma-separated) *</Label>
                      <Input
                        id="genre"
                        value={formData.genre}
                        onChange={(e) => handleInputChange('genre', e.target.value)}
                        placeholder="Drama, Romance, Comedy"
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-white">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4">
                    <div>
                      <Label htmlFor="imageUrl" className="text-white">Main Image URL *</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                        required
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="posterUrl" className="text-white">Poster URL</Label>
                      <Input
                        id="posterUrl"
                        value={formData.posterUrl || ""}
                        onChange={(e) => handleInputChange('posterUrl', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="backgroundUrl" className="text-white">Background URL</Label>
                      <Input
                        id="backgroundUrl"
                        value={formData.backgroundUrl || ""}
                        onChange={(e) => handleInputChange('backgroundUrl', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="trailerUrl" className="text-white">Trailer URL</Label>
                      <Input
                        id="trailerUrl"
                        value={formData.trailerUrl || ""}
                        onChange={(e) => handleInputChange('trailerUrl', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="episodes" className="text-white">Episodes/Runtime</Label>
                        <Input
                          id="episodes"
                          value={formData.episodes || ""}
                          onChange={(e) => handleInputChange('episodes', e.target.value)}
                          placeholder="12 episodes or 120 minutes"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="duration" className="text-white">Episode Duration</Label>
                        <Input
                          id="duration"
                          value={formData.duration || ""}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          placeholder="60 minutes"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="network" className="text-white">Network/Platform</Label>
                        <Input
                          id="network"
                          value={formData.network || ""}
                          onChange={(e) => handleInputChange('network', e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="aired" className="text-white">Aired Date</Label>
                        <Input
                          id="aired"
                          value={formData.aired || ""}
                          onChange={(e) => handleInputChange('aired', e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="contentRating" className="text-white">Content Rating</Label>
                        <Input
                          id="contentRating"
                          value={formData.contentRating || ""}
                          onChange={(e) => handleInputChange('contentRating', e.target.value)}
                          placeholder="PG-13, R, TV-MA"
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="director" className="text-white">Directors (comma-separated)</Label>
                      <Input
                        id="director"
                        value={formData.director}
                        onChange={(e) => handleInputChange('director', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="writer" className="text-white">Writers (comma-separated)</Label>
                      <Input
                        id="writer"
                        value={formData.writer}
                        onChange={(e) => handleInputChange('writer', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cast" className="text-white">Cast (comma-separated)</Label>
                      <Textarea
                        id="cast"
                        value={formData.cast}
                        onChange={(e) => handleInputChange('cast', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="extended" className="space-y-4">
                    <div>
                      <Label htmlFor="synopsis" className="text-white">Extended Synopsis</Label>
                      <Textarea
                        id="synopsis"
                        value={formData.synopsis || ""}
                        onChange={(e) => handleInputChange('synopsis', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white h-32"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags" className="text-white">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="awards" className="text-white">Awards (comma-separated)</Label>
                      <Input
                        id="awards"
                        value={formData.awards}
                        onChange={(e) => handleInputChange('awards', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budget" className="text-white">Budget</Label>
                        <Input
                          id="budget"
                          value={formData.budget || ""}
                          onChange={(e) => handleInputChange('budget', e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="revenue" className="text-white">Revenue</Label>
                        <Input
                          id="revenue"
                          value={formData.revenue || ""}
                          onChange={(e) => handleInputChange('revenue', e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="trivia" className="text-white">Trivia (one per line)</Label>
                      <Textarea
                        id="trivia"
                        value={formData.trivia}
                        onChange={(e) => handleInputChange('trivia', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="quotes" className="text-white">Memorable Quotes (one per line)</Label>
                      <Textarea
                        id="quotes"
                        value={formData.quotes}
                        onChange={(e) => handleInputChange('quotes', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="soundtrack" className="text-white">Soundtrack (comma-separated)</Label>
                      <Input
                        id="soundtrack"
                        value={formData.soundtrack}
                        onChange={(e) => handleInputChange('soundtrack', e.target.value)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-4">
                  <Button type="button" onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingContent ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                <div className="h-40 bg-gray-700 rounded mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))
          ) : (
            contents?.map((content) => (
              <Card key={content.id} className="bg-gray-900 border-gray-700">
                <CardContent className="p-4">
                  <img
                    src={content.imageUrl}
                    alt={content.title}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                  <h3 className="text-white font-semibold mb-2">{content.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{content.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{content.year} • {content.country}</span>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(content)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => deleteMutation.mutate(content.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}