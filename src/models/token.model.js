const { Sequelize, DataTypes } = require('sequelize');
const { User } = require('./index.js');
const sequelize = require('../config/database.js');

const Token = sequelize.define("tokens", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	access_token: {
		type: DataTypes.STRING,
		required: false,
		allowNull: false
	},
	refresh_token: {
		type: DataTypes.STRING,
		// required: false,
		allowNull: true
	},
	expiry_date: {
		type: DataTypes.BIGINT,
		required: false,
		allowNull: false
	},
	user_id: {
		type:DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: User, // 'Actors' would also work
			key: 'id',
		},
	}
},
{
	indexes: [
		{
			unique: true,
			fields: ['id']
		}],
});


User.hasOne(Token);
Token.belongsTo(User, { foreignKey: 'user_id' });

Token.sync({alter:true})

module.exports = Token;