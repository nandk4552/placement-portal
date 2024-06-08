const adminModel = require("../models/adminModel");

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

module.exports = {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
};
