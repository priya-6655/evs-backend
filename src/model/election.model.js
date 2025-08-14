//models.election.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Election = sequelize.define('election', {
    electionid: {
        type: DataTypes.STRING(10),
        primaryKey: true,
    },
    electName: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        unique: true
    },
    district: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    constituency: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    countingDate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    }
})

module.exports = Election