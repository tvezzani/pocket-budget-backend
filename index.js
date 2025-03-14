import express, { json } from "express";
import dotenv from "dotenv";
import { Pool } from "pg";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

app.use(cors());
app.use(json());

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
