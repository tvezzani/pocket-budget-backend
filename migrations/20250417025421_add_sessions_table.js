/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  await knex.schema.createTable("user_sessions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("access_token").notNullable().unique();
    table
      .timestamp("expires_at")
      .defaultTo(knex.raw("NOW() + INTERVAL '1 hour'"));
    table.uuid("user_id").notNullable();

    table.foreign("user_id").references("id").inTable("users");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  await knex.schema.dropTable("user_sessions");
};
