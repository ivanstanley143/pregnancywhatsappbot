const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true, // WhatsApp number
    },

    type: {
      type: String,
      required: true,
      enum: [
        "water",
        "meal",
        "dua",
        "week",
        "trimester",
        "appointment",
      ],
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    // extra info (meal name, week number, image, etc.)
    data: {
      type: Object,
      default: {},
    },

    sent: {
      type: Boolean,
      default: false,
    },

    sentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reminder", reminderSchema);
