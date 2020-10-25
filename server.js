require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");

connectDB();

console.log(process.env.PORT);
//ROUTES
app.use("/api/files", require("./routes/files"));

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
