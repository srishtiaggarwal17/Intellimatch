import ResumeMatch from "../models/ResumeMatch.model.js";
import MatchResult from "../models/MatchResult.model.js";
import User from "../models/User.model.js";
import { analyzeResumeMatch } from "./nlpService.js";

export const saveResumeMatch = async (data) => {
  const match = await ResumeMatch.create(data);

  processAnalysis(match); // async fire & forget

  return match;
};

const processAnalysis = async (resumeMatch) => {
  try {
    const result = await analyzeResumeMatch(
      resumeMatch.resumeUrl,
      resumeMatch.jobDescriptionUrl
    );

    const savedResult = await MatchResult.create(result);

    await ResumeMatch.findByIdAndUpdate(resumeMatch._id, {
      matchResultId: savedResult._id
    });

  } catch (err) {
    await createFailedResult(resumeMatch, err.message);
  }
};

const createFailedResult = async (resumeMatch, error) => {
  const result = await MatchResult.create({
    atsScorePercent: 0,
    summary: "Analysis failed: " + error,
    whatMatched: [],
    whatIsMissing: []
  });

  await ResumeMatch.findByIdAndUpdate(resumeMatch._id, {
    matchResultId: result._id
  });
};
