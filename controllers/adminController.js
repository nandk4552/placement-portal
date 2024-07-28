const adminModel = require("../models/adminModel");
const bcrypt = require("bcryptjs");
const studentModel = require("../models/studentModel");
// Create admin
const createAdmin = async (req, res) => {
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
    res.status(201).json({ message: "Admin created successfully", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await adminModel.find();
    res.status(200).json({ total: admins.length, admins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin by ID
const getAdminById = async (req, res) => {
  try {
    const admin = await adminModel.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// get admin logged in
const getLoggedInAdminDetails = async (req, res) => {
  try {
    const adminId = req.body.id;
    const admin = await adminModel.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    admin.password = undefined;
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update admin
const updateAdmin = async (req, res) => {
  try {
    const { name, email, branch, usertype, profile } = req.body;

    // Find admin by ID and update fields
    const admin = await adminModel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email,
        branch,
        usertype,
        profile,
      },
      { new: true } // To return the updated admin
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ message: "Admin updated successfully", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  try {
    const admin = await adminModel.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateAdminPasswordController = async (req, res) => {
  try {
    // Find admin by ID
    const admin = await adminModel.findById(req.body.id);

    // Validate if admin exists
    if (!admin) {
      return res.status(404).send({
        success: false,
        message: "Admin not found",
      });
    }

    // Get old and new passwords from the request body
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Please provide both old and new passwords",
      });
    }

    // Check if the old password matches the current password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Invalid old password",
      });
    }

    // Update the admin's password
    admin.password = newPassword;
    await admin.save();

    // Send success response
    return res.status(200).send({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Error in update password API",
      error: error.message,
    });
  }
};

// logic to fetch master data schema keys and their types
const getStudentSchemaKeys = async (req, res) => {
  try {
    const schemaPaths = studentModel.schema.paths;
    const schemaKeys = Object.keys(schemaPaths).filter(
      (key) => key !== "_id" && key !== "__v" && key !== "user"
    );

    const schemaInfo = schemaKeys.map((key) => ({
      key,
      type: schemaPaths[key].instance, // Get the type of the field
    }));

    res.json(schemaInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getLoggedInAdminDetails,
  updateAdminPasswordController,
  getStudentSchemaKeys,
};
