const express = require("express");
const Placement = require("../models/placementModel"); // Make sure you have a Placement model defined

const router = express.Router();

module.exports = (io) => {
  router.post("/", async (req, res) => {
    const { title, description, date } = req.body;
    const placement = new Placement({ title, description, date });
    await placement.save();

    // Emit the new placement event to all connected clients
    io.emit("new-placement", placement);

    res.status(201).send(placement);
  });

  router.get("/", async (req, res) => {
    const placements = await Placement.find().sort({ date: -1 });
    res.status(200).send(placements);
  });
  router.post("/apply/:id", async (req, res) => {
    const placementId = req.params.id;
    // Add logic to handle application, e.g., add the student to the placement's applicants list
    res
      .status(200)
      .json({ success: true, message: "Applied successfully: ", placementId });
  });

  return router;
};
