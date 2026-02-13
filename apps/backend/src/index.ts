import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { animeRoutes } from "./routes/anime";
import { mangaRoutes } from "./routes/manga";
import { authRoutes } from "./routes/auth";
import { listRoutes } from "./routes/list";

const app = new Elysia()
  .use(
    cors({
      origin: true,
      credentials: true,
    }),
  )
  .get("/", () => ({
    message: "Welcome to THE animanga API",
    version: "0.0.2",
    endpoints: {
      anime: "/api/anime",
      manga: "/api/manga",
      lightnovel: "/api/manga/lightnovel",
      auth: "/api/auth",
      list: "/api/list",
    },
  }))
  .use(authRoutes)
  .use(animeRoutes)
  .use(mangaRoutes)
  .use(listRoutes)
  .listen({
    port: Number(process.env.PORT) || 3003,
    hostname: "0.0.0.0",
  });

console.log(`Backend API running on port ${app.server?.port}`);

export type App = typeof app;
