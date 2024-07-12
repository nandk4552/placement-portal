const express = require("express");
const Placement = require("../models/placementModel.js"); // Make sure you have a Placement model defined

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
    const placements = await Placement.find();
    res.status(200).send(placements);
  });

  return router;
};
