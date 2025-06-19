import { pgTable, text, serial, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contents = pgTable("contents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  originalTitle: text("original_title"),
  description: text("description").notNull(),
  genre: text("genre").array().notNull(),
  year: text("year").notNull(),
  country: text("country").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull(),
  imageUrl: text("image_url").notNull(),
  posterUrl: text("poster_url"),
  backgroundUrl: text("background_url"),
  trailerUrl: text("trailer_url"),
  type: text("type").notNull(), // "drama" or "movie"
  status: text("status").notNull().default("completed"), // "ongoing", "completed", "upcoming"
  episodes: text("episodes"),
  duration: text("duration"), // runtime for movies, episode duration for dramas
  language: text("language").notNull(),
  director: text("director").array(),
  writer: text("writer").array(),
  cast: text("cast").array(),
  network: text("network"),
  aired: text("aired"), // airing dates
  tags: text("tags").array(),
  contentRating: text("content_rating"), // PG, R, etc.
  budget: text("budget"),
  revenue: text("revenue"),
  awards: text("awards").array(),
  synopsis: text("synopsis"), // longer plot summary
  trivia: text("trivia").array(),
  quotes: text("quotes").array(),
  soundtrack: text("soundtrack").array(),
  createdAt: text("created_at").default("now()"),
  updatedAt: text("updated_at").default("now()"),
  createdBy: text("created_by"),
});

export const insertContentSchema = createInsertSchema(contents).omit({
  id: true,
});

export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof contents.$inferSelect;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
