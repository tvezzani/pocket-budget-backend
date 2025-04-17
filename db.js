import knex from "knex";
import config from "./knexfile.js";

export const db = knex(config.development);

export async function verifyDatabaseConnection() {
  try {
    await db.raw("SELECT NOW()");
    return true;
  } catch (error) {
    return false;
  }
}

export async function createNewUserSession({ access_token, user_id }) {
  try {
    return await db("user_sessions")
      .insert({ access_token, user_id })
      .returning("id");
  } catch (error) {
    console.error("Unable to create new user session", error);
    return Promise.reject(error);
  }
}

// Gracefully shut down and destroy DB connection
process.on("SIGINT", () => {
  console.info("Shutting down...");
  db.destroy().then(() => {
    console.info("Database connection closed.");
    process.exit(0);
  });
});
