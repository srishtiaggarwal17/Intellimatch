import express from "express";
import multer from "multer";
import { uploadFiles } from "../controllers/Upload.controller.js";
import isAuthenticated  from "../middleware/auth.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
  "/",
  isAuthenticated,
  upload.fields([
    { name: "resume", maxCount: 1 },
    { name: "jobDescription", maxCount: 1 }
  ]),
  uploadFiles
);

export default router;
