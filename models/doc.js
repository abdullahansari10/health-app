const mongoose = require("mongoose");

const docSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: String, required: true },
    fees: { type: Number, required: true },
  },
  { timestamps: true }
);

const Doctor = mongoose.model("doc", docSchema);

module.exports = Doctor;
