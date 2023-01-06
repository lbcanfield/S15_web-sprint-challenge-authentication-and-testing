const USER = require('./users/users-model')
const bcrypt = require('bcryptjs')


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
     if (!request.body.username || !request.body.password) {
          next({
               status: 422,
               message: 'username and password required'
          })
     }
     else {
          const user = await USER.findUser({ username: request.body.username }).first()
          request.user = user
          next()
     }
}


async function verifyUser(request, response, next) {
     const { username, password } = request.body
     const hashedPwd = bcrypt.hashSync(password, 8)
     console.log(request.user.password)
     console.log(hashedPwd)
     if (username !== request.user.username || hashedPwd !== request.user.password) {
          next({
               status: 401,
               message: 'Invalid Credentials'
          })
     }
     else {
          next()
     }
}
module.exports = {
     checkUsernameAvail,
     validateUser,
     verifyUser
}