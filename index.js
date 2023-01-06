const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const authRouter = require('./routes/auth.js')
const postRouter = require('./routes/post')
const profileRouter = require('./routes/profile')
const chatRouter = require('./routes/chat')
const messageRouter = require('./routes/message')

let morgan = require('morgan')
require('dotenv').config()
const cors = require('cors')
const app = express()

app.use(morgan('tiny'))

const port = process.env.PORT || 3001
const connectionString = process.env.DB_CONNECTION_STRING

app.use(cors())
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))



//Port

mongoose.connect(connectionString).then(()=>{
    console.log("db connected");
}).catch((err)=>{
    console.log(err.message);
})

//usage of routes
app.use('/',authRouter)
app.use('/post',postRouter)
app.use('/profile',profileRouter)
app.use('/chat',chatRouter)
app.use('/message',messageRouter)

 
app.listen(port,()=>{
    console.log("server running on port :" + port);
})