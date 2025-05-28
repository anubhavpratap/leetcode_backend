const cookieParser = require('cookie-parser');
const express =  require('express')
const app  = express();
require('dotenv').config()
const connectDB = require('./config/database.js')
const redisClient = require('./config/redis.js');
const userRouter = require('./routes/userAuth.js');
const problemRouter = require('./routes/problemCreate.js')


app.use(express.json());
app.use(cookieParser());

app.use('/user',userRouter);
app.use('/problem',problemRouter);

connectDB().then(()=>{
    redisClient.connect();
    console.log("Database connection established..");
}).catch((err)=>{
    console.error("Database cannot be connected...")
});

app.listen(process.env.PORT,()=>{
    console.log("server is successfully listening...")
});