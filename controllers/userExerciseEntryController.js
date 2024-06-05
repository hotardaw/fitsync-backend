const mongoose = require('mongoose')
const exerciseController = require('./exerciseController')
const usersController = require('./usersController')
const User = require('../models/User')
const Exercise = require('../models/Exercise')

// @desc Get all user exercise entries
// @route GET /user-exercise-entry
// @access Private

// const userId = req.user.id // assumes we have a way to get user id from request
// should this be global?

// make the getter able to req single days by timestamp
// make getter able to req single users by username or email
// allow admin to see all users' exercise logs
const getUserExerciseEntries = async (req, res) => {
  try {
    // is this timestamp the one assigned to the exercise log or the one the user is searching for?
    // also make the search timestamp date-only
    const currentUserId = req.user._id
    const { timestamp, exercise } = req.body
    let query = {}

    // filters
    if (!userid /* && role not admin */)
      return res.status(400).json({ message: 'Request must include a user ID' })
    if (timestamp) query.timestamp = timestamp
    if (exercise) query.exercise = exercise

    const userExerciseEntries = await userExerciseEntries.find(query).lean()

    if (!userExerciseEntries?.length) {
      return res.status(404).json({ message: 'No user exercise entries found' })
    }

    res.json(userExerciseEntries)
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc Get all user exercise entries
// @route GET /user-exercise-entry
// @access Private
const AddUserExerciseEntries = async (req, res) => {
  const { username, exercise } = req.body
}

// @desc Get all user exercise entries
// @route GET /user-exercise-entry
// @access Private
const updateUserExerciseEntries = async (req, res) => {}

// @desc Get all user exercise entries
// @route GET /user-exercise-entry
// @access Private
const deleteUserExerciseEntries = async (req, res) => {}

module.exports = {
  getUserExerciseEntries,
  AddUserExerciseEntries,
  updateUserExerciseEntries,
  deleteUserExerciseEntries
}
