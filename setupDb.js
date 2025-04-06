import knex from "knex";
import config from "./knexfile.js";

const db = knex(config.development);

async function setupDatabase() {
  try {
    await db.schema.dropTableIfExists("users");
    await db.schema.dropTableIfExists("budgets");
    await db.schema.dropTableIfExists("categories");
    await db.schema.dropTableIfExists("months");
    await db.schema.dropTableIfExists("category_amount_by_duration");
    await db.schema.dropTableIfExists("transactions");

    await db.schema.createTable("users", (table) => {
      table.increments("id").primary();
      table.string("username");
      table.string("email").notNullable().unique();
      table.string("password").notNullable();
      table.integer("created_by_user_id").unsigned().nullable();
      table.integer("updated_by_user_id").unsigned().nullable();

      // Set up foreign key relationships
      table.foreign("created_by_user_id").references("id").inTable("users");
      table.foreign("updated_by_user_id").references("id").inTable("users");

      //Adds created_at and updated_at columns
      table.timestamps(true, true);
    });

    await db.schema.createTable("budgets", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.integer("primary_owner").unsigned().notNullable();
      table.integer("created_by_user_id").unsigned().nullable();
      table.integer("updated_by_user_id").unsigned().nullable();

      table.foreign("primary_owner").references("id").inTable("users");
      table.foreign("created_by_user_id").references("id").inTable("users");
      table.foreign("updated_by_user_id").references("id").inTable("users");

      table.timestamps(true, true);
    });

    await db.schema.createTable("categories", (table) => {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.integer("budget_id").unsigned().notNullable();
      table.integer("created_by_user_id").unsigned().nullable();
      table.integer("updated_by_user_id").unsigned().nullable();

      table.foreign("budget_id").references("id").inTable("budgets");
      table.foreign("created_by_user_id").references("id").inTable("users");
      table.foreign("updated_by_user_id").references("id").inTable("users");

      table.timestamps(true, true);
    });

    await db.schema.createTable("category_amount_by_duration", (table) => {
      table.increments("id").primary();
      table.integer("budget_id").unsigned().notNullable();
      table.integer("category_id").unsigned().notNullable();
      table.float("amount").notNullable();
      // This duration solution could be improved to closer to best practices
      table.timestamp("duration_start").notNullable();
      table.timestamp("duration_end").notNullable();

      table.integer("created_by_user_id").unsigned().nullable();
      table.integer("updated_by_user_id").unsigned().nullable();

      table.foreign("budget_id").references("id").inTable("budgets");
      table.foreign("category_id").references("id").inTable("budgets");
      table.foreign("created_by_user_id").references("id").inTable("users");
      table.foreign("updated_by_user_id").references("id").inTable("users");

      table.timestamps(true, true);
    });

    //TODO: transactions

    console.info("✅ Database schema initialized successfully!");

    await db("users").insert([
      {
        username: "Super Admin",
        email: `${process.env.DEVELOPMENT_EMAIL}+super-admin@gmail.com`,
        password: "1234",
      },
      {
        username: "Kyle",
        email: `${process.env.DEVELOPMENT_EMAIL}+kyle@gmail.com`,
        password: "1234",
      },
    ]);

    await db("budgets").insert([
      {
        name: "Super Budget",
        primary_owner: 1,
      },
      {
        name: "Kyle's Budget",
        primary_owner: 2,
      },
    ]);

    console.info("✅ Demo data inserted successfully!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
  } finally {
    db.destroy();
  }
}

setupDatabase();
