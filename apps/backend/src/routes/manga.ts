import { Elysia } from "elysia";
import {
  getTopManga,
  getLatestManga,
  searchManga,
  getTopLightNovels,
  getLatestLightNovels,
} from "../services/jikanService";

export const mangaRoutes = new Elysia({ prefix: "/api/manga" })
  // Get top manga by popularity
  .get("/top", async ({ query }) => {
    const limit = Number(query.limit) || 12;
    const data = await getTopManga(limit, "bypopularity");
    return { data, total: data.length };
  })

  // Get latest/newest manga
  .get("/latest", async ({ query }) => {
    const limit = Number(query.limit) || 12;
    const data = await getLatestManga(limit);
    return { data, total: data.length };
  })

  // Search manga
  .get("/search", async ({ query }) => {
    const q = query.q || "";
    const limit = Number(query.limit) || 10;
    if (!q) {
      return { data: [], total: 0 };
    }
    const data = await searchManga(q, limit);
    return { data, total: data.length };
  })

  // Light Novel routes
  // Get top light novels
  .get("/lightnovel/top", async ({ query }) => {
    const limit = Number(query.limit) || 12;
    const data = await getTopLightNovels(limit);
    return { data, total: data.length };
  })

  // Get latest light novels
  .get("/lightnovel/latest", async ({ query }) => {
    const limit = Number(query.limit) || 12;
    const data = await getLatestLightNovels(limit);
    return { data, total: data.length };
  });
