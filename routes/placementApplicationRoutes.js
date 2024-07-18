const express = require("express");
const axios = require("axios");
const PlacementApplicationModel = require("../models/placementApplicationModel");
const router = express.Router();
router.post("/placement-applications", async (req, res) => {
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
});

//! api not working change the login method
router.get("/applications", async (req, res) => {
  try {
    const applications = await PlacementApplicationModel.find()
      .populate("userId")
      .populate("placementId");

    if (!applications || applications.length === 0) {
      return res.status(404).json({ error: "Applications not found" });
    }

    // Collecting student details
    const students = [];
    for (const app of applications) {
      const rollno = app.userId.rollno; // Assuming rollno is a property of User model
      const studentResponse = await axios.get(
        `http://localhost:8080/api/v1/student/get-by-student-data/${rollno}`
      );
      const student = studentResponse.data;
      if (!student) {
        console.error(`Student not found for rollno ${rollno}`);
        return res
          .status(404)
          .json({ error: `Student not found for rollno ${rollno}` });
      }
      students.push(student);
    }

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching applications details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
