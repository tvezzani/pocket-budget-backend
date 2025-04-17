import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import knex from "knex";
import config from "./knexfile.js";
import userRoutes from "./routes/userRoutes.js";
import fs from "fs";
import { google } from "googleapis";
import { jwtDecode } from "jwt-decode";
import { db, verifyDatabaseConnection } from "./db.js";
import authenticationRoutes from "./routes/authenticationRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

(async () => {
  if (await verifyDatabaseConnection()) {
    console.info("Connected to PostgreSQL!");
  } else {
    console.error("Unable to connect to PostgreSQL.");
  }
})();

app.get("/health", (req, res) => {
  res.send("Backend is healthy!");
});

app.use("/", authenticationRoutes); // Use the routes

userRoutes(app, db);
// TODO: Create the rest of the route files and put them here

app.get("/budgets", async (req, res) => {
  try {
    const rows = await db("budgets").select("*");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.info(`Server running on http://localhost:${PORT}`);
});
