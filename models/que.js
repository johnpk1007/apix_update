import mongoose from "mongoose";

const queSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  artist: {
    type: String,
  },
});

const Que = mongoose.models.Que || mongoose.model("Que", queSchema);

export default Que;
