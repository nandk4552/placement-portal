const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User schema object
const userSchema = new mongoose.Schema(
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
      required: [true, "password is required"],
      default: function () {
        return this.rollno;
      },
    },
    rollno: {
      type: String,
      unique: true,
      required: [true, "Student roll number is required"],
    },
    year: {
      type: String,
      required: [true, "year is required"],
      enum: ["1st", "2nd", "3rd", "4th"],
    },
    branch: {
      type: String,
      required: [true, "branch is required"],
    },
    usertype: {
      type: String,
      required: [true, "user type is required"],
      default: "student",
      enum: ["student"],
    },
    profile: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGTMiqYNrUAciUJyeOwbTgWIqFAqiCV9pfrAUDDGvaCMO65r2pzECyfCbTbWlQBG90cZI&usqp=CAU",
    },
    notifications: [
      {
        title: { type: String, required: true },
        message: { type: String, required: true },
        date: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

// Middleware to hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Export
module.exports = mongoose.model("User", userSchema);
