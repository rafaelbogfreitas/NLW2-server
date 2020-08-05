import express from "express";

const app = express();

app.use(express.json());

app.get("/users", (req, res) => {
  return res.json({ message: "HELLO WORLD!"})
});

app.listen(3333, () => console.log("Server running"))
