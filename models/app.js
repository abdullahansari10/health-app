// models/appointment.js
const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "doc", required: true },
  date: { type: Date, required: true },   // user can select date/time
  status: { type: String, default: "pending" } // pending, confirmed, cancelled
});

const App = mongoose.model("app", appointmentSchema);

module.exports = App
