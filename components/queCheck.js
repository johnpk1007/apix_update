import Que from "../models/que.js";
import TitleArtistVideo from "../models/titleArtistVideo.js";
import mongoose from "mongoose";

export const queCheck = async () => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const queItems = await Que.find().session(session);
    const titleAristVideos = await TitleArtistVideo.find().session(session);
    const newQueItems = [];
    const finalQueItems = [];

    if (queItems.length !== 0) {
      //checkinig for same que item
      for (const queItem of queItems) {
        if (
          newQueItems.findIndex(
            (newQueItem) =>
              newQueItem.title === queItem.title &&
              newQueItem.artist === queItem.artist
          ) === -1
        ) {
          newQueItems.push(queItem);
        }
      }

      //checking if titleAristVideo has queItem already
      for (const newQueItem of newQueItems) {
        if (
          titleAristVideos.findIndex(
            (titleAristVideo) =>
              titleAristVideo.title === newQueItem.title &&
              titleAristVideo.artist.includes(newQueItem.artist)
          ) === -1
        ) {
          if (
            finalQueItems.findIndex(
              (finalQueItem) =>
                finalQueItem.title === newQueItem.title &&
                finalQueItem.artist === newQueItem.artist
            ) === -1
          ) {
            finalQueItems.push(newQueItem);
          }
        }
      }
      const bulkOperation = finalQueItems.map((finalQueItem) => ({
        insertOne: { document: finalQueItem },
      }));

      await Que.bulkWrite(
        [
          {
            deleteMany: { filter: {} },
          },
          ...bulkOperation,
        ],
        { session }
      );
      console.log("billboard insertion complete");
    } else {
      console.log("nothing to check in que");
    }

    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
