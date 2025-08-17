const ElectModel = require('../model/election.model')
const { Op } = require('sequelize')

const addElection = async (req, res) => {

    const { electName, district, date, constituency, countingDate } = req.body;

    if (!electName || !district || !date || !constituency || !countingDate) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const addElect = await ElectModel.create({
            electionid: `EL${Math.floor(100000 + Math.random() * 900000)}`,
            electName,
            date,
            district,
            constituency,
            countingDate
        });
        res.status(201).json({ message: "Added successfully", data: addElect });
    }
    catch (err) {
        console.log("DB insert error:", err?.errors[0]?.message)
        res.status(500).json({ err: 'Failed to create election', message: err?.errors[0]?.message || err?.message });
    }
}

const getUpcomingElection = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]
        const upcoming = await ElectModel.findAll({
            where: {
                date: {
                    [Op.gte]: today
                }
            },
            order: [['date', 'ASC']]
        });
        res.json({ data: upcoming })
    } catch (err) {
        console.log("Error fetching elections", err)
        res.status(500).json({ message: "Failed to fetch election data" })
    }
}

const filterElection = async (req, res) => {
    const { startDate, endDate } = req.body

    if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start and End dates are required" })
    }

    try {
        const allElection = await ElectModel.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            order: [['date', 'ASC']]
        })
        res.status(200).json({ data: allElection })
    } catch (error) {
        console.log("Error fetching election data", error)
        res.status(500).json({ message: "Failed to fetch election data" })
    }
}

const editElect = async (req, res) => {
    try {
        const electionid = req.params.id
        const { electName, district, date, constituency, countingDate } = req.body;
        const update = await ElectModel.update(
            { electName, district, date, constituency, countingDate },
            { where: { electionid: electionid } }
        )

        if (update) {
            res.status(200).json({ message: "Election update successfully" })
        } else {
            res.status(404).json({ message: "Election not found or no changes made" })
        }

    } catch (error) {
        console.error("Error updating election:", error);
        res.status(500).json({ message: "Server error while updating election" });
    }
}

const deleteElect = async (req, res) => {
    const { id } = req.params
    try {
        const delElect = await ElectModel.findOne({ where: { electionid: id } })

        if (!delElect) {
            return res.status(404).json({ message: "Election not found" })
        }

        await delElect.destroy()
        return res.status(200).json({ message: "Election delete successfully" })
    } catch (error) {
        console.log("Delete Error", error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getVotedElection = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0]
        const current = await ElectModel.findAll({
            where: {
                countingDate: {
                    [Op.eq]: today
                }
            },
            order: [['date', 'ASC']]
        });
        res.json({ data: current })
    } catch (err) {
        console.log("Error fetching elections", err)
        res.status(500).json({ message: "Failed to fetch election data" })
    }
}


module.exports = { addElection, getUpcomingElection, filterElection, editElect, deleteElect, getVotedElection };