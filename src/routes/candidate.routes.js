const express = require('express')
const { addCandidatails, viewCandidate, editCandidate, deleteCandi } = require('../controllers/candidate.controller')

const candidateRouter = express.Router()

candidateRouter.post('/addCandidate', addCandidatails)
candidateRouter.get('/viewCandidate', viewCandidate)
candidateRouter.put('/editCandidate/:id', editCandidate)
candidateRouter.delete('/deleteCandi/:id', deleteCandi)



module.exports = candidateRouter