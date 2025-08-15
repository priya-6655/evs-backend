const ElectoralModel = require('../model/EO.model')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const EOLogin = async (req, res) => {
    const { EOusrname, EOpassword } = req.body

    if (!EOusrname || !EOpassword) {
        return res.status(400).json({
            message: "Missing or invalid parameters"
        })
    }

    try {
        const user = await ElectoralModel.findOne({ where: { EOUser: EOusrname } })

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        else if (EOpassword === EOpassword) {
            return res.status(200).json({
                message: "Login successful"
            })
        }
        else {
            return res.status(401).json({ message: "You are not authorized person" })
        }
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error during login" });
    }
}


const forgotEOPass = async (req, res) => {
    const { token, EOpassword } = req.body

    try {
        const secret = process.env.JWT_SECRET || "Your_jwt_secret_key"
        const decode = jwt.verify(token, secret)
        const email = decode.email

        const response = await ElectoralModel.findOne({ where: { EOMail: email } })
        console.log("Decoded email from token:", email)


        if (!response) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        else if (response) {
            const result = await ElectoralModel.update({ EOPassword: EOpassword }, {
                where: {
                    EOMail: email
                }
            })
            if (result[0] > 0) {
                return res.status(200).json({
                    message: "Password changed successfully"
                })
            } else {
                return res.status(500).json({ message: "Failed to update password" });
            }
        }
    } catch (error) {
        console.error("Password reset error:", error);
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "Reset link expired" });
        }
        res.status(500).json({ message: "Server error during password change" });
    }
}


const resetPassword = async (req, res) => {
    const { email } = req.body
    try {
        const response = await ElectoralModel.findOne({ where: { EOMail: email } })
        if (!response) {
            res.status(404).json({ message: "User not found" })
        }
        else {
            const secret = process.env.JWT_SECRET || "Your_jwt_secret_key"
            const token = jwt.sign({ email }, secret, { expiresIn: '1h' })

            const resetLink = `http://localhost:5173/EoResetPage?token=${token}`

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


const addEO = async (req, res) => {
    try {
        const { EOUser, EOPassword, EOMail } = req.body;
        const newEO = await ElectoralModel.create({ EOUser, EOPassword, EOMail });
        res.status(201).json(newEO);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create EO' });
    }
}
module.exports = { EOLogin, forgotEOPass, resetPassword, addEO }