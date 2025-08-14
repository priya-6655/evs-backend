const express = require('express');
const { AdminLogin, addAddmin, forgotPassword, resetPassword, getDistrictList, getConstituencyList } = require('../controllers/admin.controller');

const router = express.Router();

router.post('/adminCreate', addAddmin)
router.post('/adminLogin', AdminLogin)
router.put('/forgotPassword', forgotPassword)
router.post('/resetPassword', resetPassword)
router.get('/districtList', getDistrictList)
router.get('/constituencyList/:id', getConstituencyList)



module.exports = router;