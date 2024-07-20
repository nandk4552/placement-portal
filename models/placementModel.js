const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    date: Date,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Placement", placementSchema);
