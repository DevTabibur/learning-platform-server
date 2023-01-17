const express = require("express");
const router = express.Router();
const usersControllers = require("../../controllers/users.controllers");
const uploader = require("../../middleware/uploader");

router.route("/").get(usersControllers.getAllUsers);

router.route("/register").post(usersControllers.createUser);
router.route("/login").post(usersControllers.loginUser);

router.route("/register/:id").get(usersControllers.getRegisterUser);

router
  .route("/:id")
  .get(usersControllers.getAUserByID)
  .delete(usersControllers.deleteUser)
  .put(
    uploader.fields([
      { name: "cover", maxCount: 1 },
      { name: "profile", maxCount: 8 },
    ]),
    usersControllers.updateUser
  );

module.exports = router;
