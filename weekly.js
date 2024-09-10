import { connectToDB } from "./components/database.js";
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

configDotenv();

async function weeklyTask() {
  try {
    // const date = new Date();
    // if (date.getUTCDay() !== 2) {
    //   throw new Error("It isn't Tuesday yet");
    // }
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
  } catch (error) {
    console.error(error.message);
  }
}
weeklyTask();
