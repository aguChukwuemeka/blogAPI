// const dotenv = require("dotenv");
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import authRoute from "./routes/auth";
import userRoute from "./routes/users";
import postRoute from "./routes/posts";
import categoryRoute from "./routes/categories";

const app = express();
app.use(express.json());

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true
  })
  .then(() => console.log("connected to mongoDB"))
  .catch((err) => console.log(err));

const imageStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./src/assets/images");
  },
  filename: (req, file, callback) => {
    // callback(null, req.body.name);
    callback(null, `${Date.now()} - ${file.originalname}`);
  },
});

const upload = multer({ storage: imageStorage });

app.post("/api/upload/single", upload.single("file"), (req, res, next) => {
  res.status(200).json("File has been uploaded successfully");
});

app.post("/api/upload/multiple", upload.array("file", 10), (req, res, next) => {
  res.status(200).json("Multiple file has been uploaded successfully");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}`);
});
