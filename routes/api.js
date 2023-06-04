const express = require('express')
const router = express.Router()
const auth = require('./auth/auth')
const user = require('./user/user')

router.use('/auth', auth)
router.use('/user', user)

module.exports = router
