
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { userService, tokenService, fileService, permissionService } = require("../services");
const { oauth2Client } = require("../config/oauthClient");
const { Op } = require("sequelize");

const roleRiskScoreRank = {
    "owner.user":4,
    "organizer.user":3,
    "fileOrganizer.user":3,
    "writer.user":2,
    "commenter.user":1,
    "reader.user":1,
    "owner.anyone":4,
    "organizer.anyone":3,
    "fileOrganizer.anyone":3,
    "writer.anyone":3,
    "commenter.anyone":1,
    "reader.anyone":1
}
const getRiskReport = catchAsync(async(req, res) => {
    const user = req.user
    const userDoc = user
    
    const tokenDoc = await tokenService.findToken({user_id: user.id})
    if (!tokenDoc && !tokenDoc.id) {
        throw Error("User's token not found!")
    }
    
    const files = await fileService.listFiles({access_token: tokenDoc.access_token, refresh_token: tokenDoc.refresh_token})

    const fileData = files.filter(file => {
        return file.permissions ? file.permissions?.some(perm => perm.type === 'anyone'): false;
    }).map(file=> {
        // const amIOwner = file.owners[0].emailAddress === 
        return {
            ...file,
            sharedWith: file.permissions?.length - 1 
        }
    })


    const openWritingFile = files.filter(file => {
        return file.permissions ? file.permissions?.some(perm => perm.type === 'anyone' && perm.role === 'writer'): false;
    }).map(file=> {
        // const amIOwner = file.owners[0].emailAddress === 
        return {
            ...file,
            sharedWith: file.permissions?.length - 1 
        }
    }) 

    const fileTobeCreated = fileData.map(file => {
        return {
            filename: file.name,
            web_view_link: file.webViewLink,
            shared_with: file.sharedWith,
            type: file.mimeType,
            owner: file.owners[0],
            user_id: userDoc.id
        }
    }) 
    
    // const fileExistedData = await fileService.findMultipleFile({user_id: userDoc.id})
    const deletedFileData = await fileService.deleteMultipleFile({user_id: userDoc.id})
    const createdFileData = await fileService.createMultipleFile(fileTobeCreated)
    
    let permissionTobeCreated = []
    createdFileData.map((file, i) => {
        
        fileData[i].permissions.forEach(permission => {
            if (permission.type === 'user') {
                let tempPermisison = {
                    display_name: permission.displayName,
                    email: permission.emailAddress,
                    photo: permission.photoLink,
                    file_id: file.id,
                    drive_user_id: userDoc.id
                }
                permissionTobeCreated.push(tempPermisison)
            }
        })
        
    })

    const deletedPermissionData = await permissionService.deleteMultiplePermission({drive_user_id: userDoc.id})
    const createdPermissionData = await permissionService.createMultiplePermission(permissionTobeCreated)
    
    let permissionsUser = []
    createdPermissionData.forEach(permission => {
        const tempUserExistIndex = permissionsUser.findIndex(user => permission.email === user.email)
        if(tempUserExistIndex > -1){
            permissionsUser[tempUserExistIndex].fileId = [...permissionsUser[tempUserExistIndex].fileId, permission.file_id]
        }else{
            permissionsUser.push({
                email: permission.email,
                display_name: permission.display_name,
                photo: permission.photo,
                fileId: [permission.file_id]
            })
        }
    }) 
    const permissionsUserData = await Promise.all(permissionsUser.map(async(user) => {
        const tempFilesData = await fileService.findMultipleFile({
            id: {
                [Op.in]: user.fileId
            }
        });
        return {
            ...user,
            file: tempFilesData
        }
    })).then(data => { return data})

    let roleRiskArrRes = []
    files.forEach((file, i) => {
        if (file?.permissions?.length) {
            file.permissions.forEach(permission => {
                let tempScore = roleRiskScoreRank[`${permission.role}.${permission.type}`]
                roleRiskArrRes.push(tempScore)
            })
        }
    })
    let totalRiskScore = roleRiskArrRes * 4 
    let actualRiskScore = roleRiskArrRes.reduce((sum, item) => {
        sum + item
    }, 0)
    const percentageRiskScore = (actualRiskScore/totalRiskScore)*100
    res.json({ 
        data: {
            roleRiskArrRes,
            percentageRiskScore,
            userAccessFile: permissionsUserData,
            totalUserAccess: permissionsUserData?.length,
            publicFile: createdFileData,
            totalPublicFile: createdFileData.length, 
            // createdPermissionData, 
        },
        message: "data get successfully"})
})

module.exports = {
    getRiskReport
}