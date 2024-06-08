const adminModel = require("../models/adminModel");

module.exports = async (req, res, next) => {
  try {
    //get user
    const admin = await adminModel.findById(req.body.id);

    //check user is tpo or not
    if (admin.usertype !== "tpo") {
      return res.status(401).send({
        success: false,
        message: "only admin can access",
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
