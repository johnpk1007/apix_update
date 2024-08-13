import { artistScrape } from "./artistScrape.js";
import BillboardArtist from "../models/billboardArtist.js";
import mongoose from "mongoose";

export async function multipleArtistScrape(data) {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const conditions = [",", "Featuring", "&", "X"];
    const separators = /[,&]|Featuring| X /;
    const list = [];
    data.map((singleData) => {
      if (conditions.some((el) => singleData.artist.includes(el))) {
        const parts = singleData.artist.split(separators);
        const trimParts = parts.map((str) => {
          return str.trim();
        });
        list.push(...trimParts);
      } else {
        list.push(singleData.artist);
      }
    });
    const newSet = new Set(list);
    const newList = [...newSet];
    const bulkOperation = [];
    for (let i = 0; i < newList.length; i++) {
      try {
        const result = await artistScrape(
          newList[i].toLowerCase().replace(/ /g, "-")
        );
        if (result.top5songs.length === 0) {
          continue;
        }
        const artist = newList[i];
        const arr = {
          insertOne: {
            document: {
              artist: artist,
              image: result.artistImage,
              top5songs: result.top5songs,
            },
          },
        };
        bulkOperation.push(arr);
      } catch (error) {
        console.error(error.message);
      }
      const delay = Math.floor(Math.random() * 4000) + 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    await BillboardArtist.bulkWrite(
      [
        {
          deleteMany: { filter: {} },
        },
        ...bulkOperation,
      ],
      { session }
    );
    await session.commitTransaction();
    session.endSession();
    console.log("billboard artist scrape process complete");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
}
