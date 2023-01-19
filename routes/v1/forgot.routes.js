const express = require("express");
const {
  forgotPassword,
} = require("../../controllers/forgotPassword.controller");
const router = express.Router();

router.route("/").post(forgotPassword);

module.exports = router;
