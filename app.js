const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const colors = require("colors");
const errorHandler = require("./middleware/errorHandler");
const usersRoute = require("./routes/v1/users.routes");

// middleware
app.use(cors());
app.use(express.json());
// to get ejs files data
app.use(express.urlencoded({ extended: false }));
// to serve upload folders (images)
app.use(express.static("./upload"));

// routes
app.use("/api/v1/user", usersRoute);










app.get("/", async (req, res) => {
  res.send("Hello WORLD This is a LEARNING PLATFORM SERVER");
});

app.all("*", (req, res) => {
  res.json({ message: "No route is found" });
});
// here is errorHandler function
app.use(errorHandler);

module.exports = app;
