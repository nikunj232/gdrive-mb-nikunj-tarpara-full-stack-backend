const express = require('express');
const { getAuthUrl, getAccessToken } = require('../config/oauthClient');
const { authController } = require('../controllers');
const { auth } = require('../middleware/auth');

const router = express.Router()

router.get(
    '/google', 
    authController.googleAuth
);

router.get(
    '/google/callback', 
    authController.googleAuthCallback
)

router.delete(
    '/revoke-access',
    auth(),
    authController.revokeAccess
)
  
module.exports = router