const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      required: true
    },

    category: {
      type: String,
      required: true,
      default: "Other"
    },

    division: {
      type: String,
      enum: ["Personal", "Office"],
      required: true,
      default: "Personal"
    },

    // Optional: explicit date (kept for flexibility)
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true // 🔥 createdAt & updatedAt auto-generated
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
