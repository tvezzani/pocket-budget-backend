export default function userRoutes(app, db) {
  app.get("/users", async (req, res) => {
    try {
      const rows = await db("users").select("*");
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/user", async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const [newUser] = await db("users")
        .insert({ username, email, password })
        .returning("*");
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.put("/user/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, password } = req.body;
      const [updatedUser] = await db("users")
        .where({ id })
        .update({ username, email, password })
        .returning("*");
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/user/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const [deletedUser] = await db("users")
        .where({ id })
        .del()
        .returning("*");
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json("User successfully deleted");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
}
