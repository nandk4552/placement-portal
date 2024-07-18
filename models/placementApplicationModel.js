const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placementApplicationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  placementId: { type: Schema.Types.ObjectId, ref: "Placement", required: true },
  appliedAt: { type: Date, default: Date.now }

});

const PlacementApplicationModel = mongoose.model("PlacementApplication", placementApplicationSchema);

module.exports = PlacementApplicationModel;
