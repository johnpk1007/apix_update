import mongoose from "mongoose";

const titleArtistVideoSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  artist: {
    type: String,
  },
  video: {
    type: String,
  },
});

const TitleArtistVideo =
  mongoose.models.TitleAristVideo ||
  mongoose.model("TitleAristVideo", titleArtistVideoSchema);

export default TitleArtistVideo;
