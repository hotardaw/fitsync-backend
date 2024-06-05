const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const verifyJWT = require('../middleware/verifyJWT')

// This will enable UserInfo access to these routes
router.use(verifyJWT)

// We're already at /users btw, so:
router
  .route('/:username')
  .get(usersController.getAllUsers)
  .post(usersController.createNewUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser)

module.exports = router
