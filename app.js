import express from "express";
import { configDotenv } from "dotenv";

configDotenv();
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("This is apix update backend");
});

app.listen(port, () => {
  console.log(`apix update server running on port ${port}`);
});
