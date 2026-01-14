const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  scheduledAt: {
    type: Date
  },
  data: {
    type: Object,
    default: {}
  },
  sent: {
    type: Boolean,
    default: false
  },
  sentAt: {
    type: Date
  }
});

module.exports = mongoose.model("Reminder", reminderSchema);
