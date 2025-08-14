const mysql = require('mysql2');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const {
    DATABASE_NAME,
    DB_USER_NAME,
    DB_USER_PASSWORD,
    DB_HOST,
    DB_PORT
} = process.env;
console.log('DATABASE_NAME', DATABASE_NAME)
const sequelize = new Sequelize(DATABASE_NAME, DB_USER_NAME, DB_USER_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false,
    port: DB_PORT
});

//  const dbConnection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'Root',
//     database: 'evsproject'
// });


module.exports = sequelize;