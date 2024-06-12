const mongoose = require('mongoose')

// Records for a user the exercise they added to their diary on a specific date.

const userExerciseEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Exercise'
  },

  reps: {
    type: Number,
    validate: {
      validator: (value) => {
        return value == null || this.duration == null // only one of duration or reps
      },
      message: 'Either reps or duration are required, but not both'
    }
  },
  duration: {
    type: Number, // duration in seconds
    validate: {
      validator: (value) => {
        return value == null || this.reps == null // only one of duration or reps
      },
      message: 'Either reps or duration are required, but not both'
    }
  },

  resistance: {
    type: mongoose.Schema.Types.Mixed,
    validate: {
      validator: (value) => {
        return typeof value === 'number' || typeof value === 'string'
      },
      message: 'Resistance must either be a number or a string'
    }
  },
  time: { type: Date, default: Date.now() }
})

module.exports = mongoose.model('UserExerciseEntry', userExerciseEntrySchema)

// Notes: optional
// RPE
// Completed (implement on frontend as checklist of sets)
// Workout name
