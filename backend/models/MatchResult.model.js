import mongoose from "mongoose";

const matchDetailSchema = new mongoose.Schema({
  item: String,
  reason: String
}, { _id:false });

const missingDetailSchema = new mongoose.Schema({
  item: String,
  recommendation: String
}, { _id:false });

const matchResultSchema = new mongoose.Schema({
  atsScorePercent: {
    type: Number,
    min: 0,
    max: 100
  },

  summary: String,

  whatMatched: [matchDetailSchema],

  whatIsMissing: [missingDetailSchema]
});

export default mongoose.model("MatchResult", matchResultSchema);
