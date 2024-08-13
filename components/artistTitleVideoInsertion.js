import mongoose from "mongoose";
import Que from "../models/que.js";
import TitleAristVideo from "../models/titleArtistVideo.js";
import axios from "axios";

const videoSearch = async (query) => {
  try {
    const response = await axios.get(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&q=${query.replace(
        / /gi,
        "%20"
      )}&key=${process.env.YOUTUBE_API_KEY}`
    );
    return response.data.items[0].id.videoId;
  } catch (error) {
    console.log("videosearch error");
    throw error;
  }
};

export const artistTitleVideoInsertion = async () => {
  let hasMore = true;
  while (hasMore) {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      const queItems = await Que.find()
        .sort({ _id: 1 })
        .limit(10)
        .session(session);
      if (queItems.length === 0) {
        console.log(
          "nothing to process in que for artist title video insertion"
        );
        await session.abortTransaction();
        session.endSession();
        hasMore = false;
        break;
      }
      const processedQueItems = [];

      await Promise.all(
        queItems.map(async (el, idx) => {
          const query = el.title + " " + el.artist;
          const result = await videoSearch(query);
          processedQueItems[idx] = {
            title: el.title,
            artist: el.artist,
            video: result,
          };
        })
      );
      await TitleAristVideo.insertMany(processedQueItems, { session });
      const queItemIds = queItems.map((item) => item._id);
      await Que.deleteMany({ _id: { $in: queItemIds } }).session(session);
      await session.commitTransaction();
      session.endSession();
      console.log("que deletion and update are complete");
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      hasMore = false;
      throw error;
    }
  }
};
