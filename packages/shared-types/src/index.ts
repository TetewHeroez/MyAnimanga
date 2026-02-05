// Anime Types
export interface Anime {
  id: string;
  title: string;
  japaneseTitle?: string;
  synopsis: string;
  genres: string[];
  status: "ongoing" | "completed" | "upcoming";
  rating: number;
  episodes: number;
  season: "Winter" | "Spring" | "Summer" | "Fall";
  year: number;
  studio: string;
  posterImage: string;
  bannerImage?: string;
  isTrending?: boolean;
  isSpotlight?: boolean;
  isFeatured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  createdAt: Date;
}

// User Anime List Types
export interface UserAnimeEntry {
  userId: string;
  animeId: string;
  status: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch";
  score?: number;
  episodesWatched: number;
  notes?: string;
  startDate?: Date;
  finishDate?: Date;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Genre Types
export type Genre =
  | "Action"
  | "Adventure"
  | "Comedy"
  | "Drama"
  | "Fantasy"
  | "Horror"
  | "Mystery"
  | "Romance"
  | "Sci-Fi"
  | "Slice of Life"
  | "Sports"
  | "Supernatural"
  | "Thriller";
