import TitleArtistVideo from "../models/titleArtistVideo.js";
import BillboardArtist from "../models/billboardArtist.js";
import BillboardArtistVideo from "../models/billboardArtistVideo.js";
import mongoose from "mongoose";

export const billboardArtistUpdate = async () => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const billboardArtists = await BillboardArtist.find().session(session);
    const titleAristVideos = await TitleArtistVideo.find().session(session);

    const billboardArtistVideos = [];

    for (const billboardArtist of billboardArtists) {
      if (
        billboardArtistVideos.findIndex(
          (billboardArtistVideo) =>
            billboardArtistVideo.artist === billboardArtist.artist
        ) === -1
      ) {
        for (let i = 0; i < billboardArtist.top5songs.length; i++) {
          const idx = titleAristVideos.findIndex(
            (titleAristVideo) =>
              titleAristVideo.artist.includes(billboardArtist.artist) &&
              titleAristVideo.title === billboardArtist.top5songs[i].title
          );
          if (idx !== -1) {
            billboardArtist.top5songs[i].video = titleAristVideos[idx].video;
          }
        }
        billboardArtistVideos.push(billboardArtist);
      }
    }

    const bulkOperation = billboardArtistVideos.map(
      (singlebillboardArtistVideo) => ({
        insertOne: { document: singlebillboardArtistVideo },
      })
    );

    await BillboardArtistVideo.bulkWrite(
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
    console.log("billboard artist update process complete");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
