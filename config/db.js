require("dotenv").config();
const mongoose = require("mongoose");

function connectDB() {
  console.log(process.env.DB_CONNECTION);
  // DB Conn.
  mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
  });
  const connection = mongoose.connection;

  connection
    .once("open", () => {
      console.log("DB Connected");
    })
    .catch((err) => {
      console.log("Connection failed");
    });
}

module.exports = connectDB;
