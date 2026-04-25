const mongoose = require("mongoose");

// Comment Schema
const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  createdAt: {
    type: Date,
    default: Date.now // ✅ FIXED
  }
});

// Ticket Schema
const ticketSchema = new mongoose.Schema(
  {
    ticketNo: {
      type: Number,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: [true, "Title is required"]
    },
    description: {
      type: String,
      required: [true, "Description is required"]
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    },
    status: {
      type: String,
      enum: ["Open", "In-Progress", "Resolved", "Closed"],
      default: "Open" // ✅ FIXED
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    assignTo: {
      type: String,
      required: true
    },

    assignBy: {
      type: String,
      required: true
    },
    comments: [commentSchema],
    label: [
      {
        type: String // keep simple for now
      }
    ]
  },
  {
    timestamps: true // ✅ AUTO createdAt & updatedAt
  }
);

// ✅ EXPORT MODEL (IMPORTANT CHANGE)
module.exports = mongoose.model("Ticket", ticketSchema);