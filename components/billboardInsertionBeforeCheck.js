import Billboard from "../models/billboard.js";

const sortArr = (arr) => {
  return arr.sort((a, b) => {
    if (a.this_week !== b.this_week) {
      return a.this_week - b.this_week;
    }
    if (a.title !== b.title) {
      return a.title - b.title;
    }
    if (a.artist !== b.artist) {
      return a.artist - b.artist;
    }
    if (a.last_week !== b.last_week) {
      return a.last_week - b.last_week;
    }
    if (a.peak_pos !== b.peak_pos) {
      return a.peak_pos - b.peak_pos;
    }
    if (a.wks_on_chart !== b.wks_on_chart) {
      return a.wks_on_chart - b.wks_on_chart;
    }
  });
};

export const billboardInsertionBeforeCheck = async (data) => {
  const billboardData = await Billboard.find();
  const newBillboardData = billboardData.map((data) => {
    return {
      this_week: data.this_week,
      title: data.title,
      artist: data.artist,
      last_week: data.last_week,
      peak_pos: data.peak_pos,
      wks_on_chart: data.wks_on_chart,
      video: "",
    };
  });
  const sortedData = sortArr(data);
  const sortedNewBillboardData = sortArr(newBillboardData);
  return JSON.stringify(sortedData) === JSON.stringify(sortedNewBillboardData);
};
