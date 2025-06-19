import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-simple";
import { z } from "zod";
import { insertContentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get featured contents - must come before the :id route
  app.get("/api/contents/featured", async (req, res) => {
    try {
      const contents = await storage.getFeaturedContents();
      res.json(contents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured contents" });
    }
  });

  // Get top rated contents - must come before the :id route
  app.get("/api/contents/top-rated", async (req, res) => {
    try {
      const contents = await storage.getTopRatedContents();
      res.json(contents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch top rated contents" });
    }
  });

  // Get all contents
  app.get("/api/contents", async (req, res) => {
    try {
      const contents = await storage.getAllContents();
      res.json(contents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contents" });
    }
  });

  // Get content by ID - must come after specific routes
  app.get("/api/contents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid content ID" });
      }
      
      const content = await storage.getContentById(id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // Search contents
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const contents = await storage.searchContents(q);
      res.json(contents);
    } catch (error) {
      res.status(500).json({ message: "Failed to search contents" });
    }
  });

  // Filter contents
  app.post("/api/contents/filter", async (req, res) => {
    try {
      const filterSchema = z.object({
        genres: z.array(z.string()).optional(),
        countries: z.array(z.string()).optional(),
        yearFrom: z.number().optional(),
        yearTo: z.number().optional(),
        minRating: z.number().optional(),
      });

      const filters = filterSchema.parse(req.body);
      const contents = await storage.filterContents(filters);
      res.json(contents);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid filter parameters" });
      }
      res.status(500).json({ message: "Failed to filter contents" });
    }
  });

  // Admin routes for content management
  app.get("/api/admin/contents", async (req, res) => {
    try {
      const contents = await storage.getAllContents();
      res.json(contents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch contents" });
    }
  });

  app.post("/api/admin/contents", async (req, res) => {
    try {
      const validatedData = insertContentSchema.parse(req.body);
      const content = await storage.createContent(validatedData);
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create content" });
    }
  });

  app.put("/api/admin/contents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertContentSchema.partial().parse(req.body);
      const content = await storage.updateContent(id, validatedData);
      
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update content" });
    }
  });

  app.delete("/api/admin/contents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContent(id);
      
      if (!success) {
        return res.status(404).json({ error: "Content not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
