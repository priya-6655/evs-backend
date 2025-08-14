const express = require('express')
const viewpartyWiseCandidate = require('../controllers/partyWiseCandidate.controller')

const partyWiseCandi = express.Router()

partyWiseCandi.post('/partyWiseCandi', viewpartyWiseCandidate)

module.exports = partyWiseCandi