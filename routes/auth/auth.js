const express = require('express')
const router = express.Router()
const {sendCode} = require('../../controller/auth_controller')

router.post('/code-send',sendCode)
// router.post('/verify')

module.exports = router
