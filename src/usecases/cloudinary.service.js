const cloudinary = require("cloudinary").v2; // Make sure you have the Cloudinary SDK installed and configured
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
const api_key = process.env.CLOUDINARY_API_KEY;
const api_secret = process.env.CLOUDINARY_API_SECRET;
cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});
const uploaded = async (course, thumbnail) => {
  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const courseTitleWithoutSpaces = course.title.trim().replace(/ /g, "-");
    const extension = thumbnail.mimetype.split("/")[1];
    const fileName = `thumbnail/${courseTitleWithoutSpaces}-${uniqueSuffix}.${extension}`;
    const uploadResponse = await cloudinary.uploader.upload(thumbnail.path);

    console.log(
      "Thumbnail uploaded to Cloudinary successfully.",
      uploadResponse
    );

    return fileName;
  } catch (error) {
    console.error("Error while uploading thumbnail to Cloudinary:", error);
    return false;
  }
};
module.exports = {
  uploaded,
};
