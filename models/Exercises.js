const mongoose = require('mongoose')

const exerciseSchema = {
  name: {
    type: String,
    required: true
  },
  // if not verified, show a small light red warning label abt misinfo
  verified: {
    type: Boolean,
    required: true
  },
  primaryMusclesWorked: [
    {
      type: String,
      default: null
    }
  ],
  secondaryMusclesWorked: [
    {
      type: String,
      default: null
    }
  ]
}

module.exports = mongoose.model('Exercise', exerciseSchema)
