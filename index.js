const express = require("express")
const path = require("path")
const app = express()
const mongoose = require("mongoose")
const userRouter = require("./routes/user")
const docRouter = require("./routes/doc")
const appRouter = require("./routes/app")
const cookieParser = require("cookie-parser")
const User = require("./models/user")
const Doctor = require("./models/doc")
const authMiddleware = require("./middleware/auth");


mongoose.connect("mongodb://127.0.0.1:27017/inventory").then(()=> console.log("MongoDB Connected"))
app.set("view engine", "ejs")
app.set("views", path.resolve( "./views"))
app.use(cookieParser()); 
app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.get("/", async (req, res)=>{
    let user = await User.find({})
    let doctor = await Doctor.find({})
    return res.render("home", {user, doctor})
})
app.use("/user", userRouter)
app.use("/doc", docRouter)
app.use("/app", appRouter)

app.listen(8000, ()=> console.log("Server Connected"))
