const sequelize = require('../config/db')
const { DataTypes } = require('sequelize')
const user = require('../model/user.model')

const voterReq = sequelize.define('voterReq', {
    userid: {
        type: DataTypes.STRING(50),
        references: {
            model: user,
            key: "userid"
        }
    },
    userName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    userAge: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    district: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    constituency: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    address: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    photo: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    voterId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    passedStatus: {
        type: DataTypes.ENUM('1', '2', '3'),
        allowNull: true,
        defaultValue: '1'
    },
    approvedStatus: {
        type: DataTypes.ENUM('0', '1'),
        allowNull: true
    },
}, {
    freezeTableName: true
})

user.hasMany(voterReq, { foreignKey: "userid" })

voterReq.belongsTo(user, { foreignKey: "userid" })

module.exports = voterReq