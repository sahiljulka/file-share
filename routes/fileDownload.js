const router = require("express").Router();
const File = require("../models/file");

router.get("/:uuid", async (req, res) => {
  try {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) {
      return res.render("download", {
        error: "Link has been expired or file not found",
      });
    }
    const filePath = `${__dirname}/../${file.path}`;
    res.download(filePath);
    console.log(filePath);
  } catch (err) {}
});

module.exports = router;
