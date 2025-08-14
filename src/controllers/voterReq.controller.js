const VoterRerModel = require('../model/voterReq.model')
const CandidateModel = require('../model/candidate.model')
const { Op } = require('sequelize')

const voterReq = async (req, res) => {
    const {
        userid,
        userName,
        userAge,
        gender,
        district,
        constituency,
        address,
        photo
    } = req.body

    if (!userid || !userName || !userAge || !gender || !district || !constituency || !address || !photo) {
        return res.status(400).json({ message: "All fields are required" })
    }
    try {
        const sendVoterReq = await VoterRerModel.create({
            userid,
            userName,
            userAge,
            gender,
            district,
            constituency,
            address,
            photo
        })
        return res.status(200).json({ message: "Added Succesfully", data: sendVoterReq })
    } catch (error) {
        console.log("Error fetching data", error)
        return res.status(500).json({ error: "Failed to create voter request" })
    }
}

const elctionWiseCandiDetails = async (req, res) => {
    const { electionid } = req.params
    try {
        const candidate = await CandidateModel.findAll({
            where: { ElectKey: electionid },
            include: ['election', 'party'],
        })
        const results = candidate.map(candi => {
            const raw = candi.get({ plain: true });
            const { election, party, ...rest } = raw;

            return {
                candidateName: rest.candiName,
                electName: election?.electName,
                date: election?.date,
                district: election?.district,
                constituency: election?.constituency,
                partyName: party?.partyName
            };
        });

        res.status(200).json({ data: results })
    } catch (error) {
        console.log(error, "Error fetching data")
        res.status(500).json({ message: "Internel server error" })
    }
}

const votingDetails = async (req, res) => {
    const { electionid } = req.params
    console.log("Fetching candidates for electionid:", electionid);
    try {
        const candidates = await CandidateModel.findAll({
            where: { ElectKey: electionid },
            include: ['election', 'party']
        })

        const voteInfo = candidates.map(item => {
            const raw = item.get({ plain: true })
            const { election, party, ...rest } = raw

            return ({
                candidateId: rest.candidateId,
                candidateName: rest.candiName,
                partyId: party?.partyid,
                partyName: party?.partyName,
                symbol: party?.symbol,
                electionId: electionid
            })
        })
        res.status(200).json({ data: voteInfo })
    } catch (error) {
        console.log(error, "Error fetching data")
        res.status(500).json({ message: "Internel server error" })
    }
}

const getVoterListByUserId = async (req, res) => {
    const { userId } = req.params
    try {
        const voterList = await VoterRerModel.findAll({
            where: { userid: userId }
        })


        const voteInfo = voterList.map(item => {
            const raw = item.get({ plain: true })
            const { voterId, ...rest } = raw
            const isApproved = raw.approvedStatus === "1"

            return ({
                ...rest,
                voterId: isApproved ? voterId : ""
            })
        })

        res.status(200).json({ data: voteInfo })
    } catch (error) {
        console.log(error, "Error fetching data")
        res.status(500).json({ message: "Internel server error" })
    }
}

const getAllVoterRequestByStatus = async (req, res) => {
    const { passedStatus } = req.body
    try {
        const voterList = await VoterRerModel.findAll({
            where: { passedStatus: { [Op.in]: passedStatus } }
        })

        res.status(200).json({ data: voterList })
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error })
    }
}

const changeVoterStatus = async (req, res) => {
    const { userid, passedStatus, approvedStatus } = req.body
    try {
        const results = await VoterRerModel.update({
            passedStatus, approvedStatus
        }, {
            where: { userid }
        })

        res.status(200).json({ data: results })
    } catch (error) {
        console.log(error, "Error fetching data")
        res.status(500).json({ message: "Internel server error" })
    }
}

module.exports = { voterReq, elctionWiseCandiDetails, votingDetails, getVoterListByUserId, getAllVoterRequestByStatus, changeVoterStatus }