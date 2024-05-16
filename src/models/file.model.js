const { Sequelize, DataTypes, INTEGER } = require('sequelize');
const sequelize = require('../config/database.js');
const { User } = require('./index.js');

const File = sequelize.define("files", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	filename: {
		type: DataTypes.STRING,
		allowNull: false
	},
	web_view_link: {
		type: DataTypes.STRING,
		allowNull: false
	},
	shared_with: {
		type: DataTypes.INTEGER,
		allowNull: false
	},
	type: {
		type: DataTypes.STRING,
		allowNull: false
	},
	owner: {
		type: DataTypes.JSON,
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

User.hasMany(File);
File.belongsTo(User, { foreignKey: 'user_id' });

File.sync({alter:true})
module.exports = File;