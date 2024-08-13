import { connectToDB } from "./components/database.js";
import { configDotenv } from "dotenv";
import { queCheck } from "./components/queCheck.js";
import { artistTitleVideoInsertion } from "./components/artistTitleVideoInsertion.js";
import { billboardUpdate } from "./components/billboardUpdate.js";
import { billboardArtistUpdate } from "./components/billboardArtistUpdate.js";
import { billboardCheck } from "./components/billboardCheck.js";
import { billboardArtistCheck } from "./components/billboardArtistCheck.js";

configDotenv();

async function dailyTask() {
  try {
    const date = new Date();
    if (date.getUTCDay() === 2) {
      throw new Error("It is Tuesday. Try tomorrow");
    }
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
  } catch (error) {
    console.error(error.message);
  }
}
dailyTask();
