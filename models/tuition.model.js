const mongoose = require("mongoose");

const tuitionSchema = mongoose.Schema(
  {
    tuitionSubject: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
      uppercase: true,
    },
    slots: { type: String },
  },
  {
    timestamps: true,
  }
);

const Tuition = mongoose.model("Tuition", tuitionSchema);

module.exports = Tuition;
