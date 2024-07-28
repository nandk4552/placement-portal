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
    eligibilityCriteria: [
      {
        key: String,
        value: mongoose.Schema.Types.Mixed,
        operator: {
          type: String,
          enum: ["eq", "gt", "lt", "gte", "lte"],
          default: "eq",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Placement", placementSchema);
