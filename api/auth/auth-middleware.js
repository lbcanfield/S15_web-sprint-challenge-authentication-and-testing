const USER = require('./users/users-model')


async function checkUsernameAvail(request, response, next) {
     try {
          const userAvail = await USER.findUser({ username: request.body.username })
          if (!userAvail.length) {
               next()
          }
          else {
               next({
                    status: 422,
                    message: "Username Taken"
               })
          }
     }
     catch (error) {
          next(error)
     }
}

async function validateUser(request, response, next) {
     const { username, password } = request.body
     if (!username || !password) {
          next({
               status: 422,
               message: 'username and password required'
          })
     }
     else {
          const user = await USER.findUser({ username: request.body.username }).first()
          if (!user) {
               next({
                    status: 401,
                    message: 'Invalid Credentials'
               })
          }
          else {
               request.user = user
               next()
          }
     }
}

module.exports = {
     checkUsernameAvail,
     validateUser
}