require('dotenv').config();
const express = require('express')
const usersRouter = require('./routes/users')
const authRouter = require('./routes/index')
const quizRouter = require('./routes/quizzes')

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


// routers
app.use('/', authRouter)
app.use('/users', usersRouter)
app.use('/quizzes', quizRouter)

app.use((err, req, res, next) => {
    console.error(err)
    res.status(400).json({message: "Something went wrong"})
})

//port
const port = process.env.PORT || 3000

//server
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})