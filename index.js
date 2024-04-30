const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { env } = require("process");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// const storage = multer.diskStorage({
//     destination(req, file, cb) {
//         // return cb(null, "./resources/images/")
//         return cb(null, 'G:\\Node\\Express\\');
//     },
//     filename(req, file, cb) {
//         return cb(null, `${Date.now()}_${file.originalname}`);
//     },
// });

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, process.env.FILE_PATH));
  },
  filename(req, file, cb) {
    console.log(file);

    cb(null, `deposit_${file.originalname}`);
  },
});

const upload = multer({ storage });

// app.post("/upload", upload.single("file"), (req, res) => {
//   console.log(req.body);
//   console.log(req.file);
//   res.send("successfully uploaded!");
// });

app.post("/upload", upload.single("file"), (req, res) => {
  const fileInfo = req.file;

  if (fileInfo) {
    try {
      res
        .status(200)
        .send({ message: "Uploaded successfully!", value: fileInfo.filename });
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  } else {
    res.status(400).send({ message: "File not provided or upload failed!" });
  }
});

app.get("/download", (req, res) => {
  const location = process.env.DEPOSIT_PATH;
  const filename = req.body.fileName;

  const filePath = path.join(__dirname, location, filename);
  // res.download(`${location}${filename}`, filename);
  res.download(filePath, filename);
});

// app.get("/download", (req, res) => {
//   //   console.log(req.params.name)
//   res.download("G:\\Node\\Express\\1693811648375_Capture.PNG", "abc");
// });

app.delete("/delete", (req, res) => {
  const location = process.env.DEPOSIT_PATH;
  const filename = req.body.fileName;

  const filePath = path.join(__dirname, location, filename);

  if (!filePath) {
    return res.status(400).json({ error: "File path is required" });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File not found" });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: "Unable to delete file" });
    }
    res.status(200).json({ message: "File deleted successfully" });
  });
});

app.listen(4000, () => {
  console.log("Server is running");
});
