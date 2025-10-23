import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import dotenv from "dotenv";
import { authRoute } from "./routes/auth.js";
import { postRoute } from "./routes/posts.js";

dotenv.config();

const app = new Hono();
app.use(
  "*",
  cors({
    origin: process.env.FE_URL || "",
    credentials: true,
  })
);

app.use("*", logger());

app.route("/auth", authRoute);
app.route("/posts", postRoute);

app.get("/", (c) => {
  return c.json({
    success: true,
    message: `${process.env.APP_NAME} is running`,
    env: process.env.NODE_ENV,
    port: process.env.PORT,
  });
});

const port = Number(process.env.PORT) || 3001;

serve({
  fetch: app.fetch,
  port,
  hostname: "0.0.0.0",
});

console.log(`Server running on http://0.0.0.0:${port}`);
