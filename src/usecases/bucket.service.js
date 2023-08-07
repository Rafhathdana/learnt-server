const { s3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const accessKey = process.env.AWS_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_S3_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const bucketRegion = process.env.AWS_S3_BUCKET_REGION;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});
const attachThumbnailURLToCourses = async (courses) => {
  for (let i = 0; i < courses.length; i++) {
    if (!courses[i].thumbnail) {
      console.log(
        "thumbnail key was not found  in The Arg provided - ",
        courses[i]
      );
      return false;
    }
    courses[i] = courses[i].toObject();
    courses[i].thumbnailURL = await getThumbnailURL(courses[i].thumbnail);
  }
  return courses;
};
const uploadThumbnailToBucket = async (course, thumbnail) => {
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const courseTitleWithoutSpaces = course.title.trim().replace(/ /g, "-");
  const extension = thumbnail.mimetype.split("/")[1];
  const fileName = `thumbnail/${courseTitleWithoutSpaces}-${uniqueSuffix}-${extension}`;
  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: thumbnail.buffer,
    ContentType: thumbnail.mimetype,
    Metadata: {
      course: course.title.toString(),
      originalName: thumbnail?.originalname.toString(),
      orginalSize: thumbnail?.size.toString(),
      time: new Date()
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .toString(),
    },
  };
  const command = new PutObjectCommand(params);
  s3.send(cpmmand)
    .then((response) =>
      console.log("Thumbnail uploaded to s3 bucket successfully.")
    )
    .catch((error) => {
      console.log("error while uploading thumbnail to s3" + error);
      return false;
    });
  return filename;
};
const getThumbnailURL = async () => {};
