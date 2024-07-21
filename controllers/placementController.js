const PlacementModel = require('../models/placementModel');
const PlacementApplicationModel = require('../models/placementApplicationModel');

// Fetch all placements with application status
const fetchPlacementsWithStatus = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Fetch all placements
    const placements = await PlacementModel.find({}).exec();

    // Fetch applications by user
    const applications = await PlacementApplicationModel.find({ userId }).exec();
    const appliedPlacementIds = applications.map(app => app.placementId.toString());

    // Add 'applied' status to placements
    const placementsWithStatus = placements.map(placement => ({
      ...placement.toObject(),
      applied: appliedPlacementIds.includes(placement._id.toString())
    }));

    res.status(200).json(placementsWithStatus);
  } catch (error) {
    console.error("Error fetching placements:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  fetchPlacementsWithStatus,
};
