const { getAccessToken, getProfileData, getAuthUrl, oauth2Client } = require("../config/oauthClient");
const { userService, tokenService, fileService, permissionService } = require("../services");
const catchAsync = require("../utils/catchAsync")
const {jwtDecode} = require("jwt-decode")

const googleAuth = catchAsync(async (req, res) => {
    const authUrl = getAuthUrl();
    res.redirect(authUrl)
})

const googleAuthCallback = catchAsync(async (req, res) => {
  
    const code = req.query;
    const tokens = await getAccessToken(code);
    // oauth2Client.revokeToken(tokens.access_token)
    
    oauth2Client.setCredentials(tokens)
    const profileData = jwtDecode(tokens.id_token)
    const userData = {
        username: profileData.name,
        email: profileData.email,
        picture: profileData.picture
    }

    let userExist = await userService.getUserByEmail(userData.email)
    if (!userExist) {
        userExist = await userService.createUser(userData)
    }
    
    let tokenExist = await tokenService.findToken({user_id: userExist.id})
    
    if ((tokenExist && !!tokenExist.id && tokenExist.token !== tokens.access_token ) || (tokenExist && !tokenExist.refresh_token)) {
        let tokenData = {}
        if(tokens.access_token) tokenData.access_token = tokens.access_token 
        if(tokens.refresh_token) tokenData.refresh_token = tokens.refresh_token
        updatedTokenData = await tokenService.updateTokenById(tokenExist.id, tokenData)
        tokenExist = await tokenService.findToken({user_id: userExist.id})
    }else {
        const tokenData = {
            access_token: tokens.access_token,
            expiry_date: tokens.expiry_date,
            user_id: userExist.id
        }
        if(tokens.refresh_token) tokenData.refresh_token = tokens.refresh_token ?? null
        tokenExist = await tokenService.createToken(tokenData)
    }
    const authAccessToken = tokenService.generateAuthTokens(userExist)

    res.redirect(process.env.FRONTEND_URL+"risk-report?token=" + authAccessToken)
    
})

const revokeAccess = catchAsync(async (req, res) => {
    const user = req.user;
    const userDoc = user
    const tokenDoc = await tokenService.findToken({user_id: user.id})
    if (!tokenDoc && !tokenDoc?.id) {
        throw Error("User's token not found!")
    }

    oauth2Client.revokeToken(tokenDoc.access_token)
    
    const deletedToken = await tokenService.deleteTokenById(tokenDoc.id)
    const deletedFiles = await fileService.deleteMultipleFile({user_id: user.id})
    const deletedPermission = await permissionService.deleteMultiplePermission({drive_user_id: userDoc.id})
    
    res.json({message: "Acees has been revoked successfully!"})
})

module.exports = {
    googleAuth,
    googleAuthCallback,
    revokeAccess
}