const User = require('../models/user')
const jwt = require('jsonwebtoken')
const redisClient = require('../config/redis')

const userMiddleware = async (req,res,next)=>{
    try {
        const {token} = req.cookies;
        if(!token)
            throw new Error("token not available");
        const payload = jwt.verify(token,process.env.JWT_KEY);
        const {_id} = payload;
        if(!_id){
            throw new Error("Invalid token");
        }
        const result = await User.findById(_id);
        if(!result)
            throw new Error("User not found")

        const isBlocked = await redisClient.exists(`token:${token}`);
        if(!isBlocked)
            throw new Error("Invalid token");
        req.result = result;
        next();
    } catch (error) {
        res.status(401).send("Error: "+error.message);
    }
}

module.exports = userMiddleware;