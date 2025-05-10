const mongoose = require("mongoose");
const { otpMailSender } = require("../utils/otpMailSender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60, // 5 minutes
  },
});


otpSchema.pre("save", async function (next) {
  try {
    await otpMailSender(this.email, "WeDo Verification OTP", this.otp);
    next();
  } catch (error) {
    console.error("Error sending OTP email:", error);
    next(error);
  }
});

module.exports = mongoose.model("OTP", otpSchema);

