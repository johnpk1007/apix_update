import mongoose from "mongoose";

const artistPageSchema = new mongoose.Schema({
  artist: {
    type: String,
  },
  page: {
    type: Boolean,
  },
});

const billboardVideoSchema = new mongoose.Schema({
  this_week: {
    type: Number,
  },
  title: {
    type: String,
  },
  artist: {
    type: String,
  },
  last_week: {
    type: Number,
  },
  peak_pos: {
    type: Number,
  },
  wks_on_chart: {
    type: Number,
  },
  video: {
    type: String,
  },
  page: [artistPageSchema],
});

const BillboardVideo =
  mongoose.models.BillboardVideo ||
  mongoose.model("BillboardVideo", billboardVideoSchema);

export default BillboardVideo;
