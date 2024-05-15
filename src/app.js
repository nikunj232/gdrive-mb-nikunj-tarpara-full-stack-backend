const express = require('express')
const cors = require('cors')
const app = express()
const dotenv = require('dotenv')
const passport = require('passport')
const { errorConverter, errorHandler } = require('./middleware/error')
const sequelize = require('./config/database')
const appRouter = require('./routes')
const { jwtStrategy } = require('./config/passport')

dotenv.config();

// sequelize.sync()

app.use(express.static('../'))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);
  
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

app.use("/", appRouter)
module.exports = app