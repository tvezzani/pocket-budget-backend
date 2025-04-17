import fs from "fs";
import { google } from "googleapis";
import { json } from "express";
import { jwtDecode } from "jwt-decode";
const {
  web: { client_id, client_secret, redirect_uris },
} = JSON.parse(fs.readFileSync("./googleClientSecret.json").toString());

export const oauth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

// This is not getting used right now - this could go in an authorization.js file
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
