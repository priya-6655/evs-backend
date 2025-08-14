const express = require('express')
const { EOLogin, forgotEOPass, resetPassword } = require('../controllers/EO.controller')


const router = express.Router()

router.post('/EOLogin', EOLogin)
router.put('/EOForgotPage', forgotEOPass)
router.post('/resetPassword', resetPassword)

module.exports = router;