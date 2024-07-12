const mongoose = require("mongoose");

const placementSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
},
{ timestamps: true });

module.exports = mongoose.model("Placement", placementSchema);
