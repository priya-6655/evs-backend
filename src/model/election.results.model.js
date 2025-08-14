// models/admin.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const voterReq = require('./voterReq.model');
const Party = require('./party.model');
const Candidate = require('./candidate.model');
const Election = require('./election.model');

const ElectionResults = sequelize.define("electionResults", {
    pollingId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userKey: {
        type: DataTypes.STRING(50),
        references: {
            model: User,
            key: "userid"
        }
    },
    voterReqKey: {
        type: DataTypes.INTEGER,
        references: {
            model: voterReq,
            key: "voterId"
        }
    },
    partyKey: {
        type: DataTypes.STRING(50),
        references: {
            model: Party,
            key: "partyid"
        }
    },
    candidateKey: {
        type: DataTypes.STRING(50),
        references: {
            model: Candidate,
            key: "candidateId"
        }
    },
    electKey: {
        type: DataTypes.STRING(50),
        references: {
            model: Election,
            key: "electionid"
        }
    },
    resultPublished: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'electionResults',
    timestamps: false
});


User.hasMany(ElectionResults, { foreignKey: "userKey" })
voterReq.hasMany(ElectionResults, { foreignKey: "voterReqKey" })
Party.hasMany(ElectionResults, { foreignKey: "partyKey" })
Candidate.hasMany(ElectionResults, { foreignKey: "candidateKey" })
Election.hasMany(ElectionResults, { foreignKey: "electKey" })

ElectionResults.belongsTo(User, { foreignKey: "userKey", as: "userid" })
ElectionResults.belongsTo(voterReq, { foreignKey: "voterReqKey", as: "voterId" })
ElectionResults.belongsTo(Party, { foreignKey: "partyKey", as: "party" })
ElectionResults.belongsTo(Candidate, { foreignKey: "candidateKey", as: "candidate" })
ElectionResults.belongsTo(Election, { foreignKey: "electKey", as: "election" })

module.exports = ElectionResults;