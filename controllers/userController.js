const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// Create nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Function to generate random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

// Function to send OTP to user's email
const sendOTP = async (email, otp) => {
  if (!email || !otp) {
    return;
  }
  try {
    await transporter.sendMail({
      to: email,
      from: process.env.EMAIL,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in sending OTP",
      error,
    });
  }
};
// Controller to handle password reset request
const resetPasswordByOTPController = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;

    // Validation
    if (!email || !newPassword || !otp) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Find user by email
    const user = await userModel.findOne({ email });

    // Validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Invalid email address or answer",
      });
    }

    // Compare OTP from request with OTP saved in the database
    if (otp !== user.otp) {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hashing new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating user's password
    user.password = hashedPassword;

    // Clearing OTP from user document
    user.otp = undefined;

    // Save updated user
    await user.save();

    // Success response
    return res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in reset password API",
    });
  }
};
// Controller to initiate password reset process
const initiatePasswordResetController = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }
    //validation whether this email registered with user
    const exists = await userModel.findOne({ email });
    if (!exists) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP in user document
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not registered",
      });
    }

    user.otp = otp;

    await user.save();

    // Send OTP to user's email
    await sendOTP(email, otp);

    // Success response
    return res.status(200).send({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in initiating password reset",
      error: error.message,
    });
  }
};

const getUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById({ _id: req.body.id });

    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    //hide password
    user.password = undefined;
    //success response
    res.status(200).send({
      success: true,
      message: "User Get Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get user API",
      error,
    });
  }
};

//update user controller
const updateUserController = async (req, res) => {
  try {
    // find user
    const user = await userModel.findById({ _id: req.body.id });

    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    //update user
    const { username, address, phone } = req.body;
    if (username) user.username = username;
    if (address) user.address = address;
    if (phone) user.phone = phone;

    //save user
    await user.save();

    //success response
    return res.status(200).send({
      success: true,
      message: "User Update Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in update user API",
      error,
    });
  }
};

//reset user password controller
const resetPasswordController = async (req, res) => {
  try {
    const { email, newPassword, answer } = req.body;
    //validation
    if (!email || !newPassword || !answer) {
      return res.status(500).send({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await userModel.findOne({ email, answer });
    //validation
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
    //hashing password
    let salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    //updating user password with new encrypted password
    user.password = hashedPassword;

    //save the updated password user
    await user.save();

    //success response
    return res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in reset password API",
      error,
    });
  }
};

// update password
const updatePasswordController = async (req, res) => {
  try {
    //find user
    const user = await userModel.findById({ _id: req.body.id });
    //validation
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    //get data from user
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(500).send({
        success: false,
        message: "please provide a old and new password",
      });
    }

    //check password || compare password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(404).send({
        success: false,
        message: "Invalid old password",
      });
    }
    //update encrypted password
    user.password = newPassword;

    //save the updated password user
    await user.save();
    //success response
    return res.status(200).send({
      success: true,
      message: "Password Update Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in update password API",
      error,
    });
  }
};

// delete user from the database
const deleteUserController = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).send({
        success: false,
        message: "id not found",
      });
    }
    //find user and delete
    await userModel.findByIdAndDelete(id);
    return res.status(200).send({
      success: true,
      message: "your account has been deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in delete user API",
      error,
    });
  }
};

//user photo controller
const userPhotoController = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.uid).select("photo");
    if (user && user.photo.data) {
      // setting the content type of the photo
      res.set("Content-Type", user.photo.contentType);
      // sending the photo
      return res.status(200).send(user.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting user photo",
      error,
    });
  }
};
module.exports = {
  getUserController,
  updateUserController,
  resetPasswordController,
  updatePasswordController,
  deleteUserController,
  resetPasswordByOTPController,
  initiatePasswordResetController,
  userPhotoController,
};
