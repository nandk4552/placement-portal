const express = require("express");
const {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getLoggedInAdminDetails,
  updateAdminPasswordController,
} = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const { updatePasswordController } = require("../controllers/userController");

const router = express.Router();

// Routes

// Create a new admin
router.post("/create", authMiddleware, adminMiddleware, createAdmin);

//* GET ALL ADMINS  || GET || api/v1/auth//admin/get-all
router.get("/get-all", authMiddleware, adminMiddleware, getAllAdmins);

// Get admin by ID
router.get("/get/:id", getAdminById);

// get logged in admin details
router.get(
  "/get-admin",
  authMiddleware,
  adminMiddleware,
  getLoggedInAdminDetails
);

//* UPDATE PASSWORD || POST || api/v1/admin/update-admin-password
router.post(
  "/update-admin-password",
  authMiddleware,
  adminMiddleware,
  updateAdminPasswordController
);

// Update admin
router.put("/update/:id", authMiddleware, adminMiddleware, updateAdmin);

// Delete admin
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteAdmin);

module.exports = router;
