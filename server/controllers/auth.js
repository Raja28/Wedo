const User = require("../models/user");
const bcrypt = require('bcrypt')
const OTP = require("../models/otp")
const otpGenerator = require("otp-generator")
const jwt = require("jsonwebtoken")


exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        await OTP.deleteMany({ email });


        let otp;
        let isUnique = false;

        while (!isUnique) {
            otp = otpGenerator.generate(4, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
                digits: true,
            });

            const existing = await OTP.findOne({ otp });
            if (!existing) isUnique = true;
        }


        const newOTP = await OTP.create({ email, otp });

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully. It is valid for 5 minutes.",
            redirectTo: "/verifyEmail",
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to send OTP. Please try again.",
        });
    }
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body


        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "User exists, please login."
            });
        }

        try {
            const encryptedPassword = await bcrypt.hash(password, 10)

            const newUser = await User.create({
                name,
                email,
                password: encryptedPassword
            })

            newUser.password = undefined

            const tokenPayload = {
                _id: newUser._id,
                email: newUser.email
            };
            const expiresIn = 24 * 60 * 60; // 24 hours in seconds
            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn });

            const user = newUser.toObject();
            user.profileImage = `https://api.dicebear.com/5.x/initials/svg?seed=${name}`

            if (newUser) {
                return res.status(201).json({
                    success: true,
                    message: "Signup successful",
                    user,
                    token
                })
            }
        } catch (error) {
            console.log(error);

            return res.status(500).json({
                success: false,
                message: "Error while signingup"
            })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

exports.login = async (req, res) => {

    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email, password required"
            })
        }

        const userExist = await User.findOne({ email: email })
            .populate({
                path: "tasks",
                options: { sort: { createdAt: -1 } },
                populate: [
                    { path: "createdBy", select: "name" },
                    { path: "assignedTo", select: "name" }
                ]
            })
            .populate({
                path: "tasksCreated",
                populate: {
                    path: "assignedTo",
                    select: "name"
                }
            })

        if (!userExist) {
            return res.status(400).json({
                success: false,
                message: "User not registered, Please signUp"
            })
        }

        if (await bcrypt.compare(password, userExist.password)) {

            const tokenPayload = {
                _id: userExist._id,
                email: userExist.email
            }

            const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: "24h" })
            userExist.password = undefined
            const user = userExist.toObject()
            // user.profileImage = `https://api.dicebear.com/5.x/initials/svg?seed=${userExist.name}`

            return res.status(200).json({
                success: true,
                message: "Login Successful",
                user,
                token
            })

        } else {
            return res.status(401).json({
                success: false,
                message: "Invalid password"
            })
        }


    } catch (error) {
        console.log(error)
        res.status(400).json({
            success: false,
            message: "Internal server error"
        })

    }
}