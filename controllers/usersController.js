const User = require('../models/User')
const { isValidEmail } = require('../utils/validation')
const bcrypt = require('bcrypt')

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').lean()

  if (!users?.length) {
    return res.status(400).json({ message: 'No users found' })
  }
  // if users are found, this effectively returns them:
  res.json(users)
}

// @desc Create new users
// @route POST /users
// @access Private
const createNewUser = async (req, res) => {
  const { email, username, password, roles } = req.body

  // confirm data
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: 'Provided email does not conform to format' })
  }

  // exec() explained: https://stackoverflow.com/questions/31549857/mongoose-what-does-the-exec-function-do
  const dupe = await User.findOne({ email, username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec()

  if (dupe && dupe?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate email or username' })
  }

  // hash the pw w/ 10 salt rounds
  const hashedPassword = await bcrypt.hash(password, 10)

  const userObject = { email, password: hashedPassword, roles }

  // create & store new user in mongoDB
  const user = await User.create(userObject)

  if (user) {
    // was created
    res.status(201).json({ message: `New user at ${email} created` })
  } else {
    res.status(400).json({ message: 'Invalid user data received' })
  }
}

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = async (req, res) => {
  const { id, email, roles, password, username } = req.body

  // confirm data
  if (!id || !email || !Array.isArray(roles) || !roles.length) {
    return res
      .status(400)
      .json({ message: 'All fields except password & username are required' })
  }

  // does user exist to update?
  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  // check for duplicates
  const dupe = await User.findOne({ email, username })
    .collation({ locale: 'en', strength: 2 })
    .lean()
    .exec()

  if (dupe && dupe?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate email or username' })
  }

  user.email = email
  user.roles = roles
  user.username = username

  if (password) {
    // hash the password if it's updated
    user.password = await bcrypt.hash(password, 10)
  }

  const updatedUser = await user.save()

  res.json({ message: `User ${updatedUser.email} updated` })
}

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = async (req, res) => {
  const { id } = req.body

  if (!id) {
    return res.status(400).json({ message: 'User ID required' })
  }

  const user = await User.findById(id).exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  const result = await user.deleteOne()

  const reply = `User with email ${result.email} and ID ${result._id} deleted`

  res.json(reply)

  // add logic to delete all associated user data. exercise data, food data, etc.
}

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
}
