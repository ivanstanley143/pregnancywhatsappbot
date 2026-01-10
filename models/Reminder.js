const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema({
  user: String,
  type: String,
  scheduledAt: Date,
  data: Object,
  sent: { type: Boolean, default: false },
  sentAt: Date
});

module.exports = mongoose.model("Reminder", reminderSchema);
