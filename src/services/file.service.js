const { google } = require("googleapis");
const { oauth2Client } = require("../config/oauthClient");
const { File, Permission, User } = require("../models");
const { Sequelize, QueryInterface, Op } = require("sequelize");
const sequelize = require("../config/database");


// Function to list files in Google Drive
const listFiles = async (tokens) => {
  let files = [];
  oauth2Client.setCredentials(tokens)
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  
  const params = {
    pageSize: 200, // Adjust as needed
    fields: 'nextPageToken, files(id, name, linkShareMetadata, shared, mimeType, webViewLink, trashed, owners,permissions, createdTime, webContentLink)', // Specify desired fields
  };

  // get file list
  let res = await drive.files.list(params);
  files.push(...res.data.files);
 
    if (files.length) {
      return files
    } else {
      return null
  }
  }

const createMultipleFile = async (fileData) => {
  try {
    const allFileData =  await File.bulkCreate(fileData)
    return allFileData
  } catch (error) {
    console.log(error, "files data error===============");
    return null
  }
}

const findFile = async (query) => {
  try {
    const deletedFileData =  await File.find({
      where: query
    })
    return deletedFileData
    
  } catch (error) {
    console.log(error, "error in delete multiple files");
    return null
  }
}

const findMultipleFile = async (query) => {
  try {
    const findFileData =  await File.findAll({
      where: query
    })
    return findFileData
    
  } catch (error) {
    console.log(error, "error in delete multiple files");
    return null
  }
}

const deleteMultipleFile = async (userId) => {
  try {
    // const deletePermission
    const existFileData = await findMultipleFile({user_id: userId})
    const toBeDeleteFileId = existFileData.map(file => file.id) 
    
    const deletedPermissionData =  await Permission.destroy({
      where: {
        file_id: {
          [Op.in] : toBeDeleteFileId
        }
      }
    })

    const deletedFileData =  await File.destroy({
      where: {
        user_id: userId
      }
    })
    return deletedFileData
    
  } catch (error) { 
    console.log(error, "error in delete multiple files");
    return null
  }
}
// data = [
//   {
//     email: "tarparanikunj232@gmail.com",
//     file: {name, link}
//   },
//   {
//     email: "nayan232@gmail.com",
//     file: {name, link}
//   },
//   {
//     email: "tarparanikunj232@gmail.com",
//     file: {name, link}
//   }
// ]
// data = [
//   {
//     email: "tarparanikunj232@gmail.com",
//     file: [{name, link}, {name, link}]
//   },
//   {
//     email: "nayan232@gmail.com",
//     file: [{name, link}]
//   },
// ]
const userFileAccessList = async (userId) => {
  try {
    const userFile = await Permission.findAll({
      attributes: [
        'email',
        'photo',
        'display_name',
        'email',
        // 'file',
        [Sequelize.fn('COUNT', Sequelize.col('file')), 'count']
      ],
      // include: {
      //   model: File,
      //   as: 'file'
      // },
      group: ['file'], 
      // having: {
      //   count: {
      //     [Op.gt]: 5 // Example condition using the aggregated column count_column3
      //   }
      // }       
    });

    // const data = await sequelize.raw('SELECT * FROM permissions AS permissions')
    // return query;  
    // return data;  
    return userFile;  
  } catch (error) {
    console.log(error, "error inside userfile access list");
    return null
  }
};
module.exports = {
  listFiles,
  createMultipleFile,
  deleteMultipleFile,
  findMultipleFile,
  userFileAccessList
}