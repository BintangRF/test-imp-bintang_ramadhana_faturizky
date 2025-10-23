import { Hono } from "hono";
import { pool } from "../db/index.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

type Variables = {
  user: {
    id: number;
    username: string;
    role: string;
  };
};

export const postRoute = new Hono<{ Variables: Variables }>();

// Middleware auth, semua endpoint butuh login
postRoute.use("*", authMiddleware());

// Middleware auth apabila akses hanya untuk role tertentu
// postRoute.use("/admin/*", authMiddleware(["admin"]));

// GET: List posts
postRoute.get("/", async (c) => {
  try {
    const page = parseInt(c.req.query("page") || "1");
    const limit = 10;
    const offset = (page - 1) * limit;

    const posts = await pool.query(
      `SELECT p.*, u.username 
       FROM posts p 
       JOIN users u ON p.user_id = u.id 
       ORDER BY p.created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countRes = await pool.query("SELECT COUNT(*) FROM posts");
    const total = parseInt(countRes.rows[0].count);

    return c.json({
      success: true,
      data: posts.rows,
      pagination: {
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return c.json({ message: "Server error" }, 500);
  }
});

// GET: Single post
postRoute.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const result = await pool.query(
      `SELECT p.*, u.username 
       FROM posts p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0)
      return c.json({ message: "Post not found" }, 404);

    return c.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return c.json({ message: "Server error" }, 500);
  }
});

// POST: Create post
postRoute.post("/", async (c) => {
  try {
    const user = c.get("user");
    const body = await c.req.json().catch(() => ({}));
    const { title, content } = body;

    if (!title || !content)
      return c.json({ message: "Missing title or content" }, 400);

    const result = await pool.query(
      `INSERT INTO posts (user_id, title, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [user.id, title.trim(), content.trim()]
    );

    return c.json({ success: true, data: result.rows[0] }, 201);
  } catch (err) {
    console.error(err);
    return c.json({ message: "Server error" }, 500);
  }
});

// PUT: Update post
postRoute.put("/:id", async (c) => {
  try {
    const user = c.get("user");
    const id = c.req.param("id");
    const body = await c.req.json().catch(() => ({}));
    const { title, content } = body;

    const postRes = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (postRes.rows.length === 0)
      return c.json({ message: "Post not found" }, 404);

    const post = postRes.rows[0];
    if (user.role !== "admin" && post.user_id !== user.id) {
      return c.json({ message: "Forbidden: not your post" }, 403);
    }

    const result = await pool.query(
      `UPDATE posts 
       SET title = COALESCE($1, title),
           content = COALESCE($2, content),
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [title || post.title, content || post.content, id]
    );

    return c.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return c.json({ message: "Server error" }, 500);
  }
});

// DELETE: Delete post
postRoute.delete("/:id", async (c) => {
  try {
    const user = c.get("user");
    const id = c.req.param("id");

    const postRes = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
    if (postRes.rows.length === 0)
      return c.json({ message: "Post not found" }, 404);

    const post = postRes.rows[0];
    if (user.role !== "admin" && post.user_id !== user.id) {
      return c.json({ message: "Forbidden: not your post" }, 403);
    }

    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
    return c.json({ success: true, message: "Post deleted" });
  } catch (err) {
    console.error(err);
    return c.json({ message: "Server error" }, 500);
  }
});
