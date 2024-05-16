const { Sequelize, DataTypes, INTEGER } = require('sequelize');
const sequelize = require('../config/database.js');
const { User } = require('./index.js');
const File = require('./file.model.js');

const Permission = sequelize.define("permissions", {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	display_name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	photo: {
		type: DataTypes.STRING,
		allowNull: true,
	},
	file_id: {
		type:DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: File, // 'Actors' would also work
			key: 'id',
		},
	},
	drive_user_id: {
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
        }
	]
});
	
File.hasMany(Permission)
Permission.belongsTo(File, { foreignKey: 'file_id' });

// User.hasMany(File, { foreignKey: 'drive_user_id' });
// Permission.belongsTo(User, { foreignKey: 'drive_user_id' });

Permission.sync({alter: true})
module.exports = Permission;