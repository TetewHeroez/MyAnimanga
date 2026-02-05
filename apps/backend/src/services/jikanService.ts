// Jikan API v4 - Unofficial MyAnimeList API
// Documentation: https://docs.api.jikan.moe/

const JIKAN_BASE_URL = "https://api.jikan.moe/v4";

export interface JikanAnimeData {
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
}

interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
  };
}

// Rate limiting - Jikan allows 3 requests per second
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 400;

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithRateLimit(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;

  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }

  lastRequestTime = Date.now();

  const response = await fetch(url);

  if (response.status === 429) {
    console.log("Rate limited by Jikan, waiting 2s...");
    await delay(2000);
    return fetchWithRateLimit(url);
  }

  return response;
}

async function cachedFetch<T>(url: string): Promise<T | null> {
  // Check cache first
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  try {
    const response = await fetchWithRateLimit(url);
    const data = await response.json();

    // Store in cache
    cache.set(url, { data, timestamp: Date.now() });

    return data as T;
  } catch (error) {
    console.error("Error fetching from Jikan:", error);
    return null;
  }
}

export async function getTopAnime(
  limit: number = 10,
  filter: "airing" | "upcoming" | "bypopularity" | "favorite" = "bypopularity",
): Promise<JikanAnimeData[]> {
  const url = `${JIKAN_BASE_URL}/top/anime?limit=${limit}&filter=${filter}`;
  const data = await cachedFetch<JikanResponse<JikanAnimeData[]>>(url);
  return data?.data || [];
}

export async function getAiringAnime(
  limit: number = 10,
): Promise<JikanAnimeData[]> {
  // Fetch more to account for filtering out non-Japanese anime (donghua, etc.)
  const fetchLimit = Math.min(limit * 3, 25);
  const url = `${JIKAN_BASE_URL}/top/anime?filter=airing&limit=${fetchLimit}`;
  const data = await cachedFetch<JikanResponse<JikanAnimeData[]>>(url);

  // Filter out donghua/non-anime
  const filtered = (data?.data || []).filter((anime) => {
    // Must have Japanese title (contains hiragana/katakana/kanji)
    const japaneseTitle = anime.title_japanese;
    if (!japaneseTitle) return false;

    // Check if title_japanese contains actual Japanese characters (hiragana/katakana)
    // Chinese-only titles won't have hiragana/katakana
    const hasJapaneseChars = /[\u3040-\u309F\u30A0-\u30FF]/.test(japaneseTitle);

    // Donghua titles are usually only Chinese characters (hanzi), no hiragana/katakana
    // Japanese anime titles almost always have hiragana or katakana
    if (!hasJapaneseChars) return false;

    // Additional check: exclude ONA type (most donghua are ONA)
    // unless it has clear Japanese characters
    if (anime.type === "ONA" && !hasJapaneseChars) return false;

    return true;
  });

  return filtered.slice(0, limit);
}

export async function getUpcomingAnime(
  limit: number = 10,
): Promise<JikanAnimeData[]> {
  const url = `${JIKAN_BASE_URL}/seasons/upcoming?limit=${limit}`;
  const data = await cachedFetch<JikanResponse<JikanAnimeData[]>>(url);
  return data?.data || [];
}

export async function getSeasonalAnime(
  year?: number,
  season?: "winter" | "spring" | "summer" | "fall",
  limit: number = 10,
): Promise<JikanAnimeData[]> {
  const currentDate = new Date();
  const currentYear = year || currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  let currentSeason = season;
  if (!currentSeason) {
    if (currentMonth >= 0 && currentMonth <= 2) currentSeason = "winter";
    else if (currentMonth >= 3 && currentMonth <= 5) currentSeason = "spring";
    else if (currentMonth >= 6 && currentMonth <= 8) currentSeason = "summer";
    else currentSeason = "fall";
  }

  const url = `${JIKAN_BASE_URL}/seasons/${currentYear}/${currentSeason}?limit=${limit}`;
  const data = await cachedFetch<JikanResponse<JikanAnimeData[]>>(url);
  return data?.data || [];
}

