const express = require("express");
const axios = require("axios");
const {
  placementApplicationApply,
  placementApplicationByUserId,
  fetchAllApplications,
  getPlacementDetails,
} = require("../controllers/placementApplicationController");
const router = express.Router();

// api/v1/application/placement-applications
//* apply placement for user || post || api/v1/application/placement-applications
router.post("/placement-applications", placementApplicationApply);

//* get user applied application || get || api/v1/application/:userId
router.get("/:userId", placementApplicationByUserId);

//* Fetch All Applications for a Placement (Admin use) || GET || /api/v1/application/placement-applications/placement/:placementId
router.get(
  "/placement-applications/placement/:placementId",
  fetchAllApplications
);

// Route to get placement details by ID || /api/v1/application//placements/:placementId
router.get("/placements/:placementId", getPlacementDetails);

module.exports = router;
