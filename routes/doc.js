const express = require("express");
const bcrypt = require("bcrypt");
const Doctor = require("../models/doc");
const User = require("../models/user");
const App = require("../models/app");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.get("/signup", (req, res) => {
  return res.render("doc_signup");
});
router.get("/login", (req, res) => {
  return res.render("doc_login");
});
// Doctor Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, specialization, experience, fees } = req.body;

  let existingDoctor = await Doctor.findOne({ email });
  if (existingDoctor)
    return res.render("doc_signup", { error: "Email already exist" });

  const hashedPassword = await bcrypt.hash(password, 10);

  await Doctor.create({
    name,
    email,
    password: hashedPassword,
    specialization,
    experience,
    fees,
  });

  res.redirect("/");
});

// Doctor Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const doctor = await Doctor.findOne({ email });
  if (!doctor) return res.render("doc_login", { error: "Doctor not found" });

  const validPassword = await bcrypt.compare(password, doctor.password);
  if (!validPassword)
    return res.render("doc_login", { error: "Incorrect Password" });

  const token = jwt.sign(
    {
      id: doctor._id,
      name: doctor.username,
      role: "doctor",
      specialization: doctor.specialization,
      experience: doctor.experience,
      fees: doctor.fees,
    },
    "123"
  );
  res.cookie("token", token);
  return res.redirect("/doc/patient_list");
});

// Doctor only /doc/
router.get("/patient_list", authMiddleware, async (req, res) => {
  if (req.user.role !== "doctor")
    return res.redirect("/", { error: "Access Denied" });
  // only doctors can see patient list

  const doctor = await Doctor.findById(req.user.id);
  // find appointments for this doctor
  let appointments = await App.find({ doctorId: req.user.id })
    .populate("userId") // so you get user details inside appointment
    .exec();
  res.render("patient_list", { doctor, appointments }); // send doctors to EJS

  console.log("===================");
  console.log(appointments);
});

module.exports = router;