export async function searchAnime(
  query: string,
  limit: number = 10,
): Promise<JikanAnimeData[]> {
  const url = `${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=${limit}`;
  const data = await cachedFetch<JikanResponse<JikanAnimeData[]>>(url);
  return data?.data || [];
}

export async function getAnimeById(id: number): Promise<JikanAnimeData | null> {
  const url = `${JIKAN_BASE_URL}/anime/${id}`;
  const data = await cachedFetch<JikanResponse<JikanAnimeData>>(url);
  return data?.data || null;
}

// ============ MANGA FUNCTIONS ============

export interface JikanMangaData {
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
  published: {
    from: string | null;
    to: string | null;
  } | null;
}

export async function getTopManga(
  limit: number = 10,
  filter:
    | "publishing"
    | "upcoming"
    | "bypopularity"
    | "favorite" = "bypopularity",
): Promise<JikanMangaData[]> {
  const fetchLimit = Math.min(limit * 2, 25);
  const url = `${JIKAN_BASE_URL}/top/manga?limit=${fetchLimit}&filter=${filter}`;
  const data = await cachedFetch<JikanResponse<JikanMangaData[]>>(url);

  // Filter to only include actual manga (exclude light novels, one-shots, etc. if needed)
  const filtered = (data?.data || []).filter((manga) => {
    const validTypes = ["Manga", "Manhwa", "Manhua", "One-shot", "Doujinshi"];
    // Keep manga types only
    if (manga.type && validTypes.includes(manga.type)) return true;
    return false;
  });

  return filtered.slice(0, limit);
}

export async function getLatestManga(
  limit: number = 10,
): Promise<JikanMangaData[]> {
  const fetchLimit = Math.min(limit * 2, 25);
  const url = `${JIKAN_BASE_URL}/manga?order_by=start_date&sort=desc&limit=${fetchLimit}`;
  const data = await cachedFetch<JikanResponse<JikanMangaData[]>>(url);

  // Filter manga only
  const filtered = (data?.data || []).filter((manga) => {
    const validTypes = ["Manga", "One-shot"];
    if (manga.type && validTypes.includes(manga.type)) return true;
    return false;
  });

  return filtered.slice(0, limit);
}

export async function searchManga(
  query: string,
  limit: number = 10,
): Promise<JikanMangaData[]> {
  const url = `${JIKAN_BASE_URL}/manga?q=${encodeURIComponent(query)}&limit=${limit}`;
  const data = await cachedFetch<JikanResponse<JikanMangaData[]>>(url);
  return data?.data || [];
}

// ============ LIGHT NOVEL FUNCTIONS ============

export async function getTopLightNovels(
  limit: number = 10,
): Promise<JikanMangaData[]> {
  const fetchLimit = Math.min(limit * 2, 25);
  // Light novels are under manga endpoint with type=lightnovel
  const url = `${JIKAN_BASE_URL}/top/manga?type=lightnovel&limit=${fetchLimit}`;
  const data = await cachedFetch<JikanResponse<JikanMangaData[]>>(url);
  return (data?.data || []).slice(0, limit);
}

export async function getLatestLightNovels(
  limit: number = 10,
): Promise<JikanMangaData[]> {
  const fetchLimit = Math.min(limit * 3, 25);
  const url = `${JIKAN_BASE_URL}/manga?type=lightnovel&order_by=start_date&sort=desc&limit=${fetchLimit}`;
  const data = await cachedFetch<JikanResponse<JikanMangaData[]>>(url);

  // Remove duplicates based on mal_id
  const seen = new Set<number>();
  const unique = (data?.data || []).filter((item) => {
    if (seen.has(item.mal_id)) return false;
    seen.add(item.mal_id);
    return true;
  });

  return unique.slice(0, limit);
}
