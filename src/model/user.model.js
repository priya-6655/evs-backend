const sequelize = require("../config/db");
const { DataTypes, STRING } = require('sequelize')

const User = sequelize.define("user", {
    userid: {
        type: DataTypes.STRING(50),
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    userDOB: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    street: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    city: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    state: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    pincode: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    mobile: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
},
    {
        freezeTableName: true
    })

module.exports = User