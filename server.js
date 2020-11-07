require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const path = require("path");

connectDB();

app.use(express.static("public"));
app.use(express.json());
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

//ROUTES
app.use("/", require("./routes/views"));
app.use("/api/files", require("./routes/files"));
app.use("/files", require("./routes/show"));
app.use("/files/download", require("./routes/fileDownload"));

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
