const express = require('express')
const { addVote, getResults, getCountedResults, publishResult } = require('../controllers/election.results.controller')

const electionResultsRouter = express.Router()

electionResultsRouter.post('/addVote', addVote)
electionResultsRouter.get('/getResults/:electionId', getResults)
electionResultsRouter.get('/getCountedResults/:electionId', getCountedResults)
electionResultsRouter.put('/publishedResult/:electionId', publishResult)

module.exports = electionResultsRouter