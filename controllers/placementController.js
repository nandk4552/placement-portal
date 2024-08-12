const PlacementModel = require("../models/placementModel");
const PlacementApplicationModel = require("../models/placementApplicationModel");
const userModel = require("../models/userModel");
const studentModel = require("../models/studentModel");
const ObjectId = require("mongoose").Types.ObjectId;

// Function to check if a student is eligible for a placement
const isEligible = (student, eligibilityCriteria) => {
  if (!student || !eligibilityCriteria) {
    return false;
  }
  for (const criteria of eligibilityCriteria) {
    const { key, value, operator } = criteria;

    // Dynamically access the student's property using the key
    const studentValue =
      typeof student[key] === "string"
        ? student[key]?.toLowerCase()
        : student[key];

    const criteriaValue =
      typeof value === "string" ? value.toLowerCase() : value;

    switch (operator) {
      case "eq":
        if (studentValue !== criteriaValue) return false;
        break;
      case "gt":
        if (studentValue <= criteriaValue) return false;
        break;
      case "lt":
        if (studentValue >= criteriaValue) return false;
        break;
      case "gte":
        if (studentValue < criteriaValue) return false;
        break;
      case "lte":
        if (studentValue > criteriaValue) return false;
        break;
      default:
        return false;
    }
  }
  return true;
};

const createNewPlacement = async (req, res) => {
  const { title, description, date, status, eligibilityCriteria } = req.body;
  const placement = new PlacementModel({
    title,
    description,
    date,
    status,
    eligibilityCriteria,
  });
  await placement.save();

  // Get all users
  const users = await userModel.find();

  // Create a notification
  const notification = {
    title: `${title} Placement Drive`,
    message: `${title} on ${new Date(date).toDateString()}`,
  };

  // Send notification to each user
  for (const user of users) {
    user.notifications.push(notification);
    await user.save();
  }

  res.status(201).send(placement);
};

const getAllPlacements = async (req, res) => {
  const placements = await PlacementModel.find().sort({ date: -1 });
  res.status(200).send(placements);
};

// Controller function to get all placements
const getElgiblePlacements = async (req, res) => {
  const userId = req.userId; // Assumed that userId is obtained from authentication middleware

  try {
    // Validate ObjectId
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    // Fetch student details
    const student = await StudentModel.findOne({ user: userId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch all placements
    const placements = await PlacementModel.find().sort({ date: -1 });

    // Filter placements based on eligibility
    const eligiblePlacements = placements.filter((placement) =>
      isEligible(student, placement.eligibilityCriteria)
    );
    console.log(eligiblePlacements);
    res.status(200).json(eligiblePlacements);
  } catch (error) {
    console.error("Error fetching placements:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updatePlacementByID = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, status, eligibilityCriteria } = req.body;

  try {
    const placement = await PlacementModel.findByIdAndUpdate(
      id,
      { title, description, date, eligibilityCriteria, status },
      { new: true, runValidators: true }
    );
    if (!placement) {
      return res.status(404).send({ message: "Placement not found" });
    }

    res.status(200).send(placement);
  } catch (error) {
    res.status(400).send({ message: "Error updating placement", error });
  }
};
const deletePlacementByID = async (req, res) => {
  const { id } = req.params;

  try {
    const placement = await PlacementModel.findByIdAndDelete(id);
    if (!placement) {
      return res.status(404).send({ message: "Placement not found" });
    }

    res.status(200).send({ message: "Placement deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: "Error deleting placement", error });
  }
};
const getApplicationsCount = async (req, res) => {
  try {
    const counts = await PlacementApplicationModel.aggregate([
      {
        $group: {
          _id: "$placementId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "placements",
          localField: "_id",
          foreignField: "_id",
          as: "placement",
        },
      },
      {
        $unwind: "$placement",
      },
      {
        $project: {
          _id: 1,
          count: 1,
          "placement.title": 1,
        },
      },
    ]);

    res.json(counts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching application counts", error });
  }
};
// !TODO: fetch according to criteria
// Fetch all placements with application status
const fetchPlacementsWithStatus = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Fetch all placements
    const placements = await PlacementModel.find({}).exec();

    // Fetch student details
    const student = await studentModel.findOne({ user: userId }).exec();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch applications by user
    const applications = await PlacementApplicationModel.find({
      userId,
    }).exec();

    const appliedPlacementIds = applications.map((app) =>
      app.placementId.toString()
    );

    // Add 'applied' status to placements
    const placementsWithStatus = placements.map((placement) => ({
      ...placement.toObject(),
      applied: appliedPlacementIds.includes(placement._id.toString()),
      eligible: isEligible(student, placement.eligibilityCriteria),
    }));
    
    res.status(200).json(placementsWithStatus);
  } catch (error) {
    console.error("Error fetching placements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  fetchPlacementsWithStatus,
  createNewPlacement,
  getAllPlacements,
  updatePlacementByID,
  deletePlacementByID,
  getApplicationsCount,
  getElgiblePlacements,
};
