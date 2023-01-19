const express = require("express");
const router = express.Router();
const tuitionControllers = require("../../controllers/tuitions.controllers");
const verifyToken = require("../../middleware/verifyToken");
const authorization = require("../../middleware/authorization");

router
  .route("/")
  .get(tuitionControllers.getAllTuitions)
  .post(
    verifyToken,
    // authorization("admin, teachers"),
    tuitionControllers.postTuitions
  );

module.exports = router;
