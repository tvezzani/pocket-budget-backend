// import {json} from 'express';
import { db, createNewUserSession } from "../db.js";
import { oauth2Client } from "../authorization.js";
import { json } from "express";
import { jwtDecode } from "jwt-decode";
import express from "express";

// export default function authenticationRoutes(app) {
// app.get("/login-google-url", (req, res) => {
//   const scopes = ["https://www.googleapis.com/auth/userinfo.email", "openid"];

//   const url = oauth2Client.generateAuthUrl({
//     // 'online' (default) or 'offline' (gets refresh_token)
//     access_type: "offline",

//     // If you only need one scope, you can pass it as a string
//     scope: scopes,
//   });

//   res.json({ url });
// });

const router = express.Router();

// Define routes
router.get("/", (req, res) => {
  res.send("Welcome to the homepage!");
});

router.get("/about", (req, res) => {
  res.send("About us page");
});

router.get("/login-google-url", (req, res) => {
  const scopes = ["https://www.googleapis.com/auth/userinfo.email", "openid"];

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",

    // If you only need one scope, you can pass it as a string
    scope: scopes,
  });

  res.json({ url });
});

router.get("/authorization-code/callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);

  // Verify and parse tokens

  // const payload = verifyToken(tokens.id_token);
  const payload = jwtDecode(tokens.id_token);

  // Create a record if it doesn't exist, or link an account or something
  const existingUser = await db("users")
    .select("id")
    .where({ email: payload.email })
    .first();

  let userId = existingUser?.id;

  if (!userId) {
    const userIdRaw = await db("users")
      .insert({
        username: payload.email,
        email: payload.email,
        password: "1234",
      })
      .returning("id");

    userId = (userIdRaw || [])[0]?.id || null;
  }

  // This may not be needed
  //   oauth2Client.setCredentials(tokens);

  if (!userId || !tokens.access_token) {
    console.warn(
      "A user tried to sign in and authentication failed. User session not created."
    );
    return res.redirect("http://localhost:3000");
  }

  const userSessionToken = await createNewUserSession({
    user_id: userId,
    access_token: tokens.access_token,
  });

  // TODO: define the age of the token in one place, rather than here
  res.cookie("pocket_budget_user_session", userSessionToken, {
    httpOnly: false,
    maxAge: 60 * 60 * 1000,
  });

  return res.redirect("http://localhost:3000");
});

export default router;
