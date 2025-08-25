const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
const Doctor = require("../models/doc");

router.get("/signup", (req, res) => {
  return res.render("user_signup");
});
router.get("/login", (req, res) => {
  return res.render("user_login");
});

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("user_signup", { error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "abdullahclg10@gmail.com",
        pass: "sjehhkqsvokxbvnm",
      },
    });

    await transporter.sendMail({
      from: "abdullahclg10@gmail.com",
      to: email,
      subject: "Welcome to Doctor Consult",
      html: `<h2>Hello ${username},</h2>
             <p>Thank you for signing up!</p>`,
    });

    return res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error during signup.");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("user_login", { error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("user_login", { error: "Incorrect Password" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: "user" },
      "123"
    );
    res.cookie("token", token);

    return res.render("home");
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
router.get("/doctor_list", authMiddleware, async (req, res) => {
  if (req.user.role !== "user") return res.render("home",{error: "Access Denied! Only user can access with login "});
  // only users can see doctor list

  let doctor = await Doctor.find({});
  res.render("doctor_list", { doctor }); // send doctors to EJS

//   console.log("===================");
//   console.log(doctor);
});

module.exports = router;
