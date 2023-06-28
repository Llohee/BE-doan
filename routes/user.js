const express = require('express')
const jwt = require('jsonwebtoken')
const { users, getAllUsers, userModel } = require('../models/user')
const multer = require('multer')

const upload = multer({ dest: 'uploads/' })

const userRouter = express.Router()

const authorizationCheck = (req, res, next) => {
  const userRoles = req.user.role
  console.log(userRoles)
  if (userRoles.includes('admin')) {
    next()
  } else {
    res.send('User khong co quyen')
  }

}

userRouter.get('/', authorizationCheck, async (req, res) => {
  try {
    const users = await userModel.find({})
    res.send(users)
  } catch (error) {
    res.send('Error')
    console.log(error)
  }
})

userRouter.get('/me', (req, res) => {
  res.send(req.user)
})


userRouter.get('/', authorizationCheck, async (req, res) => {
  const users = await userModel.find({})
  const user = req.user
})

userRouter.patch('/:username', authorizationCheck, async (req, res) => {
  const { role, song } = req.body
  const username = req.params.username
  const user = await userModel.findOne({ username })
  if (user) {
    const user = await userModel.findOneAndUpdate({ username }, { $push: { songs: song } }, { new: true })
    res.send(user)
  } else {
    res.send('Khong co user')
  }
})

userRouter.post('/create', authorizationCheck, async () => {
})

userRouter.delete('/:username', authorizationCheck, async (req, res) => {
  const username = req.params.username
  const currentUser = req.user
  if (currentUser.username === username) {
    res.status(400).send('Khong the xoa user nay')
    return
  }
  const user = await userModel.findOne({ username })
  if (user) {
    await userModel.deleteOne({ username })
    res.send('Da xoa,')
  } else {
    res.send('Khong co user')
  }
})

userRouter.post('/profile', upload.any('avatar'), (req, res) => {
  console.log(req.file)
  res.send('ok')
})

module.exports = { userRouter }