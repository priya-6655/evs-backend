const UserModel = require('../model/user.model')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { where } = require('sequelize')
require('dotenv').config()


const userReg = async (req, res) => {
    const {
        firstName,
        lastName,
        userDOB,
        gender,
        street,
        location,
        city,
        state,
        pincode,
        mobile,
        email,
        password
    } = req.body

    if (!firstName || !lastName || !userDOB || !gender || !street || !location || !city || !state || !pincode || !mobile || !email || !password) {
        return res.status(400).json({ message: "All fields are required" })
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        const userRegister = await UserModel.create({
            userid: `EU${Math.floor(100000 + Math.random() * 900000)}`,
            firstName,
            lastName,
            userDOB,
            gender,
            street,
            location,
            city,
            state,
            pincode,
            mobile,
            email,
            password: hashedPassword
        })

        setImmediate(() => {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "priyapakthavachalam6655@gmail.com",
                    pass: "gccs rixq nhpv oqxj"
                }
            })

            const mailOption = {
                from: 'priyapakthavachalam6655@gmail.com',
                to: email,
                subject: 'Welcome to EVS-Your user ID',
                text: `Hi ${firstName},\n\n Thanks for registering on EVS.\n Your User ID is:${userRegister.userid}\n\n Use this ID to log in.\n\n -EVS Team`
            }

            transporter.sendMail(mailOption, (err, info) => {
                if (err) console.error("Mail error:", err);
                else console.log("Mail sent:", info.response);
            })
        })
        return res.status(201).json({ message: "Please check your mail for User ID", data: userRegister })

    } catch (error) {
        console.log("Error fetching data", error?.errors[0]?.message)
        return res.status(500).json({ err: error?.errors[0]?.message || "Failed to register" })
    }
}

const userLogin = async (req, res) => {
    console.log("Request body:", req.body)
    const { userid, password } = req.body

    try {
        const user = await UserModel.findOne({ where: { userid } })
        if (!user) return res.status(404).json({ message: "User not found" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(401).json({ message: "Invalid password" })

        const secret = process.env.JWT_SECRET || "Your_secret_key"
        const token = jwt.sign({ id: user.userid, role: 'Voter' }, secret)

        res.status(200).json({ name: user.firstName, role: 'Voter', token, userid: user.userid, email: user.email })
    } catch (error) {
        res.status(500).json({ message: "Login failed" })
    }
}

// Middleware to extract userid from JWT token
const verifyUserToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "Your_jwt_secret_key");
        console.log("Decoded JWT:", decoded);
        req.userid = decoded.id; // Attach decoded ID to request
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};


const getUserInfo = async (req, res) => {
    try {
        const id = req.userid
        const user = await UserModel.findOne({ where: { userid: id } })

        if (!user) return res.status(404).json({ message: "User not found" })

        const { password, userid, ...safeUser } = user.dataValues
        console.log(id)
        res.status(200).json(safeUser)
    } catch (error) {
        console.log("JWT Error:", error.message)
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
}

const resetUserPassword = async (req, res) => {
    const { email } = req.body
    try {
        const response = await UserModel.findOne({ where: { email: email } })
        if (!response) {
            res.status(404).json({ message: "User not found" })
        }
        else {
            const secret = process.env.JWT_SECRET || "Your_jwt_secret_key"
            const token = jwt.sign({ email }, secret, { expiresIn: '1h' })

            const resetLink = `http://localhost:5173/userResetPassword?token=${token}`

            //mail config
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: "priyapakthavachalam6655@gmail.com",
                    pass: "gccs rixq nhpv oqxj"
                }
            })

            const mailOption = {
                from: "priyapakthavachalam6655@gmail.com",
                to: email,
                subject: 'Password Reset Link - eVoting System',
                html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
            };

            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.error("Error sending mail:", error);
                    return res.status(500).json({ message: "Failed to send reset link" });
                } else {
                    res.status(200).json({ message: "Will send you reset password link in your mail", token: token, resetLink: resetLink })
                }
            })

        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error during password change" });
    }
}

const userForgotPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const secret = process.env.JWT_SECRET || "Your_jwt_secret_key"
        const decode = jwt.verify(token, secret)
        console.log("Decoded Email:", decode.email);
        const email = decode.email

        const response = await UserModel.findOne({ where: { email: email } });

        if (!response) {
            res.status(404).json({
                message: "User not found"
            })
        }
        else if (response) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const results = await UserModel.update({ password: hashedPassword }, {
                where: {
                    email: email
                }
            })
            if (results) {
                return res.status(200).json({
                    message: "Password changed successfully"
                })
            } else {
                res.status(500).json({ message: "Failed to update password" });
            }
        }
    }
    catch (err) {
        console.error("Password reset error:", err);
        if (err.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "Reset link expired" });
        }
        res.status(500).json({ message: "Server error during password change" });
    }
}

module.exports = { userReg, userLogin, getUserInfo, resetUserPassword, userForgotPassword, verifyUserToken }