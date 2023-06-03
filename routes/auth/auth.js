const express = require('express')
const router = express.Router()
const {signup,login,sendCode} = require('../../controller/auth_controller')
const signupValidator = require('../../validation/signup_validation')

router.post('/signup',signupValidator,signup)
router.post('/login',login)
router.post('/code-send',sendCode)
// router.post('/verify')

module.exports = router
