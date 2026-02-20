import axios from "axios";

export const analyzeResumeMatch = async (resumeUrl, jobDescriptionUrl) => {
  try {
    const res = await axios.post(process.env.NLP_API_URL, {
      resumeUrl,
      jobDescriptionUrl
    });

    return res.data;
  } catch (err) {
    console.error("NLP ERROR:", err.message);
    throw err;   // this lets backend know analysis failed
  }
};
