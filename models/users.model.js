const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      validate: [validator.isEmail, "Please Provide a valid Email"],
      trim: true,
      lowercase: true,
      unique: [true, "This Email is already in use"],
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "password at least 6 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minLength: [3, "Name is too short"],
      maxLength: [100, "Name is too large"],
    },
    religion: {
      type: String,
    },
    gender: {
      type: String,
    },
    role: {
      type: String,
      enum: ["teacher", "parents", "students", "others"],
      default: "others",
    },
    bio: {
      type: String,
      trim: true,
    },
    fathersName: {
      type: String,
      trim: true,
    },
    mothersName: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
    },
    userID: {
      type: String,
      trim: true,
    },
    class: {
      type: String,
      trim: true,
    },
    dob: {
      type: String,
    },
    profile: {
      type: String,
      // validate: [validator.isURL, "Please provide a valid image"],
    },
    cover: {
      type: String,
      // validate: [validator.isURL, "Please provide a valid image"],
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive", "blocked"],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  const password = this.password;
  const hashedPassword = bcrypt.hashSync(password);
  (this.password = hashedPassword), (this.confirmPassword = undefined);
  next();
});

userSchema.methods.comparePassword = function (password, hashedPassword) {
  const isPasswordMatched = bcrypt.compareSync(password, hashedPassword);
  return isPasswordMatched;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
