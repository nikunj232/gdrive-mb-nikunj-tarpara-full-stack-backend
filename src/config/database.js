const Sequelize = require('sequelize');
const env = require('dotenv');
env.config();

const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT
const DB_DATABASE = process.env.DB_DATABASE
const DB_USERNAME = process.env.DB_USERNAME
const DB_PASSWORD = process.env.DB_PASSWORD

// const sequelize = new Sequelize( {
//   dialect: 'postgres',
//   connectionString: process.env.DATABASE_URL,
//   // Other Sequelize options (logging, pool configuration, etc.)
// });
const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  port: 5432,
  dialect: 'postgres',
});

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testDbConnection()
module.exports = sequelize;