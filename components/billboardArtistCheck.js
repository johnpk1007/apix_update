import BillboardArtistVideo from "../models/billboardArtistVideo.js";

export const billboardArtistCheck = async () => {
  const billboardArtistVideos = await BillboardArtistVideo.find({
    top5songs: {
      $elemMatch: {
        video: "",
      },
    },
  });
  if (billboardArtistVideos.length > 0) {
    return true;
  } else {
    return false;
  }
};
