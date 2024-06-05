const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  roles: [
    {
      type: String,
      default: 'User'
    }
  ],
  accountCreationDate: {
    type: Date,
    default: Date.now()
  },
  username: {
    type: String,
    required: false,
    default: null
  },

  optionalProfileData: {
    birthDate: {
      type: Date,
      default: null
    },
    gender: {
      type: Boolean,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    weight: {
      type: Number,
      default: null
      // unit
    },
    goalWeight: {
      type: Number,
      default: null
    },
    activityLevel: {
      type: String,
      default: null
    }
  }

  // lastLogin required property, for sending notifications begging them to test my app.
  // every time they log in, update timestamp and notify if timestamp gets over x days old

  //   profileNutritionData: {
  //     macros: {
  //         carbs: {type: Number, default: null},
  //         fat: {type: Number, default: null},
  //         protein: {type: Number, default: null}
  //     },
  //     favoriteFoods: [{ array of objects }]
  //   },

  // similar for favorite exercises/recipes

  // profile picture?
})

module.exports = mongoose.model('User', userSchema)
