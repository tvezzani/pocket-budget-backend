/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

export async function up(knex) {
  function addAuditColumns(table) {
    table.timestamps(true, true);
    table.uuid("created_by_user_id").nullable();
    table.uuid("updated_by_user_id").nullable();
    table.foreign("created_by_user_id").references("id").inTable("users");
    table.foreign("updated_by_user_id").references("id").inTable("users");
  }

  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("username");
    table.string("email").notNullable().unique();
    table.string("password").notNullable();

    addAuditColumns(table);
  });

  await knex.schema.createTable("budgets", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("name").notNullable();
    table.uuid("primary_owner").notNullable();

    table.foreign("primary_owner").references("id").inTable("users");

    addAuditColumns(table);
  });

  await knex.schema.createTable("categories", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("name").notNullable();
    table.uuid("budget_id").notNullable();

    table.foreign("budget_id").references("id").inTable("budgets");

    addAuditColumns(table);
  });

  await knex.schema.createTable("category_targets", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("budget_id").notNullable();
    table.uuid("category_id").notNullable();
    table.float("goal").notNullable();
    // This duration solution could be improved to closer to best practices
    table.timestamp("start_date").notNullable();
    table.timestamp("end_date").notNullable();

    table.foreign("budget_id").references("id").inTable("budgets");
    table.foreign("category_id").references("id").inTable("categories");

    addAuditColumns(table);
  });

  await knex.schema.createTable("payees", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("budget_id").notNullable();
    table.string("name").notNullable();

    table.foreign("budget_id").references("id").inTable("budgets");

    addAuditColumns(table);
  });

  await knex.schema.createTable("transactions", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));
    table.uuid("budget_id").notNullable();
    table.uuid("user_id").notNullable();
    table.float("amount").notNullable();
    table.uuid("category_id").nullable();
    table.uuid("payee_id").nullable();
    table.timestamp("date").notNullable();
    table.string("notes").nullable();

    table.foreign("budget_id").references("id").inTable("budgets");
    table.foreign("category_id").references("id").inTable("categories");

    addAuditColumns(table);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("transactions");
  await knex.schema.dropTableIfExists("payees");
  await knex.schema.dropTableIfExists("category_targets");
  await knex.schema.dropTableIfExists("categories");
  await knex.schema.dropTableIfExists("budgets");
  await knex.schema.dropTableIfExists("users");
}
