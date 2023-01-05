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
     const user = await USER.findUser({ username: request.body.username })
     const { username, password } = request.body
     if (!username || !password) {
          next({
               status: 422,
               message: 'username and password required'
          })
     }
     else if (!user.length) {
          next({
               status: 404,
               message: 'invalid credentials'
          })
     }
     else {
          const user = await USER.findUser({ username: request.body.username }).first()
          request.user = user
          next()
     }
}

module.exports = {
     checkUsernameAvail,
     validateUser
}