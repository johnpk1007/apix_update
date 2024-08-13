import { connectToDB } from "./components/database.js";
import express from "express";
import { configDotenv } from "dotenv";
import { billboardInsertion } from "./components/billboardInsertion.js";
import { queInsertion } from "./components/queInsertion.js";
import { multipleArtistScrape } from "./components/multipleArtistScrape.js";
import { billboardQueInsertion } from "./components/billboardQueInsertion.js";
import { queCheck } from "./components/queCheck.js";
import { artistTitleVideoInsertion } from "./components/artistTitleVideoInsertion.js";
import { billboardUpdate } from "./components/billboardUpdate.js";
import { billboardArtistUpdate } from "./components/billboardArtistUpdate.js";
import { billboardMatching } from "./components/billboardMatching.js";
import { billboardCheck } from "./components/billboardCheck.js";
import { billboardArtistCheck } from "./components/billboardArtistCheck.js";

configDotenv();
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("This is apix update backend");
});

app.listen(port, () => {
  console.log(`apix update server running on port ${port}`);
});
