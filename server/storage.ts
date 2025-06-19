import { contents, type Content, type InsertContent } from "@shared/schema";

export interface IStorage {
  // Content methods
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
    const sampleContents: Omit<Content, 'id'>[] = [
      {
        title: "Scam 1992: The Harshad Mehta Story",
        originalTitle: "स्कैम 1992",
        description: "Based on the real story of stockbroker Harshad Mehta and India's 1992 financial scam.",
        synopsis: "The series chronicles the life and crimes of Harshad Mehta, a stockbroker who single-handedly took the stock market to dizzying heights and his catastrophic downfall. No one had seen wealth and its excesses in the Bombay of the 1980s and 1990s.",
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
        title: "Sacred Games",
        description: "A Netflix original series that follows a troubled police officer and a criminal mastermind in Mumbai.",
        genre: ["Crime", "Thriller"],
        year: "2018-2019",
        country: "India",
        rating: "8.7",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        type: "drama"
      },
      {
        title: "Squid Game",
        description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games.",
        genre: ["Thriller", "Horror"],
        year: "2021",
        country: "South Korea",
        rating: "8.0",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        type: "drama"
      },
      {
        title: "Money Heist (La Casa de Papel)",
        description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history.",
        genre: ["Crime", "Drama"],
        year: "2017-2021",
        country: "Spain",
        rating: "8.3",
        imageUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        type: "drama"
      },
      {
        title: "3 Idiots",
        description: "Two friends searching for their long lost companion. They revisit their college days.",
        genre: ["Comedy", "Drama"],
        year: "2009",
        country: "India",
        rating: "8.4",
        imageUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        type: "movie"
      },
      {
        title: "Your Name (Kimi no Na wa)",
        description: "Two teenagers share a profound, magical connection upon discovering they are swapping bodies.",
        genre: ["Animation", "Romance"],
        year: "2016",
        country: "Japan",
        rating: "8.2",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        type: "movie"
      },
      {
        title: "Breaking Bad",
        description: "A chemistry teacher turned methamphetamine manufacturer partners with a former student.",
        genre: ["Crime", "Drama"],
        year: "2008-2013",
        country: "USA",
        rating: "9.5",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        type: "drama"
      },
      {
        title: "2gether: The Series",
        description: "A student asks a popular guy to pretend to be his boyfriend to ward off unwanted attention.",
        genre: ["Romance", "Youth"],
        year: "2020",
        country: "Thailand",
        rating: "7.8",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        type: "drama"
      },
      {
        title: "The Crown",
        description: "Follows the political rivalries and romance of Queen Elizabeth II's reign.",
        genre: ["Biography", "Drama"],
        year: "2016-2023",
        country: "UK",
        rating: "8.6",
        imageUrl: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        type: "drama"
      },
      {
        title: "Meteor Garden",
        description: "An ordinary girl gets accepted into an elite school where she encounters the F4.",
        genre: ["Romance", "Youth"],
        year: "2018",
        country: "China",
        rating: "7.2",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        type: "drama"
      },
      {
        title: "Mumbai Diaries 26/11",
        description: "Medical drama series based on the 2008 Mumbai attacks.",
        genre: ["Medical", "Drama"],
        year: "2021",
        country: "India",
        rating: "8.9",
        imageUrl: "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        type: "drama"
      },
      {
        title: "Parasite",
        description: "A poor family schemes to become employed by a wealthy family.",
        genre: ["Thriller"],
        year: "2019",
        country: "South Korea",
        rating: "8.5",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600",
        type: "movie"
      }
    ];

    sampleContents.forEach(content => {
      const id = this.currentId++;
      this.contents.set(id, { ...content, id });
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
    return allContents.slice(0, 4);
  }

  async getTopRatedContents(): Promise<Content[]> {
    const allContents = Array.from(this.contents.values());
    return allContents
      .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
      .slice(0, 6);
  }

  async searchContents(query: string): Promise<Content[]> {
    const allContents = Array.from(this.contents.values());
    const lowercaseQuery = query.toLowerCase();
    return allContents.filter(content =>
      content.title.toLowerCase().includes(lowercaseQuery) ||
      content.description.toLowerCase().includes(lowercaseQuery) ||
      content.genre.some(g => g.toLowerCase().includes(lowercaseQuery))
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
        content.genre.some(g => filters.genres!.includes(g))
      );
    }

    if (filters.countries && filters.countries.length > 0) {
      allContents = allContents.filter(content =>
        filters.countries!.includes(content.country)
      );
    }

    if (filters.minRating) {
      allContents = allContents.filter(content =>
        parseFloat(content.rating) >= filters.minRating!
      );
    }

    if (filters.yearFrom || filters.yearTo) {
      allContents = allContents.filter(content => {
        const year = parseInt(content.year);
        const yearFrom = filters.yearFrom || 1900;
        const yearTo = filters.yearTo || 2030;
        return year >= yearFrom && year <= yearTo;
      });
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
