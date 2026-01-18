const mongoose = require("mongoose");

const SentReminderSchema = new mongoose.Schema({
  type: { type: String, required: true }, // water | meal | athaan
  time: { type: String, required: true }, // HH:MM
  date: { type: String, required: true }  // YYYY-MM-DD
}, { timestamps: true });

SentReminderSchema.index({ type: 1, time: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("SentReminder", SentReminderSchema);
