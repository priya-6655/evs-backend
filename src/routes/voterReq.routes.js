const express = require('express')
const { voterReq, elctionWiseCandiDetails, votingDetails, getVoterListByUserId, getAllVoterRequestByStatus, changeVoterStatus } = require('../controllers/voterReq.controller')


const router = express.Router()

router.post("/voterReq", voterReq)
router.get('/electionWiseCandiInfo/:electionid', elctionWiseCandiDetails)
router.get('/votingDetails/:electionid', votingDetails)
router.get('/myVotersList/:userId', getVoterListByUserId)
router.post('/getRequestBystatus', getAllVoterRequestByStatus)
router.put('/changeVoterStatus', changeVoterStatus)

module.exports = router