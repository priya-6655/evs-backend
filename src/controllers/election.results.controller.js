const sequelize = require("../config/db");
const { fn, col } = require("sequelize");
const ElectionResults = require("../model/election.results.model");
const Candidate = require("../model/candidate.model");
const Party = require("../model/party.model");
const Election = require("../model/election.model");


const addVote = async (req, res) => {
    const body = req.body;
    try {
        const checkVoteExists = await ElectionResults.findOne({
            where: {
                userKey: body.userKey,
                electKey: body.electKey
            }
        });
        if (checkVoteExists) {
            res.status(400).json({ message: 'Don’t cast fake votes' });
            return;
        }
        const newVote = await ElectionResults.create(body);
        res.status(201).json(newVote);
    } catch (err) {
        console.error('Vote creation failed:', err.message, err?.original?.sqlMessage || err);
        res.status(500).json({ error: 'Failed to add vote' });
    }
}

const getResults = async (req, res) => {
    const { electionId } = req.params;
    console.log('electionId', electionId)
    try {
        const allResults = await ElectionResults.findAll({
            where: {
                electKey: electionId
            },
            attributes: [
                'candidateKey',
                [fn('COUNT', col('candidateKey')), 'pollingCount']
            ],
            include: [
                {
                    model: Candidate,
                    attributes: ['candiName'],
                    as: 'candidate',
                    include: [{
                        model: Party,
                        attributes: ['partyName'],
                        as: 'party'
                    }]
                },
                {
                    model: Election,
                    attributes: ['electName', 'district', 'constituency'],
                    as: 'election'
                }
            ],
            group: [
                'candidateKey',
                'candiName',
                'partyName',
                'electName',
                'constituency',
                'district'
            ]
        });
        res.status(201).json(allResults);
    } catch (err) {
        console.log('err', err)
        res.status(500).json({ error: 'Failed to get results' });
    }
}

const getCountedResults = async (req, res) => {
    const { electionId } = req.params;

    try {
        const results = await ElectionResults.findAll({
            where: { electKey: electionId },
            attributes: [
                [col('candidate.party.partyName'), 'partyName'],
                [col('election.district'), 'district'],
                [fn('COUNT', col('ElectionResults.candidateKey')), 'totalVotes']
            ],
            include: [{
                model: Candidate,
                as: 'candidate',
                attributes: [],
                include: [{
                    model: Party,
                    as: 'party',
                    attributes: []
                }]
            },
            {
                model: require('../model/election.model'),
                as: 'election',
                attributes: []
            }
            ],
            group: ['candidate.party.partyName', 'election.district'],
            raw: true
        });

        res.json(results);
    } catch (error) {
        console.error('Error fetching counted results:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const publishResult = async (req, res) => {
    try {
        const { electionId } = req.params
        console.log("Received electionId:", electionId);
        const update = await ElectionResults.update(
            { resultPublished: true },
            {
                where: {
                    electKey: electionId
                }
            }
        )
        console.log("Update result:", update);
        res.status(200).json({ message: "Result Published" })
    } catch (error) {
        console.error("Error in publishResult:", error);
        res.status(500).json({ error: error.message })
    }
}


module.exports = { addVote, getResults, getCountedResults, publishResult }