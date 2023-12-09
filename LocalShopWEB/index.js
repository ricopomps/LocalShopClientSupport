//--------------------- imports ---------------------
const express = require("express");
require("dotenv").config();
const path = require("path");
//--------------------- Init App ---------------------
const app = express();
const PORT = process.env.PORT || 3000;

//--------------------- Serve Assets ---------------------
app.use(express.static(path.join(__dirname, "build")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(9000);

app.listen(PORT, () => console.log(`Example app running on ${PORT}`));
