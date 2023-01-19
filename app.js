const express = require("express");
const app = express();

const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const colors = require("colors");
const ejs = require("ejs");


// exporters
const errorHandler = require("./middleware/errorHandler");
const usersRoute = require("./routes/v1/users.routes");
const tuitionRoute = require("./routes/v1/tuition.routes");
const forgotRoute = require("./routes/v1/forgot.routes");
const resetRoute = require("./routes/v1/reset.routes")

// middleware
app.use(cors());
app.use(express.json());
// to get ejs files data
// for ejs engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
// to serve upload folders (images)
app.use(express.static("./upload"));

// routes
app.use("/api/v1/user", usersRoute);
app.use("/api/v1/tuition", tuitionRoute);

// +++++++++++Forgot Password++++++++++++
app.use("/api/v1/forgot-password", forgotRoute);
app.use("/api/v1/reset-password", resetRoute);

app.get("/", async (req, res) => {
  res.send("Hello WORLD This is a LEARNING PLATFORM SERVER");
});

app.all("*", (req, res) => {
  res.json({ message: "No route is found" });
});
// here is errorHandler function
app.use(errorHandler);

module.exports = app;
