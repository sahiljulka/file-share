const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");
const file = require("../models/file");

let storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads"),
  filename: (req, file, cb) =>
    cb(
      null,
      `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(
        file.originalname
      )}`
    ),
});

let upload = multer({
  storage,
  limit: {
    fileSize: 100 * 1024 * 1024,
  },
}).single("myfile");

router.post("/", (req, res) => {
  console.log(req.body);
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    if (!req.file) {
      return res.status(500).send({ error: "Make sure to send file" });
    }
    const file = new File({
      filename: req.file.fieldname, 
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

module.exports = router;
