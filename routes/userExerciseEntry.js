const express = require('express')
const router = express.Router()
const userExerciseEntryController = require('../controllers/userExerciseEntryController')
const verifyJWT = require('../middleware/verifyJWT')

// This will enable UserInfo access to these routes
router.use(verifyJWT)

// We're already at /user-exercise-entry btw, so:
router
  .route('/')
  .get(userExerciseEntryController.getUserExerciseEntries)
  .post(userExerciseEntryController.AddUserExerciseEntry)
  .patch(userExerciseEntryController.updateUserExerciseEntry)
  .delete(userExerciseEntryController.deleteUserExerciseEntry)

module.exports = router
