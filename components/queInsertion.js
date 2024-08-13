import mongoose from "mongoose";
import Que from "../models/que.js";

export const queInsertion = async (data) => {
  let list = [];
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    data.map((el, idx) => {
      list[idx] = {
        title: el.title,
        artist: el.artist,
      };
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
