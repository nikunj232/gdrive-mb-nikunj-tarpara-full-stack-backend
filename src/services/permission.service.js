const moment = require("moment");
const { Permission } = require("../models");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config()

/**
 * Save a permission
 * @param {string} permission
 * @param {ObjectId} user_id
 * @param {Moment} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Permission>}
 */
const createPermission = async (permissionData) => {
    try {
        const permission = new Permission({
            ...permissionData
        });
        return await permission.save();
    } catch (error) {
        console.log(error, "it's error in save permission function");
        return null
    }
};

const createMultiplePermission = async (permissionData) => {
    try {
      const allPermissionData =  await Permission.bulkCreate(permissionData)
      return allPermissionData
    } catch (error) {
      console.log(error, "files data error===============");
      return null
    }
  }

const findPermissionById = async (id) => {
    const permissionDoc = await Permission.findOne({where: {id}})
    return permissionDoc
}

const findPermission = async (query) => {
    try {
        const permissionDoc = await Permission.findOne({
            where: query
        })
        return permissionDoc
    } catch (error) {
        console.log(error, "There is some error in finding permission!");
        throw Error("Something went wrong!")        
    }
}

const findPermissionByuser_id = async (id) => {
    try {
        const permissionDoc = await Permission.findOne({
            where: {
                drive_user_id: id
            }
        })
        return permissionDoc
    } catch (error) {
        console.log(error, "error in find permission by user id");        
    }
}

const updatePermissionById = async (permissionId, data) => {
    const updatePermission = await Permission.update(data,{
        where: {
          id:permissionId
        }
    });
    return updatePermission;
    
};

const deleteMultiplePermission = async (query) => {
    try {
        const deletedFileData =  await Permission.destroy({
          where: query
        })
        return deletedFileData
    } catch (error) {
        console.log(error, "error in delete multiple permission");
        return null
    }
}

const deletePermissionById = async (query) => {
    const updatePermission = await Permission.destroy({
        where: query
    });
    return updatePermission;  
};

const userFileAccessList = async (query) => {
    const updatePermission = await Permission.destroy({
        where: query
    });
    return updatePermission;  
};

module.exports = {
    createPermission,
    findPermission,
    findPermissionById,
    findPermissionByuser_id,
    updatePermissionById,
    deletePermissionById,
    deleteMultiplePermission,
    createMultiplePermission
}