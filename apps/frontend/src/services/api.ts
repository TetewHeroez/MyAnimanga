// Frontend API Service - fetches from backend
// Backend handles all Jikan API calls

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3003/api";
const API_BASE_URL = `${BASE_URL}/anime`;

export interface AnimeData {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string | null;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  episodes: number | null;
  status: string;
  rating: string | null;
  genres: { mal_id: number; name: string }[];
  year: number | null;
  season: string | null;
  aired: {
    from: string | null;
    to: string | null;
    prop: {
      from: { day: number | null; month: number | null; year: number | null };
      to: { day: number | null; month: number | null; year: number | null };
    };
  } | null;
}

interface ApiResponse<T> {
  data: T;
  total: number;
}

// Get top anime
export async function getTopAnime(limit: number = 20): Promise<AnimeData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/top?limit=${limit}`);
    const result: ApiResponse<AnimeData[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching top anime:", error);
    return [];
  }
}

// Get currently airing anime
export async function getAiringAnime(limit: number = 20): Promise<AnimeData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/airing?limit=${limit}`);
    const result: ApiResponse<AnimeData[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching airing anime:", error);
    return [];
  }
}

// Get upcoming anime
export async function getUpcomingAnime(
  limit: number = 12,
): Promise<AnimeData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/upcoming?limit=${limit}`);
    const result: ApiResponse<AnimeData[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching upcoming anime:", error);
    return [];
  }
}

// Get seasonal anime
export async function getSeasonalAnime(
  limit: number = 12,
): Promise<AnimeData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/seasonal?limit=${limit}`);
    const result: ApiResponse<AnimeData[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching seasonal anime:", error);
    return [];
  }
}

// Search anime
export async function searchAnime(
  query: string,
  limit: number = 10,
): Promise<AnimeData[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
    const result: ApiResponse<AnimeData[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error searching anime:", error);
    return [];
  }
}

// Get anime by ID
export async function getAnimeById(id: number): Promise<AnimeData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Error fetching anime by ID:", error);
    return null;
  }
}

// ============ MANGA API ============

const MANGA_API_URL = `${BASE_URL}/manga`;

export interface MangaData {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string | null;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  synopsis: string | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  chapters: number | null;
  volumes: number | null;
  status: string;
  genres: { mal_id: number; name: string }[];
}

