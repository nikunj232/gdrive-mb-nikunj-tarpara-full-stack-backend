const app = require("./app");
const env = require('dotenv');
env.config();

const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

app.listen(port, () => {
    console.log(`Server listening on ${port}!`);
})

// const unexpectedErrorHandler = (error) => {
//     logger.error(error)
//     exitHandler()
// }

// process.on('uncaughtException', unexpectedErrorHandler)
// process.on('unhandledRejection', unexpectedErrorHandler)


