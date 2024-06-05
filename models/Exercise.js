const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
  exerciseName: {
    type: String,
    required: true
  },
  musclesWorked: {
    type: [String],
    validate: {
      validator: (value) => {
        return value && value.length > 0
      },
      message:
        'At least one muscle or muscle group must be specified for an excercise to be verified'
    },
    default: null
  },
  verified: {
    // if not verified, show a small light red warning label abt misinfo
    type: Boolean,
    default: false
  }
})

exerciseSchema.pre('save', (next) => {
  if (
    this.verified &&
    (!this.musclesWorked || this.musclesWorked.length === 0)
  ) {
    return next(
      new Error('Cannot verify exercise without specifying muscles worked')
    )
  }
  next()
})

module.exports = mongoose.model('Exercise', exerciseSchema)
