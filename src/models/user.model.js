const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const User = sequelize.define('users', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true
		},
		username: {
            type: DataTypes.STRING
        },
		picture: {
            type: DataTypes.STRING
        },
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '',
		}
  	},
	{
		indexes: [
			{
				unique: true,
				fields: ['email', 'id']
			}],
		toJSON: {
			// exclude: ['password']
		}
	});
User.sync({alter:true})
module.exports = User;