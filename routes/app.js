const express = require("express");
const App = require("../models/app");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// User books appointment
router.post("/book", authMiddleware, async (req, res) => {
  if (req.user.role !== "user") return res.status(403).send("Only users can book appointments");

  const { doctorId, date } = req.body;
  
  let data = await App.create({
    userId: req.user.id,
    doctorId,
    date,
    status: "pending", // default when booked
  });

    // console.log("===============")
    // console.log(data)
  res.redirect("/user/doctor_list");
});

// Doctor accepts appointment
router.post("/accept/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "doctor") return res.status(403).send("Only doctors can accept");

  await App.findByIdAndUpdate(req.params.id, { status: "accepted" });
  res.redirect("/doc/patient_list");
});

// Doctor declines appointment
router.post("/decline/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "doctor") return res.status(403).send("Only doctors can decline");

  await App.findByIdAndUpdate(req.params.id, { status: "declined" });
  res.redirect("/doc/patient_list");
});

module.exports = router;
