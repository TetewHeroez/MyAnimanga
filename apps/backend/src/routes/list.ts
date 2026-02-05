import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import {
  getUserById,
  getUserLists,
  addToUserList,
  updateUserListItem,
  removeFromUserList,
  getListItemByMalId,
  type UserList,
} from "../db/memoryStore";

// Helper to verify token
async function verifyAuth(
  headers: Record<string, string | undefined>,
  jwt: any,
) {
  const authHeader = headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const payload = await jwt.verify(token);

  if (!payload || !payload.sub) {
    return null;
  }

  const user = getUserById(payload.sub as string);
  return user || null;
}

// Generate unique ID
function generateId(): string {
  return crypto.randomUUID();
}

export const listRoutes = new Elysia({ prefix: "/api/list" })
  .use(
    jwt({
      name: "jwt",
      secret:
        process.env.JWT_SECRET ||
        "myanimanga-super-secret-key-change-in-production",
      exp: process.env.JWT_EXPIRES_IN || "7d",
    }),
  )
  // Get user's list
  .get("/", async ({ headers, jwt, set, query }) => {
    const user = await verifyAuth(headers, jwt);
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    let lists = getUserLists(user.id);

    // Filter by type if specified
    if (query.type) {
      lists = lists.filter((l) => l.type === query.type);
    }

    // Filter by status if specified
    if (query.status) {
      lists = lists.filter((l) => l.status === query.status);
    }

    // Sort by updatedAt (most recent first)
    lists.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );

    return {
      success: true,
      data: lists,
      total: lists.length,
    };
  })
  // Add to list
  .post(
    "/",
    async ({ headers, jwt, set, body }) => {
      const user = await verifyAuth(headers, jwt);
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      type ListStatusType =
        | "watching"
        | "reading"
        | "completed"
        | "plan_to_watch"
        | "plan_to_read"
        | "dropped"
        | "on_hold";

      const defaultStatus: ListStatusType =
        body.type === "anime" ? "plan_to_watch" : "plan_to_read";

      const item: UserList = {
        id: generateId(),
        userId: user.id,
        type: body.type,
        malId: body.malId,
        title: body.title,
        titleEnglish: body.titleEnglish || null,
        imageUrl: body.imageUrl,
        status: (body.status as ListStatusType) || defaultStatus,
        score: body.score || null,
        progress: body.progress || 0,
        notes: body.notes || "",
        addedAt: new Date(),
        updatedAt: new Date(),
      };

      const added = addToUserList(user.id, item);

      return {
        success: true,
        data: added,
      };
    },
    {
      body: t.Object({
        type: t.Union([
          t.Literal("anime"),
          t.Literal("manga"),
          t.Literal("lightnovel"),
        ]),
        malId: t.Number(),
        title: t.String(),
        titleEnglish: t.Optional(t.String()),
        imageUrl: t.String(),
        status: t.Optional(t.String()),
        score: t.Optional(t.Number()),
        progress: t.Optional(t.Number()),
        notes: t.Optional(t.String()),
      }),
    },
  )
  // Update list item
  .put(
    "/:id",
    async ({ headers, jwt, set, params, body }) => {
      const user = await verifyAuth(headers, jwt);
      if (!user) {
        set.status = 401;
        return { error: "Unauthorized" };
      }

      type ListStatusType =
        | "watching"
        | "reading"
        | "completed"
        | "plan_to_watch"
        | "plan_to_read"
        | "dropped"
        | "on_hold";

      const updates: Partial<UserList> = {};
      if (body.status) updates.status = body.status as ListStatusType;
      if (body.score !== undefined) updates.score = body.score;
      if (body.progress !== undefined) updates.progress = body.progress;
      if (body.notes !== undefined) updates.notes = body.notes;

      const updated = updateUserListItem(user.id, params.id, updates);
      if (!updated) {
        set.status = 404;
        return { error: "Item not found" };
      }

      return {
        success: true,
        data: updated,
      };
    },
    {
      body: t.Object({
        status: t.Optional(t.String()),
        score: t.Optional(t.Number()),
        progress: t.Optional(t.Number()),
        notes: t.Optional(t.String()),
      }),
    },
  )
  // Remove from list
  .delete("/:id", async ({ headers, jwt, set, params }) => {
    const user = await verifyAuth(headers, jwt);
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const removed = removeFromUserList(user.id, params.id);
    if (!removed) {
      set.status = 404;
      return { error: "Item not found" };
    }

    return {
      success: true,
      message: "Removed from list",
    };
  })
  // Check if item is in list (by MAL ID)
  .get("/check/:malId", async ({ headers, jwt, set, params, query }) => {
    const user = await verifyAuth(headers, jwt);
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const type = (query.type as "anime" | "manga" | "lightnovel") || "anime";
    const item = getListItemByMalId(user.id, parseInt(params.malId), type);

    return {
      success: true,
      inList: !!item,
      data: item || null,
    };
  })
  // Remove by MAL ID (alternative method)
  .delete("/by-mal/:malId", async ({ headers, jwt, set, params, query }) => {
    const user = await verifyAuth(headers, jwt);
    if (!user) {
      set.status = 401;
      return { error: "Unauthorized" };
    }

    const type = (query.type as "anime" | "manga" | "lightnovel") || "anime";
    const item = getListItemByMalId(user.id, parseInt(params.malId), type);

    if (!item) {
      set.status = 404;
      return { error: "Item not found" };
    }

    removeFromUserList(user.id, item.id);

    return {
      success: true,
      message: "Removed from list",
    };
  });
