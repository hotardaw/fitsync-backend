const mongoose = require('mongoose')
const UserExerciseEntry = require('../models/UserExerciseEntry')
const User = require('../models/User')
const Exercise = require('../models/Exercise')

// make the getter able to req single days by timestamp
// allow admin to see all users' exercise logs
// make a separate getter to search by entry ID

// @desc Get all user exercise entries
// @route GET /user-exercise-entry
// @access Private
const getUserExerciseEntries = async (req, res) => {
  // make an admin version of this function that can fetch anyone's exercise logs
  try {
    const { email, username } = req
    if (!email || !username) {
      return res.status(400).json({ message: 'User info not found in token' })
    }

    const user = await User.findOne({ email, username })
    if (!user) {
      return res.status(404).json({ message: `User not found: ${username}` })
    }

    const userEntries = await UserExerciseEntry.find({ user: user._id })
    if (userEntries?.length === 0) {
      return res.status(400).json({ message: 'User has no exercise logs' })
    }

    res.json(userEntries)
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// @desc Create new user exercise entries
// @route POST /user-exercise-entry
// @access Private
const AddUserExerciseEntry = async (req, res) => {
  try {
    const { email, username } = req
    if (!email || !username) {
      return res.status(400).json({ message: 'User info not found in token' })
    }

    const user = await User.findOne({ email, username })
    if (!user) {
      return res.status(404).json({ message: `User not found: ${username}` })
    }

    const { exerciseAdded, reps, duration, resistance } = req.body

    const exercise = await Exercise.findOne({ exerciseName: exerciseAdded })
    if (!exercise) {
      return res
        .status(404)
        .json({ message: `Exercise not found: ${exerciseAdded}` })
    }

    const userExerciseEntryObject = {
      user: user._id,
      username: user.username,
      exercise: exercise._id,
      exerciseName: exercise.exerciseName,
      reps,
      duration,
      resistance
    }

    console.log(`Exercise being logged: ${exercise.id}`)
    console.log(`Request Body: ${JSON.stringify(req.body)}`)
    console.log(
      `User Exercise Entry: ${JSON.stringify(userExerciseEntryObject)}`
    )

    const userExerciseEntry = await UserExerciseEntry.create(
      userExerciseEntryObject
    )

    res
      .status(201)
      .json({ message: `New entry added by ${username}: ${exerciseAdded}` })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// @desc Update all user exercise entries
// @route PATCH /user-exercise-entry
// @access Private
const updateUserExerciseEntry = async (req, res) => {
  try {
    const { email, username } = req
    if (!email || !username) {
      return res.status(400).json({ message: 'User info not found in token' })
    }

    const user = await User.findOne({ email, username })
    if (!user) {
      return res.status(404).json({ message: `User not found: ${username}` })
    }

    const { exercise, time, reps, duration, resistance } = req.body
    console.log(`exercise _id: ${exercise}`)

    // find the exercise
    const exerciseToFind = await Exercise.findOne({ _id: exercise })
    console.log('exerciseToFind: ', exerciseToFind)

    if (!exerciseToFind) {
      return res
        .status(404)
        .json({ message: `Failed to find exercise ${exerciseToFind}` })
    }

    // find the existing exercise entry
    const userExerciseEntry = await UserExerciseEntry.findOne({
      user,
      exercise,
      time
    })
    console.log(`userExerciseEntry: ${userExerciseEntry}`)

    console.log(user.username, JSON.stringify(user._id), exercise, time)

    if (!userExerciseEntry) {
      return res.status(404).json({
        message: `Exercise entry by user ${user} for exercise ${exercise} not found at time ${time}`
      })
    }

    userExerciseEntry.exercise = exercise
    userExerciseEntry.reps = reps
    userExerciseEntry.duration = duration
    userExerciseEntry.resistance = resistance

    const updatedUserExerciseEntry = await userExerciseEntry.save()
    res.json({
      message: 'Exercise entry updated successfully',
      updatedEntry: updatedUserExerciseEntry
    })

    // console.log(`Exercise being updated: ${userExerciseEntry.id}`)
    // console.log(`Request Body: ${JSON.stringify(req.body)}`)
    // console.log(
    //   `User Exercise Entry (updated): ${JSON.stringify(userExerciseEntry)}`
    // )
  } catch (err) {
    console.log(err.message)
  }
}

// @desc Delete a user exercise entry
// @route DELETE /user-exercise-entry
// @access Private
const deleteUserExerciseEntry = async (req, res) => {
  const { email, username } = req
  if (!email || !username) {
    return res.status(400).json({ message: 'User info not found in token' })
  }

  const user = await User.findOne({ email, username })
  if (!user) {
    return res.status(404).json({ message: `User not found: ${username}` })
  }

  const { _id } = req.body
  console.log(_id)
  if (!_id) {
    return res.status(404).json({ message: 'Exercise entry not found' })
  }

  const userExerciseEntryToDelete = await UserExerciseEntry.findById(_id).exec()
  if (!userExerciseEntryToDelete) {
    return res.status(404).json({ message: 'Exercise entry not found' })
  }

  console.log(JSON.stringify(userExerciseEntryToDelete.user))
  console.log(JSON.stringify(user._id))

  if (
    JSON.stringify(userExerciseEntryToDelete.user) !== JSON.stringify(user._id)
  ) {
    return res.status(400).json({
      message: `User ${user._id} is attempting to delete an exercise entry not associated with their user ID`
    })
  }

  const deletedUserExerciseEntry = await userExerciseEntryToDelete.deleteOne()

  res.json({
    message: 'Exercise entry deleted successfully',
    deletedEntry: deletedUserExerciseEntry
  })
}

module.exports = {
  getUserExerciseEntries,
  AddUserExerciseEntry,
  updateUserExerciseEntry,
  deleteUserExerciseEntry
}
