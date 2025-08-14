const express = require('express')
const { userReg, userLogin, getUserInfo, resetUserPassword, userForgotPassword, verifyUserToken } = require('../controllers/user.constroller')


const router = express.Router()

router.post('/userReg', userReg)
router.post('/login', userLogin)
router.get('/userProfile', verifyUserToken, getUserInfo)
router.post('/resetUserPassword', resetUserPassword)
router.put('/forgotPassword', userForgotPassword)



module.exports = router