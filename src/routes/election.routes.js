const express = require('express');
const { addElection, getUpcomingElection, filterElection, editElect, deleteElect } = require('../controllers/election.controller');

const electionRouter = express.Router();

electionRouter.post('/addElection', addElection)

electionRouter.get('/getUpcomingElection', getUpcomingElection)

electionRouter.post('/filterElection', filterElection)

electionRouter.put('/editElect/:id', editElect)

electionRouter.delete('/deleteElect/:id', deleteElect)


module.exports = electionRouter;