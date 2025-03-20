import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import knex from "knex";
import config from "./knexfile.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

const db = knex(config.development);

db.raw("SELECT NOW()")
  .then(() => {
    console.info("Connected to PostgreSQL!");
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

app.get("/health", (req, res) => {
  res.send("Backend is healthy!");
});

app.get("/users", async (req, res) => {
  try {
    const rows = await db("users").select("*");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/user", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const [newUser] = await db("users")
      .insert({ username, email, password })
      .returning("*");
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;
    const [updatedUser] = await db("users")
      .where({ id })
      .update({ username, email, password })
      .returning("*");
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [deletedUser] = await db("users").where({ id }).del().returning("*");
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json("User successfully deleted");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/budgets", async (req, res) => {
  try {
    const rows = await db("budgets").select("*");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gracefully shut down and destroy DB connection
process.on("SIGINT", () => {
  console.info("Shutting down...");
  db.destroy().then(() => {
    console.info("Database connection closed.");
    process.exit(0);
  });
});

app.listen(PORT, () => {
  console.info(`Server running on http://localhost:${PORT}`);
});
