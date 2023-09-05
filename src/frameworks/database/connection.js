const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose
      .connect(`${process.env.MONGODB_URI}`)
      .then((e) =>
        console.log(`connected to database - ${e.connections[0].name}`)
      );
  } catch (err) {
    console.log(err, process.env.MONGODB_URI);
  }
};

// if (process.env.FAKE_BUCKET) console.log("Faking S3 Bucket");
// else console.log("\nS3 Bucket is active");
// console.log("Enviornment is ", process.env.NODE_ENV);
mongoose.connection
  .on("open", async () => console.log("Mongoose connected successfully"))
  .on("error", async (err) => console.error("mongoose connection error", err));
mongoose.connection.on("disconnected", () => {
  console.log("mongodb disconnected");
});
module.exports = connectDB;
