const router = require('express').Router()
const {
  createUser,
  login,
  getUsers,
  deleteUser
} = require('./user.controller')
router.get('/getUserData', getUsers)
router.post('/createUser', createUser)
router.post('/', login)
router.post('/deleteUser', deleteUser)

module.exports = router
