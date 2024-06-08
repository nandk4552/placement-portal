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

const router = express.Router();

//* create a new placement data for student || POST || api/v1/student/create
router.post("/create", createStudent);

//* get all students placement data || GET || api/v1/student/get-all
router.get("/get-all", getAllStudents);

//* get student placement data by student _id field || GET || api/v1/student/get-all
router.get("/get-by-student-id/:id", getStudentById);

//* UPDATE student placement data by student _id field || GET || api/v1/student/get-all
router.put("/update/:id", updateStudent);

//* DELETE student placement data by student _id field || GET || api/v1/student/get-all
router.delete("/delete/:id", deleteStudent);

//* get student logged in placement data || GET || api/v1/student/get
router.get("/get", authMiddleware, getLoggedStudent);

//* update student's email, alternative email and password || PUT || api/v1/student/update/details
router.put("/update/only/details", authMiddleware, updateOnlyStudentDetails);
module.exports = router;
