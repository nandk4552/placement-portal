const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");
const studentModel = require("../models/studentModel");
const JWT = require("jsonwebtoken");
const adminModel = require("../models/adminModel");
//* Student Register Controller
const registerController = async (req, res) => {
  try {
    //receoved from frontend
    const { name, email, rollno, year, branch } = req.body;
    //TODO: add specific validation
    if (!name || !email || !rollno || !year || !branch) {
      return res.status(404).send({
        success: false,
        message: "All fields are required",
      });
    }

    //* Check if user already exists
    const existingStudent = await userModel.findOne({ rollno });
    if (existingStudent) {
      return res.status(400).send("Roll Number exists cannot create a student");
    }

    //* Create new user with roll number as default password
    const user = new userModel({
      name,
      email,
      rollno,
      password: rollno, // Set default password as roll number
      year,
      branch,
    });

    //* Save user to database (password will be hashed due to pre-save hook)
    await user.save();

    //* Find the corresponding student and link the user
    const student = await studentModel.findOneAndUpdate(
      { rollNumber: rollno },
      { user: user._id },
      { new: true }
    );
    if (!student) {
      return res.status(404).send({
        success: false,
        message: "Student not found",
      });
    }

    //* success response
    res.status(201).send({
      success: true,
      message: "Student Created successfully",
      user,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//* Student Login Controller
const loginController = async (req, res) => {
  try {
    const { email, rollno, password } = req.body;

    // Validation
    if (!email || !rollno || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the user exists
    const user = await userModel.findOne({ email, rollno });
    if (!user) {
      console.log("User not found with provided email and rollno");
      return res.status(404).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Check password || Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password does not match");
      return res.status(401).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Create a JWT token
    const token = JWT.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Clear sensitive fields
    user.password = undefined;

    // Success message
    res.status(200).send({
      success: true,
      message: "User logged in successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send({
      success: false,
      message: "Error in Login API",
      error: error.message,
    });
  }
};
const adminRegisterController = async (req, res) => {
  try {
    const { name, email, password, branch } = req.body;

    // Check if email already exists
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // If password is not provided, set default password
    const adminPassword = password || "vjit@123";

    // Create new admin
    const admin = new adminModel({
      name,
      email,
      password: adminPassword,
      branch,
    });

    // Save admin to database
    await admin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const adminLoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await adminModel.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT token
    const token = JWT.sign(
      {
        id: admin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Clear sensitive fields
    admin.password = undefined;

    res.status(200).json({
      success: true,
      token,
      admin,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerController,
  loginController,
  adminRegisterController,
  adminLoginController,
};
