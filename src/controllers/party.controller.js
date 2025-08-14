const PartyModel = require('../model/party.model')

const addParty = async (req, res) => {
    const { partyName, leader, symbol } = req.body


    if (!partyName || !leader || !symbol) {
        return res.status(400).json({ message: "All fields are required" });
    }


    try {
        const addpartyData = await PartyModel.create({
            partyid: `EP${Math.floor(100000 + Math.random() * 900000)}`,
            partyName,
            leader,
            symbol
        });
        return res.status(201).json({ message: "Added successfully", data: addpartyData });
    }
    catch (err) {
        console.log("DB Insert Error", err)
        return res.status(500).json({ err: "Failed to create party" })
    }

}

const viewParty = async (req, res) => {
    try {
        const viewPartyData = await PartyModel.findAll()
        res.status(200).json({ data: viewPartyData })
    }
    catch (err) {
        console.log("Error fetching data", err)
        res.status(500).json({ err: "Failed to view party list" })
    }
}

const updateParty = async (req, res) => {
    try {
        const partyid = req.params.id
        const { partyName, leader, symbol } = req.body
        const updated = await PartyModel.update(
            { partyName, leader, symbol },
            { where: { partyid: partyid } }
        )
        if (updated[0] > 0) {
            res.status(200).json({ message: "Party updated successfully" })
        } else {
            res.status(404).json({ message: "Party not found or no changes made" })
        }
    } catch (error) {
        console.error("Error updating party:", error);
        res.status(500).json({ message: "Server error while updating party" });
    }
}

const deleteParty = async (req, res) => {
    const { id } = req.params
    try {
        const delParty = await PartyModel.findOne({ where: { partyid: id } })

        if (!delParty) {
            return res.status(404).json({ message: "Party not found" })
        }

        await delParty.destroy()
        return res.status(200).json({ message: "Party delete successfully" })
    } catch (error) {
        console.log("Delete Error", error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { addParty, viewParty, updateParty, deleteParty }