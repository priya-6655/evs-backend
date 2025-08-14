const partyModel = require('../model/party.model')
const candidateModel = require('../model/candidate.model')
const ElectModel = require('../model/election.model')
const { where } = require('sequelize')

const viewpartyWiseCandidate = async (req, res) => {
    const { partyKey } = req.body

    if (!partyKey) {
        return res.status(400).json({ message: "partyKey is required" })
    }

    try {
        const candidate = await candidateModel.findAll({
            where: { partyKey },
            include: [
                {
                    model: partyModel,
                    as: 'party',
                    attributes: ['partyName']
                },
                {
                    model: ElectModel,
                    as: 'election',
                    attributes: ['electName']
                }
            ]
        })
        res.status(200).json({ data: candidate })
    } catch (error) {
        console.log("Error fetching party-wise candidates:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

module.exports = viewpartyWiseCandidate