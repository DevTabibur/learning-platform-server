const { ObjectId } = require("mongodb");
const userServices = require("../services/users.services");
const generateToken = require("../utils/generateToken");

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await userServices.getAllUsersService();
    res.status(200).json({
      status: "success",
      code: 200,
      message: `successfully getting ${result.length} users`,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      code: 400,
      error: error.message,
    });
  }
};

module.exports.getRegisterUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: "User is not exists",
      });
    }
    const result = await userServices.getRegisterUserService(id);
    res.status(200).json({
      status: "success",
      code: 200,
      message: `successfully getting this users`,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      code: 400,
      error: error.message,
    });
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const result = await userServices.createUserService(req.body);
    const token = generateToken(result);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "User is registered successfully",
      data: { result, token },
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      code: 400,
      error: error.message,
    });
  }
};

module.exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: "User is not exists",
      });
    }

    const result = await userServices.updateUserService(
      id,
      req.body,
      req.files
    );

    res.status(200).json({
      status: "success",
      code: 200,
      message: `successfully update user`,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      code: 400,
      error: error.message,
    });
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: "User is not exists",
      });
    }
    const result = await userServices.deleteUserService(id);
    res.status(200).json({
      status: "success",
      code: 200,
      message: `successfully deleted user`,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      code: 400,
      error: error.message,
    });
  }
};

module.exports.getAUserByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "failed",
        code: 400,
        message: "User is not exists",
      });
    }
    const result = await userServices.getAUserByIDService(id);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "successfully getting this user",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      code: 400,
      error: error.message,
    });
  }
};

module.exports.getUserByEmail = async (req, res, next) => {
  try {
    const { email } = req.params;
    console.log("getUserByEmail", email);
  } catch (error) {}
};



//  for login routes, here is few steps
/**
 *1. Check if email & password are given
 *2. Load user with email
 *3. if not user, send res
 *4. compare password,
 *5. if password not correct, send res
 *6. check if user is active
 *7. if not active send res
 *8. generate token
 *9. send user and token
 */
 module.exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        status: "failed",
        code: 401,
        error: "Please provide your email & password",
      });
    }

    // checking if user is already in our db, or not?
    const userExists = await userServices.findAUserByMailService(email)
    if (!userExists) {
      return res.status(401).json({
        status: "failed",
        code: 401,
        error: "No user found. Please create an account",
      });
    }

    const isPasswordMatched = userExists.comparePassword(
      password,
      userExists.password
    );

    if (!isPasswordMatched) {
      return res.status(403).json({
        status: "failed",
        code: 403,
        error: "Password is not correct",
      });
    }

    if (userExists.status != "active") {
      return res.status(401).json({
        status: "failed",
        code: 401,
        error: "Your'e account is not active yet",
      });
    }

    const token = generateToken(userExists);
    const { password: pwd, ...others } = userExists.toObject();

    res.status(200).json({
      status: "success",
      code: 200,
      message: "successfully logged in",
      data: { user: others, token },
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      code: 400,
      message: "Couldn't login",
      error: err.message,
    });
  }
};