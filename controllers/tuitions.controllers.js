const tuitionServices = require("../services/tuitions.services");

module.exports.getAllTuitions = async (req, res, next) => {
  try {
    const result = await tuitionServices.getAllTuitionsServices();
    res.status(200).json({
      status: "success",
      code: 200,
      message: `successfully getting ${result.length} tuitions`,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      code: 400,
      message: "Couldn't get tuitions",
      error: error.message,
    });
  }
};

module.exports.postTuitions = async (req, res, next) => {
  try {
    const result = await tuitionServices.postTuitionsServices(req.body);
    res.status(200).json({
      status: "success",
      code: 200,
      message: `successfully posting tuitions`,
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "failed",
      code: 400,
      message: "Couldn't post tuitions",
      error: error.message,
    });
  }
};
