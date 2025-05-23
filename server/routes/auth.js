const express = require('express')
const { sendOTP, signup, login } = require('../controllers/auth')
const router = express.Router()


router.post("/send-otp", sendOTP)
router.post("/signup", signup)
router.post("/login", login)

module.exports = router