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
  res.send("Hello World!");
});

app.get("/weekly", async (req, res) => {
  try {
    await connectToDB();
    const data = await billboardInsertion();
    await queInsertion(data);
    await multipleArtistScrape(data);
    await billboardQueInsertion();
    await queCheck();
    await artistTitleVideoInsertion();
    await billboardUpdate();
    await billboardArtistUpdate();
    await billboardMatching();
    console.log("weekly api update complete");
    res.send(JSON.stringify({ message: "weekly api update complete" }));
  } catch (error) {
    console.error(error.message);
    res.send(JSON.stringify({ message: error.message }));
  }
});

app.get("/daily", async (req, res) => {
  try {
    await connectToDB();
    const billboardCheckResult = await billboardCheck();
    const billboardArtistCheckResult = await billboardArtistCheck();
    if (
      billboardCheckResult === false &&
      billboardArtistCheckResult === false
    ) {
      throw new Error("nothing to update");
    }
    await queCheck();
    await artistTitleVideoInsertion();
    if (billboardCheckResult) {
      await billboardUpdate();
    }
    if (billboardArtistCheckResult) {
      await billboardArtistUpdate();
    }
    console.log("daily api update complete");
    res.send(JSON.stringify({ message: "daily api update complete" }));
  } catch (error) {
    console.error(error.message);
    res.send(JSON.stringify({ message: error.message }));
  }
});

app.listen(port, () => {
  console.log(`apix update server running on port ${port}`);
});
