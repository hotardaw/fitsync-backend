const express = require('express')
const router = express.Router()
const exerciseController = require('../controllers/exerciseController')
const verifyJWT = require('../middleware/verifyJWT')

// This will enable UserInfo access to these routes
router.use(verifyJWT)

// We're already at /exercises btw, so:
router
  .route('/')
  .get(exerciseController.getAllExercises)
  .post(exerciseController.createNewExercise)
  .patch(exerciseController.updateExercise)
  .delete(exerciseController.deleteExercise)

module.exports = router
