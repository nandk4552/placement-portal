const express = require("express");
const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
} = require("../controllers/adminController");

const router = express.Router();

// Routes

// Create a new admin
router.post("/create", createAdmin);

//* GET ALL ADMINS  || GET || api/v1/auth//admin/get-all
router.get("/get-all", getAllAdmins);

// Get admin by ID
router.get("/get/:id", getAdminById);

// Update admin
router.put("/update/:id", updateAdmin);

// Delete admin
router.delete("/delete/:id", deleteAdmin);

module.exports = router;
