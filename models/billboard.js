import mongoose from "mongoose";

const billboardSchema = new mongoose.Schema({
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
});

const Billboard =
  mongoose.models.Billboard || mongoose.model("Billboard", billboardSchema);
export default Billboard;
