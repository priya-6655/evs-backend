const { DataTypes } = require('sequelize')
const sequelize = require('../config/db')

const Electrolar = sequelize.define("electoral", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    EOUser: {
        type: DataTypes.STRING(25),
        allowNull: false
    },
    EOPassword: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    EOMail: {
        type: DataTypes.STRING(70),
        allowNull: false
    }
}, {
    freezeTableName: true
})

module.exports = Electrolar