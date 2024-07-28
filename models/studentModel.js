const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  branch: String,
  email: String,
  alternateEmail: String,
  mobileNumber: String,
  dateOfBirth: Date,
  gender: String,
  firstName: String,
  middleName: String,
  lastName: String,
  sscCgpa: Number,
  sscBoard: String,
  tenthYearOfPass: Number,
  intermediatePercentage: String,
  intermediate: String,
  intermediatePassOutYear: Number,
  btechCourseJoinedThrough: String,
  emcatEcetRank: Number,
  btechPercentage: String,
  btechCgpa: String,
  currentBacklogs: Number,
  caste: String,
  aadharCardNumber: String,
  careerGoal: String,
  passportPhoto: String,
  interestedIn: String,
  fatherName: String,
  motherName: String,
  parentContactNo: String,
  parentProfession: String,
  permanentAddress: String,
  resume: String,
  joined: Date,
  passout: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Student", studentSchema);
