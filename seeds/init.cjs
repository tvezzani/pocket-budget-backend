/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("category_targets").del();
  await knex("payees").del();
  await knex("categories").del();
  await knex("budgets").del();
  await knex("users").del();

  const users = await knex("users")
    .insert([
      {
        username: "Super Admin",
        email: `${
          process.env.DEVELOPMENT_EMAIL || "development"
        }+super-admin@gmail.com`,
        password: "1234",
      },
      {
        username: "Steve",
        email: `${
          process.env.DEVELOPMENT_EMAIL || "development"
        }+steve@gmail.com`,
        password: "1234",
      },
      {
        username: "Alex",
        email: `${
          process.env.DEVELOPMENT_EMAIL || "development"
        }+alex@gmail.com`,
        password: "1234",
      },
      {
        username: "Kyle",
        email: `${
          process.env.DEVELOPMENT_EMAIL || "development"
        }+kyle@gmail.com`,
        password: "1234",
      },
    ])
    .returning(["id", "username"]);

  const steveId = users.find((user) => user.username === "Steve").id;
  const alexId = users.find((user) => user.username === "Alex").id;
  const kyleId = users.find((user) => user.username === "Kyle").id;

  const budgets = await knex("budgets")
    .insert([
      {
        name: "Steve's Budget",
        primary_owner: steveId,
      },
      {
        name: "Kyle's Budget",
        primary_owner: kyleId,
      },
    ])
    .returning(["id", "name"]);

  const steveBudgetId = budgets.find(
    (budget) => budget.name === "Steve's Budget"
  ).id;
  const kyleBudgetId = budgets.find(
    (budget) => budget.name === "Kyle's Budget"
  ).id;

  const categories = await knex("categories")
    .insert([
      {
        name: "Mortgage",
        budget_id: steveBudgetId,
      },
      {
        name: "Food",
        budget_id: steveBudgetId,
      },
      {
        name: "Savings",
        budget_id: steveBudgetId,
      },
      {
        name: "Rent",
        budget_id: kyleBudgetId,
      },
      {
        name: "Energy Drinks",
        budget_id: kyleBudgetId,
      },
    ])
    .returning(["id", "name"]);

  const payees = await knex("payees")
    .insert([
      {
        budget_id: steveBudgetId,
        name: "Freedom Bank",
      },
      {
        budget_id: steveBudgetId,
        name: "Food Market",
      },
      {
        budget_id: kyleBudgetId,
        name: "Apartment Inc.",
      },
      {
        budget_id: kyleBudgetId,
        name: "Soda Shop",
      },
    ])
    .returning(["id", "name"]);

  const freedomBankId = payees.find(
    (payee) => payee.name === "Freedom Bank"
  ).id;
  const foodMarketId = payees.find((payee) => payee.name === "Food Market").id;
  const apartmentIncId = payees.find(
    (payee) => payee.name === "Apartment Inc."
  ).id;
  const sodaShopId = payees.find((payee) => payee.name === "Soda Shop").id;

  const mortgageId = categories.find(
    (category) => category.name === "Mortgage"
  ).id;
  const foodId = categories.find((category) => category.name === "Food").id;
  const savingsId = categories.find(
    (category) => category.name === "Savings"
  ).id;
  const rentId = categories.find((category) => category.name === "Rent").id;
  const energyDrinksId = categories.find(
    (category) => category.name === "Energy Drinks"
  ).id;

  await knex("transactions").insert([
    {
      budget_id: steveBudgetId,
      user_id: steveId,
      amount: 56.47,
      category_id: foodId,
      payee_id: foodMarketId,
      date: new Date(2025, 0, 3).toISOString(),
      notes: "Got some food.",
    },
    {
      budget_id: steveBudgetId,
      user_id: alexId,
      amount: 34.02,
      category_id: foodId,
      payee_id: foodMarketId,
      date: new Date(2025, 0, 12).toISOString(),
      notes: "grocery shopping",
    },
    {
      budget_id: steveBudgetId,
      user_id: steveId,
      amount: 12.88,
      category_id: foodId,
      payee_id: null,
      date: new Date(2025, 0, 17).toISOString(),
      notes: "Needed to buy some donuts.",
    },
    {
      budget_id: steveBudgetId,
      user_id: steveId,
      amount: 1200,
      category_id: mortgageId,
      payee_id: freedomBankId,
      date: new Date(2025, 0, 26).toISOString(),
      notes: "Paid rent.",
    },
    {
      budget_id: steveBudgetId,
      user_id: alexId,
      amount: 200,
      category_id: savingsId,
      payee_id: freedomBankId,
      date: new Date(2025, 0, 28).toISOString(),
      notes: "savings",
    },
    {
      budget_id: steveBudgetId,
      user_id: alexId,
      amount: 25,
      category_id: null,
      payee_id: null,
      date: new Date(2025, 0, 29).toISOString(),
      notes: "donated to a charity",
    },
    {
      budget_id: steveBudgetId,
      user_id: alexId,
      amount: 48.12,
      category_id: foodId,
      payee_id: foodMarketId,
      date: new Date(2025, 1, 3).toISOString(),
      notes: "more groceries",
    },
    {
      budget_id: kyleBudgetId,
      user_id: kyleId,
      amount: 20.05,
      category_id: energyDrinksId,
      payee_id: sodaShopId,
      date: new Date(2025, 0, 10).toISOString(),
      notes: null,
    },
    {
      budget_id: kyleBudgetId,
      user_id: kyleId,
      amount: 800,
      category_id: rentId,
      payee_id: apartmentIncId,
      date: new Date(2025, 0, 25).toISOString(),
      notes: null,
    },
    {
      budget_id: kyleBudgetId,
      user_id: kyleId,
      amount: 50,
      category_id: null,
      payee_id: null,
      date: new Date(2025, 0, 28).toISOString(),
      notes: "just threw some money at a guy",
    },
    {
      budget_id: kyleBudgetId,
      user_id: kyleId,
      amount: 28.32,
      category_id: energyDrinksId,
      payee_id: sodaShopId,
      date: new Date(2025, 1, 4).toISOString(),
      notes: null,
    },
  ]);

  const januaryStartDate = new Date(2025, 0, 1).toISOString();
  const januaryEndDate = new Date(2025, 0, 31, 23, 59, 59).toISOString();
  const februaryStartDate = new Date(2025, 1, 1).toISOString();
  const februaryEndDate = new Date(2025, 1, 28, 23, 59, 59).toISOString();

  await knex("category_targets").insert([
    {
      budget_id: steveBudgetId,
      category_id: mortgageId,
      goal: 1200,
      start_date: januaryStartDate,
      end_date: januaryEndDate,
    },
    {
      budget_id: steveBudgetId,
      category_id: foodId,
      goal: 500,
      start_date: januaryStartDate,
      end_date: januaryEndDate,
    },
    {
      budget_id: steveBudgetId,
      category_id: savingsId,
      goal: 199.99,
      start_date: januaryStartDate,
      end_date: januaryEndDate,
    },
    {
      budget_id: kyleBudgetId,
      category_id: rentId,
      goal: 750.5,
      start_date: januaryStartDate,
      end_date: januaryEndDate,
    },
    {
      budget_id: kyleBudgetId,
      category_id: energyDrinksId,
      goal: 200,
      start_date: februaryStartDate,
      end_date: februaryEndDate,
    },
    {
      budget_id: steveBudgetId,
      category_id: mortgageId,
      goal: 1200,
      start_date: februaryStartDate,
      end_date: februaryEndDate,
    },
    {
      budget_id: steveBudgetId,
      category_id: foodId,
      goal: 400,
      start_date: februaryStartDate,
      end_date: februaryEndDate,
    },
    {
      budget_id: steveBudgetId,
      category_id: savingsId,
      goal: 299.99,
      start_date: februaryStartDate,
      end_date: februaryEndDate,
    },
    {
      budget_id: kyleBudgetId,
      category_id: rentId,
      goal: 800,
      start_date: februaryStartDate,
      end_date: februaryEndDate,
    },
    {
      budget_id: kyleBudgetId,
      category_id: energyDrinksId,
      goal: 300,
      start_date: februaryStartDate,
      end_date: februaryEndDate,
    },
  ]);
};
