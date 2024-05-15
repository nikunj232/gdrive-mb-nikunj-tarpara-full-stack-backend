const express = require('express')
const { reportController } = require('../controllers')
const { auth } = require('../middleware/auth')

const router = express.Router()

router.get(
    "/", 
    auth(),
    reportController.getRiskReport
)

module.exports = router