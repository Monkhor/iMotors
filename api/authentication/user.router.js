const router = require('express').Router()
const {
  createUser,
  login,
  getUserByUserId,
  getUsers,
  updateUsers,
  deleteUser
} = require('./user.controller')
router.get('/getUserData', getUsers)
router.post('/createUser', createUser)
router.post('/', login)

router.get('/:id', getUserByUserId)
router.post('/updateUser', updateUsers)
router.post('/deleteUser', deleteUser)

module.exports = router
