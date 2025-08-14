//models.party.js
const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Party = sequelize.define('party', {
    partyid: {
        type: DataTypes.STRING(10),
        primaryKey: true
    },
    partyName: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    leader: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    symbol: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    }
}, {
    freezeTableName: true
})


module.exports = Party