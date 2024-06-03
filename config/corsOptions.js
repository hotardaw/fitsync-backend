const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
  // "origin" is a function that determines whether a given origin is allowed to access the server's resources.
  origin: (origin, callback) => {
    // the -1 limits the allowedOrigins to only what is in the array being able to access the backend REST API. however, it would also screen out other software like Postman that we might test the API with, or anything else that didn't/doesn't provide an origin, hence the "|| !origin".
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // callback fn: https://github.com/expressjs/cors/blob/f038e7722838fd83935674aa8c5bf452766741fb/lib/index.js#L219-L226
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}

module.exports = corsOptions
