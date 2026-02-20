import mongoose from "mongoose";

const resumeMatchSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  resumeName: String,
  jobDescriptionName: String,

  resumeUrl: String,
  jobDescriptionUrl: String,

  matchDate: {
    type: Date,
    default: Date.now
  },

  matchResultId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "MatchResult"
  }
});

export default mongoose.model("ResumeMatch", resumeMatchSchema);
