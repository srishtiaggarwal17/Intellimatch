import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFile = (file, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw"
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });

export const uploadResume = (file) => uploadFile(file, "resumes");

export const uploadJobDescription = (file) =>
  uploadFile(file, "job-descriptions");

export const cleanupFiles = async () => {
  // optional – Cloudinary auto handles most cases
};
