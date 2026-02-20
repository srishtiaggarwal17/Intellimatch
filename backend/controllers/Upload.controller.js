import ResumeMatch from "../models/ResumeMatch.model.js";
import User from "../models/User.model.js";
import { uploadResume, uploadJobDescription, cleanupFiles } from "../services/fileUploadService.js";
import { saveResumeMatch } from "../services/resumeMatchService.js";

export const uploadFiles = async (req, res) => {
  try {
    const { resume, jobDescription } = req.files;
    const userId = req.id;

    if (!resume || !jobDescription)
      return res.status(400).json("Both files required");

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(resume[0].mimetype) ||
        !allowedTypes.includes(jobDescription[0].mimetype)) {
      return res.status(400).json("Only PDF and DOCX allowed");
    }

    let resumeUrl, jdUrl;

    try {
      resumeUrl = await uploadResume(resume[0]);
      jdUrl = await uploadJobDescription(jobDescription[0]);

      // const savedMatch = await ResumeMatch.create({
      //   userId,
      //   resumeName: resume[0].originalname,
      //   jobDescriptionName: jobDescription[0].originalname,
      //   resumeUrl,
      //   jobDescriptionUrl: jdUrl
      // });
      const savedMatch = await saveResumeMatch({
  userId,
  resumeName: resume[0].originalname,
  jobDescriptionName: jobDescription[0].originalname,
  resumeUrl,
  jobDescriptionUrl: jdUrl
});


      await User.findByIdAndUpdate(userId, {
        $push: { history: savedMatch._id }
      });

      res.json(savedMatch);

    } catch (err) {
      await cleanupFiles(resumeUrl, jdUrl);
      throw err;
    }

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
