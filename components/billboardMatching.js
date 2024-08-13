import mongoose from "mongoose";
import BillboardVideo from "../models/billboardVideo.js";
import BillboardArtistVideo from "../models/billboardArtistVideo.js";

export const billboardMatching = async () => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const conditions = [",", "Featuring", "&", "X", "x"];
    const separators = /[,&]|Featuring| X | x /;
    const list = [];
    const newList = [];
    const billboardVideos = await BillboardVideo.find().session(session);
    const billboardArtistVideos = await BillboardArtistVideo.find().session(
      session
    );
    billboardVideos.map((singleData) => {
      if (conditions.some((el) => singleData.artist.includes(el))) {
        const parts = singleData.artist.split(separators);
        const trimParts = parts.map((str) => {
          return { artist: str.trim(), page: false };
        });
        list.push(trimParts);
      } else {
        list.push([{ artist: singleData.artist, page: false }]);
      }
    });

    for (const listItemArr of list) {
      const tempArr = [];
      for (const listItem of listItemArr) {
        if (
          billboardArtistVideos.findIndex(
            (billboardArtistVideo) =>
              billboardArtistVideo.artist === listItem.artist
          ) !== -1
        ) {
          tempArr.push({ artist: listItem.artist, page: true });
        } else {
          tempArr.push({ artist: listItem.artist, page: false });
        }
      }
      newList.push(tempArr);
    }

    for (let i = 0; i < billboardVideos.length; i++) {
      billboardVideos[i].page = newList[i];
    }

    const bulkOperation = billboardVideos.map((singleBillboardVideo) => ({
      updateOne: {
        filter: { _id: singleBillboardVideo._id },
        update: {
          $set: {
            page: singleBillboardVideo.page,
          },
        },
      },
    }));
    await BillboardVideo.bulkWrite([...bulkOperation], { session });

    await session.commitTransaction();
    session.endSession();

    console.log("billboard artist matching process complete");
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
