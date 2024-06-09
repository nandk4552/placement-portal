// routes/studentRoutes.js
const express = require("express");
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getLoggedStudent,
  updateOnlyStudentDetails,
} = require("../controllers/studentController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const studentMiddleware = require("../middlewares/studentMiddleware");
const studentModel = require("../models/studentModel");

const router = express.Router();

//* create a new placement data for student || POST || api/v1/student/create
router.post("/create", authMiddleware, adminMiddleware, createStudent);

//* get all students placement data || GET || api/v1/student/get-all
router.get("/get-all", authMiddleware, adminMiddleware, getAllStudents);

//* get student placement data by student _id field || GET || api/v1/student/get-all
router.get(
  "/get-by-student-id/:id",
  authMiddleware,
  adminMiddleware,
  getStudentById
);

//* UPDATE student placement data by student _id field || GET || api/v1/student/get-all
router.put("/update/:id", authMiddleware, adminMiddleware, updateStudent);

//* DELETE student placement data by student _id field || GET || api/v1/student/get-all
router.delete("/delete/:id", authMiddleware, adminMiddleware, deleteStudent);

//* get student logged in placement data || GET || api/v1/student/get
router.get("/get", authMiddleware, studentMiddleware, getLoggedStudent);

//* update student's email, alternative email and password || PUT || api/v1/student/update/details
router.put(
  "/update/only/details",
  authMiddleware,
  studentMiddleware,
  updateOnlyStudentDetails
);
module.exports = router;
