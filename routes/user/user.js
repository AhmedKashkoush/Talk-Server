const express = require('express')
const router = express.Router()
const {
  uploadPhoto,
  get,
  edit,
  destroy,
  addFriend
} = require('../../controller/user_controller')
const authorization = require('../../middleware/authorization')

// router.use(authorization)

router.post('/:id/upload-photo', authorization, uploadPhoto)
router.get('/:id/', authorization, get)
router.put('/:id/edit', authorization, edit)
router.delete('/:id/delete', authorization, destroy)
router.post('/:id/add-friend/:friendId', authorization, addFriend)

module.exports = router
