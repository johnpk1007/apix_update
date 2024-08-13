import Billboard from "../models/billboard.js";
import TitleArtistVideo from "../models/titleArtistVideo.js";
import BillboardVideo from "../models/billboardVideo.js";
import mongoose from "mongoose";

export const billboardUpdate = async () => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const billboardItems = await Billboard.find().session(session);
    const titleAristVideos = await TitleArtistVideo.find().session(session);
    const billboardVideos = [];

    for (const billboardItem of billboardItems) {
      if (
        billboardVideos.findIndex(
          (billboardVideo) =>
            billboardVideo.title === billboardItem.title &&
            billboardVideo.artist === billboardItem.artist
        ) === -1
      ) {
        const idx = titleAristVideos.findIndex(
          (titleAristVideo) =>
            titleAristVideo.title === billboardItem.title &&
            titleAristVideo.artist === billboardItem.artist
        );
        if (idx !== -1) {
          billboardItem.video = titleAristVideos[idx].video;
          billboardVideos.push(billboardItem);
        } else {
          billboardVideos.push(billboardItem);
        }
      }
    }

    const bulkOperation = billboardVideos.map((singleBillboardVideo) => ({
      insertOne: { document: singleBillboardVideo },
    }));
    await BillboardVideo.bulkWrite(
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
    console.log("billboard update process complete");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
