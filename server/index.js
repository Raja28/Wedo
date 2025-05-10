const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
app.use(cors({
    origin: "https://wedo-server.vercel.app",
    credentials: true
}))
require('dotenv').config()
PORT = process.env.PORT || 2026

const { connectDB } = require('./config/database')

const authRoutes = require('./routes/auth')
const userRoutes = require("./routes/user")

app.use("/auth", authRoutes)
app.use("/user", userRoutes)

connectDB()
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "WeDo app running successfully"
    })
})
app.listen(PORT, () => {
    console.log("Wedo server running on port", PORT)
})