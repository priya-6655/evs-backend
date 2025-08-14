//model.candidate.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')
const Election = require('../model/election.model')
const Party = require('../model/party.model')


const Candidate = sequelize.define("candidate", {
    candidateId: {
        type: DataTypes.STRING(20),
        primaryKey: true
    },
    candiName: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    ElectKey: {
        type: DataTypes.STRING(20),
        references: {
            model: Election,
            key: "electionid"
        }
    },
    partyKey: {
        type: DataTypes.STRING(20),
        references: {
            model: Party,
            key: "partyid"
        }
    },
    candiDist: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    candiConsti: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    candiDob: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    candiContact: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    candiAddress: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    candiMail: {
        type: DataTypes.STRING(30),
        allowNull: false
    }

},
    {
        freezeTableName: true
    })


Election.hasMany(Candidate, { foreignKey: "ElectKey" })
Party.hasMany(Candidate, { foreignKey: "partyKey" })

Candidate.belongsTo(Election, { foreignKey: "ElectKey", as: "election" })
Candidate.belongsTo(Party, { foreignKey: "partyKey", as: "party" })



module.exports = Candidate