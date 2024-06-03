const mongoose = require('mongoose')

// Records for a user the exercise they added to their diary on a specific date.

const userExerciseEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  exerciseAdded: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Exercise'
  },
  timestamps: true,
  //   dateTimeAdded: {
  //     type: Date,
  //     required: true,
  //     default: () => {
  //       return new Date(Math.floor(Date.now() / 1000) * 1000)
  //     }
  //   },

  sets: {
    type: Number,
    required: true,
    default: 1
  },
  repsOrTime: {
    required: true,
    oneOf: [
      {
        type: Object,
        required: [reps],
        properties: {
          reps: { type: Number, required: true }
        }
      },
      {
        type: Object,
        required: [duration, unit],
        properties: {
          duration: {
            type: Number,
            required: true
          },
          unit: { type: String, enum: ['minutes', 'seconds'], required: true }
        }
      }
    ]
  },
  resistance: {
    required: true,
    oneOf: [
      // in case it's band-based, bodyweight or another non-weighted exercise
      {
        type: Number,
        required: true
      },
      {
        type: String,
        required: true
      }
    ]
  }
})

module.exports = mongoose.model('UserExerciseEntry', userExerciseEntrySchema)

// Notes: optional
// RPE
// Completed (implement on frontend as checklist of sets)
// Workout name
