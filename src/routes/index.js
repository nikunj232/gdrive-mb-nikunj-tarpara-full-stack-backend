const express = require('express')
// const  = require('./')
const authRoute = require('./auth.route')
const reportRoute = require('./report.route')

const router = express.Router()

router.use("/auth", authRoute)

router.use("/report", reportRoute)

module.exports = router