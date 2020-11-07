const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, require: true },
    uuid: { type: String, required: true },
    sender: { type: String, required: false },
    reciever: { type: String, required: false },
    createdAt: { type: String, required: false },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("File", fileSchema);
