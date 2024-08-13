import mongoose from "mongoose";
import Que from "../models/que.js";
import BillboardArtist from "../models/billboardArtist.js";

export const billboardQueInsertion = async () => {
  let list = [];
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const data = await BillboardArtist.find();
    data.map((el) => {
      const artist = el.artist;
      const top5songs = el.top5songs;
      for (let i = 0; i < top5songs.length; i++) {
        list.push({
          artist: artist,
          title: top5songs[i].title,
        });
      }
    });
    await Que.insertMany(list, { session });
    await session.commitTransaction();
    session.endSession();
    console.log("que insertion complete");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
