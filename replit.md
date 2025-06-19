# replit.md

## Overview

GlobalDramaVerseList is a full-stack web application for discovering and browsing Indian and global dramas, movies, and series. The application provides a Netflix-like interface where users can explore content by various filters, view ratings, and discover new entertainment from around the world.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **Database**: PostgreSQL 16 with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot module reloading with Vite integration

### Monorepo Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript types and database schema

## Key Components

### Database Schema (Drizzle ORM)
- **Contents Table**: Stores drama/movie information including title, description, genres, year, country, rating, image URL, and type
- **Users Table**: Basic user authentication with username and password
- **Schema Validation**: Zod schemas for type-safe data validation

### API Endpoints
- `GET /api/contents` - Retrieve all content
- `GET /api/contents/:id` - Get specific content by ID
- `GET /api/contents/featured` - Get featured content
- `GET /api/contents/top-rated` - Get highest-rated content
- Search and filtering capabilities built into the storage layer

### UI Components
- **Header**: Navigation with search functionality
- **Hero Section**: Landing page with call-to-action buttons
- **Content Cards**: Reusable components for displaying content in grid and horizontal layouts
- **Browse Section**: Advanced filtering by genre, country, rating, and year
- **Detail Pages**: Individual content information display

### Storage Layer
- **IStorage Interface**: Defines contract for data operations
- **MemStorage Implementation**: In-memory storage with sample data for development
- Designed to be easily replaceable with database-backed storage

## Data Flow

1. **Client Requests**: React components use TanStack Query to fetch data
2. **API Layer**: Express routes handle HTTP requests and validate parameters
3. **Storage Layer**: Abstract storage interface allows for flexible data persistence
4. **Response**: JSON data returned to client with proper error handling
5. **UI Updates**: React Query manages caching and UI state updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm & drizzle-kit**: Type-safe database operations and migrations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router

### Development Tools
- **TypeScript**: Type safety across the entire application
- **Vite**: Fast development server and build tool
- **ESBuild**: Fast JavaScript bundler for production
- **TSX**: TypeScript execution for development server

## Deployment Strategy

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Development**: `npm run dev` starts both frontend and backend
- **Production Build**: `npm run build` compiles both client and server
- **Production Start**: `npm run start` runs the production server
- **Port Configuration**: Internal port 5000, external port 80

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: ESBuild bundles server code to `dist/index.js`
3. **Static Serving**: Production server serves built frontend assets
4. **Database**: Drizzle migrations ensure schema consistency

### Environment Requirements
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment setting (development/production)

## Changelog

```
Changelog:
- June 19, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```