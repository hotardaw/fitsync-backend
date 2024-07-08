require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(`${process.env.NODE_ENV} mode`)

connectDB()

app.use(logger)

app.use(cors(corsOptions))

// built-in express middleware to convert req.body to json, making it available in a callback
app.use(express.json())

app.use(cookieParser())

// Instructs the server to serve static files (html, css, js) located in the 'public' directory when a req is made to the root URL:
app.use('/', express.static(path.join(__dirname, 'public')))

// Use the middleware defined in the file at /routes/root for requests made to the root ('/') path:
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/exercises', require('./routes/exerciseRoutes'))
app.use('/user-exercise-entry', require('./routes/userExerciseEntry'))

// Catchall 404 page for any unanswerable requests
app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if (req.accepts('json')) {
    res.json({ message: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB')
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

mongoose.connection.on('error', (err) => {
  console.log(err)
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  )
})

/* // app.METHOD(PATH, HANDLER) // 
app is an instance of express.
METHOD is an HTTP request method, in lowercase.
PATH is a path on the server.
HANDLER is the function executed when the route is matched.
*/
