const userModel = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    //get user
    const user = await userModel.findById(req.body.id);

    //check user is student or not
    if (user.usertype !== "student") {
      return res.status(401).send({
        success: false,
        message: "only student can access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unauthorized access",
      error,
    });
  }
};
