const Tuition = require("../models/tuition.model");

module.exports.getAllTuitionsServices = async () => {
  return await Tuition.find({});
};

module.exports.postTuitionsServices = async (data) => {
  return await Tuition.create(data);
};
