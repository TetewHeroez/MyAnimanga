import { Elysia } from "elysia";
import {
  getTopAnime,
  getAiringAnime,
  getUpcomingAnime,
  getSeasonalAnime,
  searchAnime,
  getAnimeById,
} from "../services/jikanService";

export const animeRoutes = new Elysia({ prefix: "/api/anime" })
  // Get top anime by popularity
  .get("/top", async ({ query }) => {
    const limit = Number(query.limit) || 12;
    const data = await getTopAnime(limit, "bypopularity");
    return { data, total: data.length };
  })

  // Get currently airing anime
  .get("/airing", async ({ query }) => {
    const limit = Number(query.limit) || 12;
    const data = await getAiringAnime(limit);
    return { data, total: data.length };
  })

  // Get upcoming anime
  .get("/upcoming", async ({ query }) => {
    const limit = Number(query.limit) || 12;
    const data = await getUpcomingAnime(limit);
    return { data, total: data.length };
  })

  // Get seasonal anime
  .get("/seasonal", async ({ query }) => {
    const limit = Number(query.limit) || 12;
    const year = query.year ? Number(query.year) : undefined;
    const season = query.season as
      | "winter"
      | "spring"
      | "summer"
      | "fall"
      | undefined;
    const data = await getSeasonalAnime(year, season, limit);
    return { data, total: data.length };
  })

  // Search anime
  .get("/search", async ({ query }) => {
    const q = query.q || "";
    const limit = Number(query.limit) || 10;
    if (!q) {
      return { data: [], total: 0 };
    }
    const data = await searchAnime(q, limit);
    return { data, total: data.length };
  })

  // Get anime by ID
  .get("/:id", async ({ params: { id } }) => {
    const animeId = Number(id);
    if (isNaN(animeId)) {
      return { error: "Invalid anime ID" };
    }
    const data = await getAnimeById(animeId);
    if (!data) {
      return { error: "Anime not found" };
    }
    return { data };
  });
