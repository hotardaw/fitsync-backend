const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
  // Info that might be passed in during user login:
  const { email, username, password } = req.body

  if ((!email && !username) || !password) {
    return res
      .status(400)
      .json({ message: 'An email/username and password are required' })
  }

  const foundUser = await User.findOne({ email, username }).exec()

  if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

  const match = await bcrypt.compare(password, foundUser.password)

  if (!match) return res.status(401).json({ message: 'Unauthorized' })

  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: foundUser.email,
        username: foundUser.username,
        roles: foundUser.roles
      }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '10s' }
  )

  const refreshToken = jwt.sign(
    {
      email: foundUser.email,
      username: foundUser.username
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  )

  // create secure cookie w/ refresh token
  res.cookie('jwt', refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: true, // https
    sameSite: 'None', // cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000 // cookie expiry set to match rT
  })
  // send accessToken containing email, username & roles
  res.json({ accessToken })
}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = async (req, res) => {
  const cookies = req.cookies

  if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Forbidden' })
      }

      const foundUser = await User.findOne({
        email: decoded.email,
        username: decoded.username
      }).exec()

      if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
            username: foundUser.username,
            roles: foundUser.roles
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
      )

      res.json({ message: accessToken })
    }
  )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if it exists
const logout = (req, res) => {
  const cookies = req.cookies

  if (!cookies.jwt) return res.sendStatus(204) // No content
  res.clearCookie('jwt'), { httpOnly: true, sameSite: 'None', secure: true }
  res.json({ message: 'Cookie cleared' })
}

module.exports = {
  login,
  refresh,
  logout
}
