const CandidateModel = require('../model/candidate.model')
const partyModel = require('../model/party.model')
const ElectModel = require('../model/election.model');
const { Model } = require('sequelize');

const addCandidatails = async (req, res) => {
    console.log("Received candidate body:", req.body);
    const {
        candiName,
        ElectKey,
        partyKey,
        candiDist,
        candiConsti,
        candiDob,
        candiContact,
        candiAddress,
        candiMail
    } = req.body
    if (!candiName || !candiMail || !candiDob || !candiAddress || !candiDist || !candiConsti || !candiContact || !ElectKey || !partyKey) {
        return res.status(400).json({ message: "All fields are required" })
    }
    try {
        const addCandiData = await CandidateModel.create({
            candidateId: `EC${Math.floor(100000 + Math.random() * 900000)}`,
            candiName,
            ElectKey,
            partyKey,
            candiDist,
            candiConsti,
            candiDob,
            candiContact,
            candiAddress,
            candiMail
        })
        return res.status(201).json({ message: "Added Successfully", data: addCandiData })
    }
    catch (err) {
        console.log("Error fetching data", err.message)
        return res.status(500).json({ error: err.message })
    }
}

const viewCandidate = async (req, res) => {
    try {
        const viewCandi = await CandidateModel.findAll({
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
        return res.status(201).json({ data: viewCandi })
    }
    catch (err) {
        console.log(err, "Error fetching data")
        return res.status(500).json({ message: "Failed to view candidate details" })
    }
}

const editCandidate = async (req, res) => {
    try {
        const candidateId = req.params.id;;
        const {
            candiName,
            ElectKey,
            partyKey,
            candiDist,
            candiConsti,
            candiDob,
            candiContact,
            candiAddress,
            candiMail
        } = req.body
        const update = await CandidateModel.update(
            { candiName, ElectKey, partyKey, candiDist, candiConsti, candiDob, candiContact, candiAddress, candiMail },
            { where: { candidateId: candidateId } }
        )

        if (update) {
            res.status(200).json({ message: "Candidate update successfully" })
        } else {
            res.status(404).json({ message: "Candidate not found or no changes made" })
        }
    } catch (error) {
        console.error("Error updating candidate:", error);
        res.status(500).json({ message: "Server error while updating candidate" });
    }
}

const deleteCandi = async (req, res) => {
    const { id } = req.params
    try {
        const delCandi = await CandidateModel.findOne({ where: { candidateId: id } })

        if (!delCandi) {
            return res.status(404).json({ message: "Candidate not found" })
        }

        await delCandi.destroy()
        return res.status(200).json({ message: "Candidate delete successfully" })
    } catch (error) {
        console.error("Delete error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { addCandidatails, viewCandidate, editCandidate, deleteCandi }