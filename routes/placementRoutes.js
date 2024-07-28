const express = require("express");
const Placement = require("../models/placementModel"); // Ensure you have a Placement model defined
const userModel = require("../models/userModel");
const PlacementApplicationModel = require("../models/placementApplicationModel");
const {
  fetchPlacementsWithStatus,
} = require("../controllers/placementController");

const router = express.Router();

module.exports = (io) => {
  // Create a new placement
  router.post("/", async (req, res) => {
    const { title, description, date, status, eligibilityCriteria } = req.body;
    const placement = new Placement({
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

    // Emit real-time notification
    io.emit("new-placement", placement);

    res.status(201).send(placement);
  });
  
  // Get all placements
  router.get("/", async (req, res) => {
    const placements = await Placement.find().sort({ date: -1 });
    res.status(200).send(placements);
  });

  // Update a placement by ID
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, date, status } = req.body;

    try {
      const placement = await Placement.findByIdAndUpdate(
        id,
        { title, description, date, status },
        { new: true, runValidators: true }
      );
      if (!placement) {
        return res.status(404).send({ message: "Placement not found" });
      }

      io.emit("update-placement", placement);

      res.status(200).send(placement);
    } catch (error) {
      res.status(400).send({ message: "Error updating placement", error });
    }
  });

  // Delete a placement by ID
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
      const placement = await Placement.findByIdAndDelete(id);
      if (!placement) {
        return res.status(404).send({ message: "Placement not found" });
      }

      io.emit("delete-placement", id);

      res.status(200).send({ message: "Placement deleted successfully" });
    } catch (error) {
      res.status(400).send({ message: "Error deleting placement", error });
    }
  });

  // Apply to a placement (optional feature)
  router.post("/apply/:id", async (req, res) => {
    const placementId = req.params.id;
    // Add logic to handle application
    res
      .status(200)
      .json({ success: true, message: "Applied successfully", placementId });
  });

  // Endpoint to get the count of applied users for each placement
  router.get("/applications-count", async (req, res) => {
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
  });

  // /api/v1/placements/:userId
  router.get("/:userId", fetchPlacementsWithStatus);

  return router;
};
