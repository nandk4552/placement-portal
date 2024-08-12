const express = require("express");
const {
  fetchPlacementsWithStatus,
  createNewPlacement,
  getAllPlacements,
  updatePlacementByID,
  deletePlacementByID,
  getApplicationsCount,
  getElgiblePlacements,
} = require("../controllers/placementController");

const router = express.Router();

// create a new placement for admin use
router.post("/", createNewPlacement);

// Get all placements for admin use
router.get("/", getAllPlacements);

// Get all placements for elgible students based on criteria
router.get("/elgible", getElgiblePlacements);

// Update a placement by ID for admin use
router.put("/:id", updatePlacementByID);

// Delete a placement by ID for admin
router.delete("/:id", deletePlacementByID);

// ? stealth code remove it if not necessary
// Apply to a placement (optional feature)
router.post("/apply/:id", async (req, res) => {
  const placementId = req.params.id;
  // Add logic to handle application
  res
    .status(200)
    .json({ success: true, message: "Applied successfully", placementId });
});

//  get the count of applied users for each placement - admin only
router.get("/applications-count", getApplicationsCount);

// /api/v1/placements/:userId - for elgible students
router.get("/:userId", fetchPlacementsWithStatus);

module.exports = router;
