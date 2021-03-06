const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const File = require("../models/file");
const { v4: uuid4 } = require("uuid");
const emailTemplate = require("../services/emailTemplate");

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
      createdAt: new Date(),
    });
    const response = await file.save();
    return res.json({
      file: `${process.env.APP_BASE_URL}/files/${response.uuid}`,
    });
  });
});

router.post("/send", async (req, res) => {
  const { uuid, emailTo, emailFrom } = req.body;
  if (!(uuid && emailTo && emailFrom)) {
    return res.status(422).send({ error: "All fields are required" });
  }
  const file = await File.findOne({ uuid: uuid });
  if (!file)
    return res.status(422).send({ error: "File not present or expired" });
  if (file.sender) {
    return res.status(422).send({ error: "Email already Sent" });
  }

  const sendMail = require("../services/emailServices");
  await sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "You Got a new file",
    text: `${emailFrom} shared a file with you`,
    html: emailTemplate({
      emailFrom: emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/files/${uuid}`,
      size: file.size,
      expires: "24 hours",
    }),
  });

  file.sender = emailFrom;
  file.reciever = emailTo;
  const response = await file.save();

  return res.send({ success: true });
});

module.exports = router;
