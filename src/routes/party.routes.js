const express = require('express');
const { addParty, viewParty, updateParty, deleteParty } = require('../controllers/party.controller');


const partyRouter = express.Router()

partyRouter.post('/addParty', addParty)
partyRouter.get('/viewParty', viewParty)
partyRouter.put('/updateParty/:id', updateParty)
partyRouter.delete('/deleteParty/:id', deleteParty)


module.exports = partyRouter;