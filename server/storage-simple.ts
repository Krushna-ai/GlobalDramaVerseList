import { contents, type Content, type InsertContent } from "@shared/schema";

export interface IStorage {
  getAllContents(): Promise<Content[]>;
  getContentById(id: number): Promise<Content | undefined>;
  getFeaturedContents(): Promise<Content[]>;
  getTopRatedContents(): Promise<Content[]>;
  searchContents(query: string): Promise<Content[]>;
  filterContents(filters: {
    genres?: string[];
    countries?: string[];
    yearFrom?: number;
    yearTo?: number;
    minRating?: number;
  }): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: number, content: Partial<InsertContent>): Promise<Content | undefined>;
  deleteContent(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private contents: Map<number, Content>;
  private currentId: number;

  constructor() {
    this.contents = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    const sampleContents: Content[] = [
      {
        id: 1,
        title: "Scam 1992: The Harshad Mehta Story",
        originalTitle: "स्कैम 1992",
        description: "Based on the real story of stockbroker Harshad Mehta and India's 1992 financial scam.",
        synopsis: "The series chronicles the life and crimes of Harshad Mehta, a stockbroker who single-handedly took the stock market to dizzying heights and his catastrophic downfall.",
        genre: ["Biographical", "Crime", "Drama"],
        year: "2020",
        country: "India",
        rating: "9.2",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        posterUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=450",
        backgroundUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=675",
        trailerUrl: null,
        type: "drama",
        status: "completed",
        episodes: "10",
        duration: "50 minutes",
        language: "Hindi",
        director: ["Hansal Mehta"],
        writer: ["Sucheta Dalal", "Debashish Irengbam"],
        cast: ["Pratik Gandhi", "Shreya Dhanwanthary", "Hemant Kher"],
        network: "SonyLIV",
        aired: "October 9, 2020",
        tags: ["Financial Crime", "Biography", "Indian"],
        contentRating: "TV-MA",
        budget: null,
        revenue: null,
        awards: ["Filmfare OTT Awards"],
        trivia: ["Based on the book by Sucheta Dalal and Debashish Irengbam"],
        quotes: [],
        soundtrack: [],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        createdBy: "admin"
      },
      {
        id: 2,
        title: "Kingdom",
        originalTitle: "킹덤",
        description: "A kingdom must unite to survive the plague of the undead.",
        synopsis: "Set in Korea's Joseon period, a crown prince is sent on a mission to investigate a mysterious outbreak in his country.",
        genre: ["Horror", "Thriller", "Historical"],
        year: "2019",
        country: "South Korea",
        rating: "8.3",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        posterUrl: null,
        backgroundUrl: null,
        trailerUrl: null,
        type: "drama",
        status: "completed",
        episodes: "12",
        duration: "45 minutes",
        language: "Korean",
        director: ["Kim Seong-hun"],
        writer: ["Kim Eun-hee"],
        cast: ["Ju Ji-hoon", "Bae Doona", "Ryu Seung-ryong"],
        network: "Netflix",
        aired: "January 25, 2019",
        tags: ["Zombie", "Historical", "Korean"],
        contentRating: "TV-MA",
        budget: null,
        revenue: null,
        awards: ["Baeksang Arts Awards"],
        trivia: ["First Korean zombie series"],
        quotes: [],
        soundtrack: [],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
        createdBy: "admin"
      }
    ];

    sampleContents.forEach(content => {
      this.contents.set(content.id, content);
      this.currentId = Math.max(this.currentId, content.id + 1);
    });
  }

  async getAllContents(): Promise<Content[]> {
    return Array.from(this.contents.values());
  }

  async getContentById(id: number): Promise<Content | undefined> {
    return this.contents.get(id);
  }

  async getFeaturedContents(): Promise<Content[]> {
    const allContents = Array.from(this.contents.values());
    return allContents.filter(content => parseFloat(content.rating) >= 8.0).slice(0, 6);
  }

  async getTopRatedContents(): Promise<Content[]> {
    const allContents = Array.from(this.contents.values());
    return allContents
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 10);
  }

  async searchContents(query: string): Promise<Content[]> {
    const allContents = Array.from(this.contents.values());
    const lowerQuery = query.toLowerCase();
    
    return allContents.filter(content =>
      content.title.toLowerCase().includes(lowerQuery) ||
      content.description.toLowerCase().includes(lowerQuery) ||
      content.genre.some(g => g.toLowerCase().includes(lowerQuery)) ||
      content.country.toLowerCase().includes(lowerQuery)
    );
  }

  async filterContents(filters: {
    genres?: string[];
    countries?: string[];
    yearFrom?: number;
    yearTo?: number;
    minRating?: number;
  }): Promise<Content[]> {
    let allContents = Array.from(this.contents.values());

    if (filters.genres && filters.genres.length > 0) {
      allContents = allContents.filter(content =>
        filters.genres!.some(genre =>
          content.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
        )
      );
    }

    if (filters.countries && filters.countries.length > 0) {
      allContents = allContents.filter(content =>
        filters.countries!.some(country =>
          content.country.toLowerCase().includes(country.toLowerCase())
        )
      );
    }

    if (filters.yearFrom) {
      allContents = allContents.filter(content =>
        parseInt(content.year) >= filters.yearFrom!
      );
    }

    if (filters.yearTo) {
      allContents = allContents.filter(content =>
        parseInt(content.year) <= filters.yearTo!
      );
    }

    if (filters.minRating) {
      allContents = allContents.filter(content =>
        parseFloat(content.rating) >= filters.minRating!
      );
    }

    return allContents;
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = this.currentId++;
    const content: Content = {
      ...insertContent,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.contents.set(id, content);
    return content;
  }

  async updateContent(id: number, updateData: Partial<InsertContent>): Promise<Content | undefined> {
    const existingContent = this.contents.get(id);
    if (!existingContent) return undefined;

    const updatedContent: Content = {
      ...existingContent,
      ...updateData,
      id,
      updatedAt: new Date().toISOString()
    };
    
    this.contents.set(id, updatedContent);
    return updatedContent;
  }

  async deleteContent(id: number): Promise<boolean> {
    return this.contents.delete(id);
  }
}

export const storage = new MemStorage();