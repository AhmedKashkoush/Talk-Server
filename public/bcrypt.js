const { hashSync, compareSync } = require('bcrypt')

const hash = data => {
  return hashSync(data, 10)
}

const compare = (plain, encrypted) => {
  return compareSync(plain, encrypted)
}

module.exports = {
  hash,
  compare
}
