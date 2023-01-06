const router = require('express').Router();
const { checkUsernameAvail, validateUser } = require('./auth-middleware')
const { JWT_SECRET } = require('../secrets/index.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const USER = require('./users/users-model')


router.post('/register', checkUsernameAvail, (request, response, next) => {
     const { username, password } = request.body
     const hashedPwd = bcrypt.hashSync(password, 8)
     USER.add({ username, password: hashedPwd })
          .then(savedUser => {
               response.status(200).json(savedUser)
          })
          .catch(next)
});

router.post('/login', validateUser, (request, response, next) => {
     if (bcrypt.compareSync(request.body.password, request.user.password)) {
          const token = tokenBuilder(request.user)
          response.json({
               status: 200,
               message: `welcome, ${request.user.username}`,
               token,
          })
     }
     else {
          next({
               status: 401,
               message: 'Invalid Credentials'
          })
     }
});

function tokenBuilder(user) {
     const payload = {
          subject: user.user_id,
          username: user.username
     }
     const options = {
          expiresIn: '1d'
     }
     return jwt.sign(payload, JWT_SECRET, options)
     // return (jwt.sign(payload, JWT_SECRET, options), 'here')
}

module.exports = router;
