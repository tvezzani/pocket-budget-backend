import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import knex from "knex";
import config from "./knexfile.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(json());

const db = knex(config.development);

db.raw("SELECT NOW()")
  .then(() => {
    console.log("Connected to PostgreSQL!");
    db.destroy();
  })
  .catch((err) => {
    console.error("Connection error:", err);
  });

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/transactions", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM transactions");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
