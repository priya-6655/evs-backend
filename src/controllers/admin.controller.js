const AdminModel = require('../model/admin.model');
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const AdminLogin = async (req, res) => {
    const { user, pass } = req.body;

    if (user === undefined || pass === undefined) {
        res.status(400).json({
            message: "Missing or invalid parameters"
        })
    }
    try {
        const response = await AdminModel.findOne({ where: { user: user } });
        if (!response) {
            res.status(404).json({
                message: "User not found"
            })
        }
        else if (response && response.password === pass) {
            return res.status(200).json({
                message: "Login successful",
                userName: response.user,
                role: 'Admin'
            })
        }
        else {
            res.status(401).json({ message: "You are not authorized person" })
        }
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
}

const addAddmin = async (req, res) => {
    try {
        const { user, password, email } = req.body;
        const newAdmin = await AdminModel.create({ user, password, email });
        res.status(201).json(newAdmin);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create admin' });
    }
}

const forgotPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const secret = process.env.JWT_SECRET || "Your_jwt_secret_key"
        const decode = jwt.verify(token, secret)
        const email = decode.email

        const response = await AdminModel.findOne({ where: { email: email } });
        if (!response) {
            res.status(404).json({
                message: "User not found"
            })
        }
        else if (response) {
            const results = await AdminModel.update({ password: password }, {
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

const resetPassword = async (req, res) => {
    const { email } = req.body
    try {
        const response = await AdminModel.findOne({ where: { email: email } })
        if (!response) {
            res.status(404).json({ message: "User not found" })
        }
        else {
            const secret = process.env.JWT_SECRET || "Your_jwt_secret_key"
            const token = jwt.sign({ email }, secret, { expiresIn: '1h' })

            const resetLink = `http://localhost:5173/reset-password?token=${token}`

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

const districtList = [
    { id: 1, name: "Ariyalur" },
    { id: 2, name: "Chengalpattu" },
    { id: 3, name: "Chennai" },
    { id: 4, name: "Coimbatore" },
    { id: 5, name: "Cuddalore" },
    { id: 6, name: "Dharmapuri" },
    { id: 7, name: "Dindigul" },
    { id: 8, name: "Erode" },
    { id: 9, name: "Kallakurichi" },
    { id: 10, name: "Kancheepuram" },
    { id: 11, name: "Kanniyakumari" },
    { id: 12, name: "Karur" },
    { id: 13, name: "Krishnagiri" },
    { id: 14, name: "Madurai" },
    { id: 15, name: "Mayiladuthurai" },
    { id: 16, name: "Nagapattinam" },
    { id: 17, name: "Namakkal" },
    { id: 18, name: "Nilgiris" },
    { id: 19, name: "Perambalur" },
    { id: 20, name: "Pudukkottai" },
    { id: 21, name: "Ramanathapuram" },
    { id: 22, name: "Ranipet" },
    { id: 23, name: "Salem" },
    { id: 24, name: "Sivagangai" },
    { id: 25, name: "Tenkasi" },
    { id: 26, name: "Thanjavur" },
    { id: 27, name: "Theni" },
    { id: 28, name: "Thoothukudi" },
    { id: 29, name: "Tiruchirappalli" },
    { id: 30, name: "Tirunelveli" },
    { id: 31, name: "Tirupathur" },
    { id: 32, name: "Tiruppur" },
    { id: 33, name: "Tiruvallur" },
    { id: 34, name: "Tiruvannamalai" },
    { id: 35, name: "Tiruvarur" },
    { id: 36, name: "Vellore" },
    { id: 37, name: "Villupuram" },
    { id: 38, name: "Virudhunagar" }
];

const getDistrictList = async (req, res) => {
    res.status(200).json({ districtList })
}
const constituencies = {
    1: ["Ariyalur", "Jayankondam"],
    2: ["Tambaram", "Pallavaram", "Chengalpattu", "Sholinganallur", "Thiruporur"],
    3: ["Anna Nagar", "Chepauk-Thiruvallikeni", "Egmore", "Egmore", "Mylapore", "Kolathur", "Perambur", "Royapuram", "Saidapet"],
    4: ["Coimbatore North", " Coimbatore South", "Kavundampalayam", "Kinathukadavu", "Mettuppalayam", "Pollachi", "Singanallur", "Sulur", "Thondamuthur"],
    5: ["Bhuvanagiri", "Chidambaram", "Cuddalore", "Kattumannarkoil ", "Kurinjipadi", "Neyveli", "Panruti", "Vriddhachalam"],
    6: ["Dharmapuri", "Harur ", "Palacode", "Pappireddipatti", "Pennagaram"],
    7: ["Athoor", "Dindigul", "Natham", "Nilakkottai ", "Oddanchatram", "Palani"],
    8: ["Anthiyur", "Bhavani", "Bhavanisagar ", "Erode East,", "Erode West", "Gobichettipalayam", "Perundurai "],
    9: ["Kallakurichi ", "Rishivandiyam", "Sankarapuram", "Ulundurpettai"],
    10: ["Alandur", "Kancheepuram", "Sriperumbudur ", "Uthiramerur"],
    11: ["Colachel", "Kanniyakumari", "Killiyoor", "Nagercoil", "Padmanabhapuram", "Vilavancode"],
    12: ["Aravakurichi", "Karur", "Krishnarayapuram ", "Kulithalai"],
    13: ["Bargur", "Hosur", "Krishnagiri", "Thally", "Uthangarai ", "Veppanahalli"],
    14: ["Madurai Central", "Madurai East", "Madurai North", "Madurai South", "Madurai West"],
    15: ["Mayiladuthurai East", "Mayiladuthurai west", "Mayiladuthurai South", "Mayiladuthurai North"],
    16: ["Kilvelur", "Nagapattinam", "Poompuhar", "Sirkazhi ", "Vedharanyam"],
    17: ["Kumarapalayam", "Namakkal", "Paramathivelur", "Senthamangalam ", "Tiruchengodu"],
    18: ["Coonoor", "Gudalur", "Udhagamandalam"],
    19: ["Kunnam", "Perambalur "],
    20: ["Alangudi", "Aranthangi", "Gandarvakottai ", "Pudukottai", "Thirumayam"],
    21: ["Mudukulathur", "Paramakudi ", "Ramanathapuram", "Tiruvadanai"],
    22: ["Arakkonam ", "Arcot", "Ranipet", "Sholinghur"],
    23: ["Attur ", "Edappadi", "Gangavalli ", "Mettur", "Omalur", "Salem North", "Salem South", "Salem West"],
    24: ["Omalur", "Manamadurai ", "Sivagangai", "Tiruppattur"],
    25: ["Alangulam", "Kadayanallur", "Sankarankovil ", "Tenkasi", "Vasudevanallur "],
    26: ["Kumbakonam", "Orathanadu", "Papanasam", "Pattukkottai", "Thanjavur"],
    27: ["Andipatti", "Bodinayakanur", "Cumbum", "Periyakulam "],
    28: ["Kovilpatti", "Ottapidaram ", "Srivaikuntam", "Thoothukudi", "Tiruchendur"],
    29: ["Lalgudi", "Manachanallur", "Manapparai", "Musiri", "Srirangam", "Srirangam", "Tiruchirappalli East", "Tiruchirappalli West"],
    30: ["Ambasamudram", "Nanguneri", "Palayamkottai", "Radhapuram", "Tirunelveli"],
    31: ["Ambur", "Jolarpettai", "Tirupattur", "Vaniyambadi"],
    32: ["Avanashi ", "Dharapuram ", "Kangayam", "Madathukulam", "Palladam", "Tiruppur North", " Tiruppur South", "Udumalaipettai"],
    33: ["Ambattur", "Avadi", "Gummidipoondi", "Madhavaram", "Maduravoyal", "Thiruvallur", "Tiruttani"],
    34: ["Arani", "Chengam ", "Cheyyar", "Kalasapakkam", "Kilpennathur", "Tiruvannamalai"],
    35: ["Mannargudi", "Nannilam", "Thiruthuraipoondi ", "Thiruvarur"],
    36: ["Anaikattu", "Gudiyattam ", "Katpadi", "Kilvaithinankuppam ", "Vellore"],
    37: ["Villupuram", "Tirukkoyilur", "Mailam", "Gingee"],
    38: ["Aruppukkottai", "Rajapalayam", "Sattur", "Sivakasi", "Tiruchuli", "Virudhunagar"]

};

const getConstituencyList = async (req, res) => {
    const id = req.params.id
    const results = constituencies[id]
    res.status(200).json({ results })
}


module.exports = { AdminLogin, addAddmin, forgotPassword, resetPassword, getDistrictList, getConstituencyList }