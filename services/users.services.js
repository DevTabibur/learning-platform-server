const User = require("../models/users.model");


module.exports.findAUserByMailService = async(email) =>{
  return await User.findOne({ email });
}

module.exports.getAllUsersService = async () => {
  return await User.find({});
};

module.exports.createUserService = async (data) => {
  return await User.create(data);
};

module.exports.updateUserService = async (id, data, files) => {
  return await User.updateOne(
    { _id: id },
    {
      $set: {
        gender: data?.gender,
        religion: data?.religion,
        role: data?.role,
        bio: data?.bio,
        fathersName: data?.fathersName,
        mothersName: data?.mothersName,
        phone: data?.phone,
        userID: data?.userID,
        classNumber: data?.class,
        dob: data?.dob,
        cover: files?.cover[0]?.filename,
        profile: files?.profile[0]?.filename,
      },
    }
  );
};

module.exports.deleteUserService = async (id) => {
  console.log("delete user data", id);
  return await User.deleteOne({ _id: id });
};

module.exports.getRegisterUserService = async (id) => {
  return await User.findById({ _id: id });
};

module.exports.getAUserByIDService = async (id) => {
  return await User.findById({ _id: id });
};


