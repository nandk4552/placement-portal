const express = require("express");
const {
  registerController,
  loginController,
  adminRegisterController,
  adminLoginController,
} = require("../controllers/authController.js");

const router = express.Router();

// Routes
//* STUDENT REGISTER || POST || api/v1/auth//student/register
router.post("/student/register", registerController);

//* STUDENT LOGIN || POST || api/v1/auth//student/login
router.post("/student/login", loginController);

// Routes
//* ADMIN REGISTER || POST || api/v1/auth//admin/register
router.post("/admin/register", adminRegisterController);

//* ADMIN LOGIN || POST || api/v1/auth//admin/login
router.post("/admin/login", adminLoginController);

module.exports = router;
