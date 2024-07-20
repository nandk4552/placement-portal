// controllers/studentController.js
const { default: mongoose } = require("mongoose");
const studentModel = require("../models/studentModel");
const userModel = require("../models/userModel");

// Create a new student
const createStudent = async (req, res) => {
  try {
    const student = new studentModel(req.body);
    await student.save();
    res.status(201).send({ success: true, student });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
};

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await studentModel.find();
    res.status(200).send({ success: true, total: students.length, students });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

// Get a single student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await studentModel.findById(req.params.id);
    if (!student) {
      return res
        .status(404)
        .send({ success: false, message: "Student not found" });
    }
    res.status(200).send({ success: true, student });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

// Update a student by ID
const updateStudent = async (req, res) => {
  try {
    const student = await studentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!student) {
      return res
        .status(404)
        .send({ success: false, message: "Student not found" });
    }
    res.status(200).send({ success: true, student });
  } catch (error) {
    res.status(400).send({ success: false, error: error.message });
  }
};

// Delete a student by ID
const deleteStudent = async (req, res) => {
  try {
    const student = await studentModel.findByIdAndDelete(req.params.id);
    if (!student) {
      return res
        .status(404)
        .send({ success: false, message: "Student not found" });
    }
    res
      .status(200)
      .send({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

// get logged in student details
const getLoggedStudent = async (req, res) => {
  try {
    const studentId = req.body.id;
    if (!studentId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized User",
      });
    }
    const user = await userModel.findById(studentId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "student not registered" });
    }

    const student = await studentModel.findOne({ rollNumber: user.rollno });
    if (!student) {
      return res.status(404).send({
        success: false,
        message: "student master data not registered",
      });
    }
    console.log(student);
    res.status(200).send({ success: true, student });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};
const updateOnlyStudentDetails = async (req, res) => {
  try {
    const userId = req.body.id;
    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized User",
      });
    }

    // Validate that userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User not found" });
    }

    // Retrieve student details from request body
    const { email, alternateEmail, mobileNumber } = req.body;

    // Validate input data
    if (!email || !alternateEmail || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Email, alternate email, and mobile number are required",
      });
    }

    // Find the student associated with the user
    const student = await studentModel.findOneAndUpdate(
      { user: userId }, // Use userId instead of user._id
      { email, alternateEmail, mobileNumber },
      { new: true }
    );

    // Check if student exists
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found for the user",
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Student details updated successfully",
      student,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update student master data
const updateStudentDetails = async (req, res) => {
  try {
    const userId = req.body.id;
    if (!userId) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized User",
      });
    }

    // Validate that userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Retrieve all student details from request body
    const {
      rollNumber,
      name,
      branch,
      email,
      alternateEmail,
      mobileNumber,
      dateOfBirth,
      gender,
      firstName,
      middleName,
      lastName,
      sscCgpa,
      sscBoard,
      tenthYearOfPass,
      intermediatePercentage,
      intermediate,
      intermediatePassOutYear,
      btechCourseJoinedThrough,
      emcatEcetRank,
      btechPercentage,
      btechCgpa,
      currentBacklogs,
      caste,
      aadharCardNumber,
      careerGoal,
      passportPhoto,
      interestedIn,
      fatherName,
      motherName,
      parentContactNo,
      parentProfession,
      permanentAddress,
    } = req.body;

    // Validate required fields
    if (!email || !alternateEmail || !mobileNumber) {
      return res.status(400).json({
        success: false,
        message: "Email, alternate email, and mobile number are required",
      });
    }

    // Update all student fields
    const updatedFields = {
      rollNumber,
      name,
      branch,
      email,
      alternateEmail,
      mobileNumber,
      dateOfBirth,
      gender,
      firstName,
      middleName,
      lastName,
      sscCgpa,
      sscBoard,
      tenthYearOfPass,
      intermediatePercentage,
      intermediate,
      intermediatePassOutYear,
      btechCourseJoinedThrough,
      emcatEcetRank,
      btechPercentage,
      btechCgpa,
      currentBacklogs,
      caste,
      aadharCardNumber,
      careerGoal,
      passportPhoto,
      interestedIn,
      fatherName,
      motherName,
      parentContactNo,
      parentProfession,
      permanentAddress,
    };

    // Find the student associated with the user and update
    const student = await studentModel.findOneAndUpdate(
      { user: userId },
      updatedFields,
      { new: true }
    );

    // Check if student exists
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found for the user",
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Student details updated successfully",
      student,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a single student by rollno
const getStudentByRollNo = async (req, res) => {
  try {
    const rollno = req.params.rollno;
    if (!rollno) {
      return res.status(404).send({
        success: false,
        message: "Roll number is required",
      });
    }
    const student = await studentModel.findOne({ rollNumber: rollno });
    if (!student) {
      return res
        .status(404)
        .send({ success: false, message: "Student not found" });
    }
    res.status(200).send({ success: true, student });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
};

const getStudentCount = async (req, res) => {
  try {
    const studentCount = await studentModel.countDocuments();
    console.log(studentCount);
    res.status(200).json({ count: studentCount });
  } catch (error) {
    res.status(500).json({ message: "Error fetching student count", error });
  }
};

module.exports = {
  getStudentCount,
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getLoggedStudent,
  updateOnlyStudentDetails,
  getStudentByRollNo,
  updateStudentDetails,
};
