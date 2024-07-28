const PlacementApplicationModel = require("../models/placementApplicationModel");
const studentModel = require("../models/studentModel");
const placementModel = require("../models/placementModel");

// Function to check if a student is eligible for a placement
const isEligible = (student, eligibilityCriteria) => {
  for (const criteria of eligibilityCriteria) {
    const { key, value, operator } = criteria;

    switch (operator) {
      case "eq":
        if (student[key] !== value) return false;
        break;
      case "gt":
        if (student[key] <= value) return false;
        break;
      case "lt":
        if (student[key] >= value) return false;
        break;
      case "gte":
        if (student[key] < value) return false;
        break;
      case "lte":
        if (student[key] > value) return false;
        break;
      default:
        return false;
    }
  }
  return true;
};

const placementApplicationApply = async (req, res) => {
  try {
    const { userId, placementId } = req.body;
    // Check if the application already exists
    const existingApplication = await PlacementApplicationModel.findOne({
      userId,
      placementId,
    });

    if (existingApplication) {
      return res
        .status(409)
        .json({ message: "Already applied for the placement" });
    }
    // Fetch the student details
    const student = await studentModel.findById({ user: userId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch the placement details
    const placement = await placementModel.findById(placementId);
    if (!placement) {
      return res.status(404).json({ message: "Placement not found" });
    }

    // Check if the student meets the eligibility criteria
    if (!isEligible(student, placement.eligibilityCriteria)) {
      return res
        .status(403)
        .json({ message: "You are not eligible for this placement" });
    }

    // Create and save the new application
    const application = new PlacementApplicationModel({ userId, placementId });
    await application.save();

    return res
      .status(201)
      .json({ message: "Application submitted successfully" });
  } catch (error) {
    console.error("Error submitting application:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// const placementApplicationApply = async (req, res) => {
//   try {
//     const { userId, placementId } = req.body;

//     // Check if the application already exists
//     const existingApplication = await PlacementApplicationModel.findOne({
//       userId,
//       placementId,
//     });

//     if (existingApplication) {
//       return res
//         .status(409)
//         .json({ message: "Already applied for the placement" });
//     }

//     // Create and save the new application
//     const application = new PlacementApplicationModel({ userId, placementId });
//     await application.save();

//     return res
//       .status(201)
//       .json({ message: "Application submitted successfully" });
//   } catch (error) {
//     console.error("Error submitting application:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };
const placementApplicationByUserId = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const applications = await PlacementApplicationModel.find({
      userId,
    }).populate("placementId");
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applied placements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const fetchAllApplications = async (req, res) => {
  const { placementId } = req.params;

  if (!placementId) {
    return res.status(400).json({ message: "Placement ID is required" });
  }

  try {
    // Fetch applications and populate the userId field
    const applications = await PlacementApplicationModel.find({
      placementId,
    }).populate({
      path: "userId",
      select: "rollno _id", // Include rollno and userId (which is the _id)
    });

    // Extract userId and rollno from the applications
    const userIds = applications.map((app) => app.userId._id);
    const rollnos = applications.map((app) => app.userId.rollno);

    // Fetch student details based on userId or rollno
    const students = await studentModel.find({
      $or: [
        { user: { $in: userIds } }, // Use _id (userId) to query
        { rollNumber: { $in: rollnos } }, // Use rollno to query
      ],
    });

    // Format the result to include all relevant student data
    const result = students.map((student) => ({
      userId: student._id,
      rollNumber: student.rollNumber,
      name: student.name,
      branch: student.branch,
      email: student.email,
      alternateEmail: student.alternateEmail,
      mobileNumber: student.mobileNumber,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      firstName: student.firstName,
      middleName: student.middleName,
      lastName: student.lastName,
      sscCgpa: student.sscCgpa,
      sscBoard: student.sscBoard,
      tenthYearOfPass: student.tenthYearOfPass,
      intermediatePercentage: student.intermediatePercentage,
      intermediate: student.intermediate,
      intermediatePassOutYear: student.intermediatePassOutYear,
      btechCourseJoinedThrough: student.btechCourseJoinedThrough,
      emcatEcetRank: student.emcatEcetRank,
      btechPercentage: student.btechPercentage,
      btechCgpa: student.btechCgpa,
      currentBacklogs: student.currentBacklogs,
      caste: student.caste,
      aadharCardNumber: student.aadharCardNumber,
      careerGoal: student.careerGoal,
      passportPhoto: student.passportPhoto,
      interestedIn: student.interestedIn,
      fatherName: student.fatherName,
      motherName: student.motherName,
      parentContactNo: student.parentContactNo,
      parentProfession: student.parentProfession,
      permanentAddress: student.permanentAddress,
      user: student.user,
    }));
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching applications for placement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPlacementDetails = async (req, res) => {
  try {
    const placement = await placementModel.findById(req.params.placementId);
    if (!placement) {
      return res.status(404).json({ message: "Placement not found" });
    }
    res.json(placement);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  placementApplicationApply,
  placementApplicationByUserId,
  fetchAllApplications,
  getPlacementDetails,
};
