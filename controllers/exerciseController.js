const Exercise = require('../models/Exercise')

// @desc Get all exercises
// @route GET /exercises
// @access Private
const getAllExercises = async (req, res) => {
  const exercises = await Exercise.find().lean()

  if (!exercises?.length) {
    return res.status(404).json({ message: 'No exercises found' })
  }

  res.json(exercises)
}

// @desc Create new exercises
// @route POST /exercises
// @access Private
const createNewExercise = async (req, res) => {
  const { exerciseName, verified, musclesWorked } = req.body

  if (!exerciseName) {
    return res.status(400).json({ message: 'An exercise name is required' })
  }

  //   const dupe = await Exercise.findOne({ exerciseName, musclesWorked })
  //     .lean()
  //     .exec()

  //   if (dupe) {
  //     return res
  //       .status(409)
  //       .json({ message: 'Exercise already exists', exercise: existingExercise })
  //   }

  try {
    let existingExercise = await Exercise.findOne({
      exerciseName,
      musclesWorked
    })
      .lean()
      .exec()
    if (existingExercise) {
      return res.status(200).json({
        message: 'Exercise already exists',
        exercise: existingExercise
      })
    }

    const newExerciseObject = {
      exerciseName,
      musclesWorked,
      verified // default false, as per the model
    }
    const newExercise = await Exercise.create(newExerciseObject)

    res.status(201).json({ message: 'Exercise created', exercise: newExercise })
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'Error creating exercise' })
  }
}

// @desc Update an exercise
// @route PATCH /exercises
// @access Private
const updateExercise = async (req, res) => {
  const { exerciseName, musclesWorked, verified } = req.body

  // confirm data
  if (!exerciseName) {
    res.send(400).json({ message: 'Must include at least exercise name' })
  }

  // does exercise exist to update?
  const exercise = await Exercise.findOne({ exerciseName /*, musclesWorked*/ })
  if (!exercise) {
    return res.status(404).json({ message: 'Exercise not found' })
  }

  const dupe = await Exercise.findOne({ exerciseName, musclesWorked })
  if (dupe && dupe?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate exercise', exercise })
  }

  exercise.exerciseName = exerciseName
  exercise.musclesWorked = musclesWorked
  // Later, set only 'admin' to be able to verify:
  exercise.verified = verified

  const updatedExercise = await exercise.save()
  res.json({ message: `Exercise ${updatedExercise.exerciseName} updated` })
}

// @desc Delete an exercise
// @route DELETE /exercises
// @access Private
const deleteExercise = async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'Exercise ID required' })
  }

  const exercise = await Exercise.findById(id).exec()

  if (!exercise) {
    return res.status(404).json({ message: 'Exercise not found' })
  }

  const result = await user.deleteOne()

  const reply = `Exercise with name ${result.exerciseName} and ID ${result._id} deleted`

  res.json(reply)
}

module.exports = {
  getAllExercises,
  createNewExercise,
  updateExercise,
  deleteExercise
}
