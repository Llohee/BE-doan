const express = require('express')
const mongoose = require('mongoose')
const { userRouter } = require('./routes/user')
const jwt = require('jsonwebtoken')
const { users, userModel } = require('./models/user')
const bcrypt = require('bcrypt')
const cors = require('cors')

const app = express()

mongoose.connect('mongodb+srv://nggiang141:Agera141@cluster0.a6p1g5y.mongodb.net/doan')

app.use(express.json())
app.use(cors())

const authenticationCheck = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
		const decoded = jwt.verify(token, '123@lol');
        const { username } = decoded
        const user = await userModel.findOne({ username: username })
        if (user) {
            req.user = user
            next()
        } else {
            res.send('User khong ton tai')
        }
    } catch (error) {
        res.status(401).send('Token expires')
        console.log(error)
    }
}

app.use('/users', authenticationCheck, userRouter)

app.get('/', (req, res) => {
    res.send('Home router')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await userModel.findOne({ username })
    if (user && bcrypt.compareSync(password, user.password)) {
        const accesstoken = jwt.sign({ username: username }, '123@lol')
        res.send({ token: accesstoken })
    } else {
        res.send('khong tim thay')
    }
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body
    const existringUser = await userModel.findOne({ username })
    if (existringUser) {
        res.send('user ton tại')
    } else {
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt)
        const user = await userModel.create({ username, password: hashPassword, role: ['user'] })
        res.send(user)
    }
})

app.put('/update', async (req, res) => {
    const { username, password } = res.body
})

app.listen(4000)
console.log('Server running')
module.exports = app;