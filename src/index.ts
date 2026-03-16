import { Hono } from "hono";
import { db } from "./db";

const app = new Hono();
app.get("/", (c) => c.text("Hello Bun!"));

app.get("/users", async (c) => {
  const users = await db.selectFrom("users").selectAll().execute();
  return c.json(users);
});

app.post("/users", async (c) => {
  const body: { username: string } = await c.req.parseBody();
  const username = body.username;
  if (!username) return c.status(400);

  await db.insertInto("users").values({ username }).execute();
  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("username", "=", username)
    .executeTakeFirstOrThrow();
  return c.json(user);
});

app.delete("/users/:username", async (c) => {
  const username = c.req.param("username");
  if (!username) return c.notFound();

  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("username", "=", username)
    .executeTakeFirst();
  if (!user) return c.notFound();

  await db
    .deleteFrom("users")
    .where("id", "=", user.id)
    .executeTakeFirstOrThrow();
  return c.json(user);
});

export default app;
