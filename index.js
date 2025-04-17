import express, { json } from "express";
import dotenv from "dotenv";
import cors from "cors";
import knex from "knex";
import config from "./knexfile.js";
import userRoutes from "./routes/userRoutes.js";
import fs from "fs";
import { google } from "googleapis";
import { jwtDecode } from "jwt-decode";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

const db = knex(config.development);

const {
  web: { client_id, client_secret, redirect_uris },
} = JSON.parse(fs.readFileSync("./googleClientSecret.json").toString());

const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

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

app.get("/login-google-url", (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/userinfo.email", "openid"];

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",

    // If you only need one scope, you can pass it as a string
    scope: scopes,
  });

  res.json({ url });
});

async function verifyToken(token) {
  try {
    // Verify and decode the JWT token
    const ticket = await oauth2Client.verifyIdToken({
      idToken: token,
      audience: client_id,
    });

    // Extract payload (user data) from the token
    const payload = ticket.getPayload();

    console.log("Decoded Payload:", payload);
    return payload;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return null;
  }
}

app.get("/authorization-code/callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);

  // Verify and parse tokens

  // const payload = verifyToken(tokens.id_token);
  const payload = jwtDecode(tokens.id_token);

  // Create a record if it doesn't exist, or link an account or something

  oauth2Client.setCredentials(tokens);

  // Possibly pass values

  res.cookie("jwt", JSON.stringify(tokens), {
    httpOnly: false,
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.redirect("http://localhost:3000");
  res.json(payload);
});

userRoutes(app, db);

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
