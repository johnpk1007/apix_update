import { scrape } from "./scrape.js";
import Billboard from "../models/billboard.js";
import mongoose from "mongoose";
import { billboardInsertionBeforeCheck } from "./billboardInsertionBeforeCheck.js";

export const billboardInsertion = async () => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const results = await scrape();
    const data = results.map((result, idx) => {
      const obj = result;
      obj.this_week = Number(obj.this_week);
      obj.last_week = obj.last_week === "-" ? 0 : Number(obj.last_week);
      obj.peak_pos = Number(obj.peak_pos);
      obj.wks_on_chart = Number(obj.wks_on_chart);
      return obj;
    });

    const result = await billboardInsertionBeforeCheck(data);
    if (result) {
      throw new Error("nothing to update");
    }

    const bulkOperation = data.map((singleData) => ({
      insertOne: { document: singleData },
    }));
    await Billboard.bulkWrite(
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
    console.log("scraping & billboard insertion complete");
    return data;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
