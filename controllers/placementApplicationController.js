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
    const applications = await PlacementApplicationModel.find({
      placementId,
    }).populate("userId");
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications for placement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  placementApplicationApply,
  placementApplicationByUserId,
  fetchAllApplications,
};