// Get top manga
export async function getTopManga(limit: number = 12): Promise<MangaData[]> {
  try {
    const response = await fetch(`${MANGA_API_URL}/top?limit=${limit}`);
    const result: ApiResponse<MangaData[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching top manga:", error);
    return [];
  }
}

// Get latest manga
export async function getLatestManga(limit: number = 12): Promise<MangaData[]> {
  try {
    const response = await fetch(`${MANGA_API_URL}/latest?limit=${limit}`);
    const result: ApiResponse<MangaData[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching latest manga:", error);
    return [];
  }
}

// Search manga
export async function searchManga(
  query: string,
  limit: number = 10,
): Promise<MangaData[]> {
  try {
    const response = await fetch(
      `${MANGA_API_URL}/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
    const result: ApiResponse<MangaData[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error searching manga:", error);
    return [];
  }
}

// ============ LIGHT NOVEL API ============

// Get top light novels
export async function getTopLightNovels(
  limit: number = 12,
): Promise<MangaData[]> {
  try {
    const response = await fetch(
      `${MANGA_API_URL}/lightnovel/top?limit=${limit}`,
    );
    const result: ApiResponse<MangaData[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching top light novels:", error);
    return [];
  }
}

// Get latest light novels
export async function getLatestLightNovels(
  limit: number = 12,
): Promise<MangaData[]> {
  try {
    const response = await fetch(
      `${MANGA_API_URL}/lightnovel/latest?limit=${limit}`,
    );
    const result: ApiResponse<MangaData[]> = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching latest light novels:", error);
    return [];
  }
}

// ============ AUTH API ============

const AUTH_API_URL = `${BASE_URL}/auth`;
const LIST_API_URL = `${BASE_URL}/list`;

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

// Get token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

// Save auth data
export function saveAuthData(token: string, user: User): void {
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Clear auth data
export function clearAuthData(): void {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
}

// Get saved user
export function getSavedUser(): User | null {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

// Register
export async function register(
  email: string,
  username: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
}

// Login
export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Network error. Please try again." };
  }
}

// Verify token / get current user
export async function verifyToken(): Promise<AuthResponse> {
  const token = getAuthToken();
  if (!token) return { success: false, error: "No token" };

  try {
    const response = await fetch(`${AUTH_API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    console.error("Token verification error:", error);
    return { success: false, error: "Network error" };
  }
}

// ============ LIST/BOOKMARK API ============

export interface ListItem {
  id: string;
  userId: string;
  type: "anime" | "manga" | "lightnovel";
  malId: number;
  title: string;
  titleEnglish: string | null;
  imageUrl: string;
  status: string;
  score: number | null;
  progress: number;
  notes: string;
  addedAt: string;
  updatedAt: string;
}

interface ListResponse {
  success: boolean;
  data?: ListItem | ListItem[];
  total?: number;
  error?: string;
}

// Helper for auth headers
function authHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Get user's list
export async function getUserList(
  type?: "anime" | "manga" | "lightnovel",
  status?: string,
): Promise<ListItem[]> {
  const token = getAuthToken();
  if (!token) return [];

  try {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (status) params.set("status", status);

    const response = await fetch(`${LIST_API_URL}?${params.toString()}`, {
      headers: authHeaders(),
    });
    const result: ListResponse = await response.json();
    return (result.data as ListItem[]) || [];
  } catch (error) {
    console.error("Error fetching list:", error);
    return [];
  }
}

// Add to list
export async function addToList(item: {
  type: "anime" | "manga" | "lightnovel";
  malId: number;
  title: string;
  titleEnglish?: string;
  imageUrl: string;
  status?: string;
  score?: number;
  progress?: number;
}): Promise<ListItem | null> {
  try {
    const response = await fetch(LIST_API_URL, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(item),
    });
    const result: ListResponse = await response.json();
    return (result.data as ListItem) || null;
  } catch (error) {
    console.error("Error adding to list:", error);
    return null;
  }
}

// Update list item
export async function updateListItem(
  id: string,
  updates: {
    status?: string;
    score?: number;
    progress?: number;
    notes?: string;
  },
): Promise<ListItem | null> {
  try {
    const response = await fetch(`${LIST_API_URL}/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(updates),
    });
    const result: ListResponse = await response.json();
    return (result.data as ListItem) || null;
  } catch (error) {
    console.error("Error updating list item:", error);
    return null;
  }
}

// Remove from list
export async function removeFromList(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${LIST_API_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error("Error removing from list:", error);
    return false;
  }
}

// Check if item is in list
export async function checkInList(
  malId: number,
  type: "anime" | "manga" | "lightnovel" = "anime",
): Promise<{ inList: boolean; data: ListItem | null }> {
  const token = getAuthToken();
  if (!token) return { inList: false, data: null };

  try {
    const response = await fetch(
      `${LIST_API_URL}/check/${malId}?type=${type}`,
      { headers: authHeaders() },
    );
    const result = await response.json();
    return { inList: result.inList, data: result.data };
  } catch (error) {
    console.error("Error checking list:", error);
    return { inList: false, data: null };
  }
}

// Remove by MAL ID
export async function removeFromListByMalId(
  malId: number,
  type: "anime" | "manga" | "lightnovel" = "anime",
): Promise<boolean> {
  try {
    const response = await fetch(
      `${LIST_API_URL}/by-mal/${malId}?type=${type}`,
      {
        method: "DELETE",
        headers: authHeaders(),
      },
    );
    const result = await response.json();
    return result.success || false;
  } catch (error) {
    console.error("Error removing from list:", error);
    return false;
  }
}
