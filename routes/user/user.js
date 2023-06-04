const express = require('express')
const router = express.Router()
const {
  uploadPhoto,
  get,
  edit,
  destroy
} = require('../../controller/user_controller')
const authorization = require('../../middleware/authorization')

// router.use(authorization)

router.post('/:id/upload-photo', authorization, uploadPhoto)
router.get('/:id/', authorization, get)
router.put('/:id/edit', authorization, edit)
router.delete('/:id/delete', authorization, destroy)

module.exports = router
