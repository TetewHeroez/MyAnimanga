import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import bcrypt from "bcryptjs";
import {
  createUser,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  type User,
} from "../db/memoryStore";

// Generate unique ID
function generateId(): string {
  return crypto.randomUUID();
}

export const authRoutes = new Elysia({ prefix: "/api/auth" })
  .use(
    jwt({
      name: "jwt",
      secret:
        process.env.JWT_SECRET ||
        "myanimanga-super-secret-key-change-in-production",
      exp: process.env.JWT_EXPIRES_IN || "7d",
    }),
  )
  // Register
  .post(
    "/register",
    async ({ body, jwt, set }) => {
      const { email, username, password } = body;

      // Check if email already exists
      if (getUserByEmail(email)) {
        set.status = 400;
        return { error: "Email already registered" };
      }

      // Check if username already exists
      if (getUserByUsername(username)) {
        set.status = 400;
        return { error: "Username already taken" };
      }

      // Validate password strength
      if (password.length < 6) {
        set.status = 400;
        return { error: "Password must be at least 6 characters" };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user: User = {
        id: generateId(),
        email: email.toLowerCase(),
        username,
        password: hashedPassword,
        createdAt: new Date(),
      };

      createUser(user);

      // Generate JWT
      const token = await jwt.sign({
        sub: user.id,
        email: user.email,
        username: user.username,
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        token,
      };
    },
    {
      body: t.Object({
        email: t.String({ format: "email" }),
        username: t.String({ minLength: 3, maxLength: 20 }),
        password: t.String({ minLength: 6 }),
      }),
    },
  )
  // Login
  .post(
    "/login",
    async ({ body, jwt, set }) => {
      const { email, password } = body;

      // Find user by email
      const user = getUserByEmail(email);
      if (!user) {
        set.status = 401;
        return { error: "Invalid email or password" };
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        set.status = 401;
        return { error: "Invalid email or password" };
      }

      // Generate JWT
      const token = await jwt.sign({
        sub: user.id,
        email: user.email,
        username: user.username,
      });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
        token,
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    },
  )
  // Get current user (verify token)
  .get("/me", async ({ headers, jwt, set }) => {
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      set.status = 401;
      return { error: "No token provided" };
    }

    const token = authHeader.substring(7);
    const payload = await jwt.verify(token);

    if (!payload) {
      set.status = 401;
      return { error: "Invalid or expired token" };
    }

    const user = getUserById(payload.sub as string);
    if (!user) {
      set.status = 401;
      return { error: "User not found" };
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    };
  });
