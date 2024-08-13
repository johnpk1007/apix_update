import mongoose from "mongoose";

const top5songsSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  peak_pos: {
    type: Number,
  },
  peak_date: {
    type: String,
  },
  wks_on_chart: {
    type: Number,
  },
  video: {
    type: String,
  },
});

const billboardAristSchema = new mongoose.Schema({
  artist: String,
  image: String,
  top5songs: [top5songsSchema],
});

const BillboardArtist =
  mongoose.models.BillboardArtist ||
  mongoose.model("BillboardArtist", billboardAristSchema);

export default BillboardArtist;
