const {
  create,
  getUserByUserId,
  getUsers,
  updateUser,
  deleteUser,
  getUserByUserName
} = require('./user.service')
const { hashSync, genSaltSync, compareSync } = require('bcrypt')
// const { sign } = require('jsonwebtoken')

module.exports = {
  getUsers: (req, res) => {
    getUsers((err, results) => {
      if (err) {
        return res.json({
          status: 0,
          message: "error!"
        })
      }
      const data = results.map(result => ({
        id: result.id,
        name: result.name,
        role: result.role,
        phone: result.phone,
        password: result.password
      }))
      return res.json({
        status: 1,
        message: "Амжилттай",
        data
      })
    })
  },
  createUser: (req, res) => {
    const body = req.body
    const salt = genSaltSync(10)
    body.password = hashSync(body.password, salt)
    create(body, (err, data) => {
      if (err) {
        return res.status(500).json({
          status: 0,
          message: 'Өгөгдлийн сантай холбогдсонгүй !'
        })
      }
      return res.status(200).json({
        status: 1,
        message: "Амжилттай бүртгүүллээ"
      })
    })
  },

  login: (req, res) => {
    const body = req.body
    getUserByUserName(body.name, (err, data) => {
      if (err) {
        return res.json({
          status: 0,
          message: 'буруу!'
        })
      }
      if (!data) {
        return res.json({
          status: 0,
          message: 'Нэвтрэх нэр буруу!'
        })
      }
      const result = compareSync(body.password, data.password)
      if (result) {
        // const jsontoken = sign({ result: data }, 'qwe1234', {
        //   expiresIn: '24h'
        // })
        data.password = undefined
        return res.json({
          status: 1,
          message: 'Амжилттай',
          data: {
            id: data.id,
            name: data.name,
            password: data.password,
            phone: data.phone,
            role: data.role
            // token: jsontoken
          }
        })
      } else {
        return res.json({
          status: 0,
          message: 'Нууц үг буруу!'
        })
      }
    })
  },

  getUserByUserId: (req, res) => {
    const id = req.params.id
    getUserByUserId(id, (err, results) => {
      if (err) {
        return
      }
      if (!results) {
        return res.json({
          status: 0,
          message: 'Record not Found'
        })
      }
      results.password = undefined
      return res.json({
        status: 1,
        data: results
      })
    })
  },

  updateUsers: (req, res) => {
    const body = req.body
    const salt = genSaltSync(10)
    body.password = hashSync(body.password, salt)
    updateUser(body, (err, results) => {
      if (err) {
        return
      }
      return res.json({
        status: 1,
        message: 'updated statusfully'
      })
    })
  },
  deleteUser: (req, res) => {
    const data = req.body
    deleteUser(data, (err, results) => {
      if (err) {
        return
      }
      if (!results) {
        return res.json({
          status: 0,
          message: 'Record Not Found'
        })
      }
      return res.json({
        status: 1,
        message: 'user deleted statusfully'
      })
    })
  }
}
