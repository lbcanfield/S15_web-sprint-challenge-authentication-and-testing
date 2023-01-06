const USER = require('./users/users-model')
const bcrypt = require('bcryptjs')


async function checkUsernameAvail(request, response, next) {
     try {
          if (!request.body.username || !request.body.password) {
               next({
                    status: 422,
                    message: 'username and password required'
               })
          }
          else {
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
          if (!user) {
               next({
                    status: 401,
                    message: 'invalid credentials'
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