const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// admin schema object
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      default: "vjit@123",
    },
    branch: {
      type: String,
      required: [true, "branch is required"],
    },
    usertype: {
      type: String,
      required: [true, "user type is required"],
      default: "tpo",
      enum: ["tpo"],
    },
    profile: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGTMiqYNrUAciUJyeOwbTgWIqFAqiCV9pfrAUDDGvaCMO65r2pzECyfCbTbWlQBG90cZI&usqp=CAU",
    },
  },
  { timestamps: true }
);

// Middleware to hash password before saving
adminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Export
module.exports = mongoose.model("Admin", adminSchema);
