const { check } = require('express-validator')

const validators = [
  check('name')
    .exists()
    .withMessage('name required')
    .not()
    .isEmpty()
    .withMessage('name must not be empty')
    .isLength({ min: 5 })
    .trim()
    .withMessage('name must be at least 5 characters'),
  check('birth')
    .exists()
    .withMessage('birthdate required')
    .not()
    .isEmpty()
    .withMessage('birthdate must not be empty')
    .not()
    .isDate()
    .trim()
    .withMessage('invalid date format'),
  check('gender')
    .exists()
    .withMessage('gender required')
    .not()
    .isEmpty()
    .withMessage('gender must not be empty'),
  check('email')
    .exists()
    .withMessage('email required')
    .isEmail()
    .trim()
    .withMessage('invalid email'),
  check('phone')
    .exists()
    .withMessage('phone required')
    .not()
    .isEmpty()
    .withMessage('phone must not be empty')
    .isMobilePhone()
    .trim()
    .withMessage('invalid phone number'),
  check('password')
    .exists()
    .withMessage('password required')
    .not()
    .isEmpty()
    .withMessage('password must not be empty')
    .isLength({ min: 8 })
    .trim()
    .withMessage('password must be at least 8 characters')
    .isStrongPassword()
    .withMessage('password must contain [A-Z], [a-z], [0-9] and symbols')
]

module.exports = validators
