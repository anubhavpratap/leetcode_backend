const User = require('../models/user')
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const redisClient = require('../config/redis')

const signUp = async (req,res) => {
    try{
        validate(req.body)
        const {password} = req.body;
        req.body.password = await bcrypt.hash(password,10);

        const user = await User.create(req.body);
        const token = jwt.sign({_id:user._id,emailId:user.emailId},process.env.JWT_KEY,{expiresIn:60*60});
        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).send("User Registered Successfully")
    }catch(err){
        res.status(400).send("Error:"+err);

    }

}

const login = async (req,res) => {
    try{
        const {emailId,password} = req.body;
        if(!emailId)
            throw new Error('Invalid credentials')
        if(!password)
            throw new Error('Invalid credentials')

        const user = await User.findOne({emailId});

        const match = bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Invalid Credentials")

        const token = jwt.sign({_id:user._id,emailId:user.emailId},process.env.JWT_KEY,{expiresIN: 60*60});
        res.cookie('token',token,{maxAge: 60*60*1000});
        res.status(200).send("Logged In Succeessfully");

    }catch(err){
        res.status(401).send("Error: "+err);
    }
}

const logOut = async (req,res)=>{
    try{
        const {token} = req.cookies;
        const payload = jwt.decode(token);

        await redisClient.set(`token:${token}`,'Blocked');
        await redisClient.expiresAt(`token:${token}`,payload.exp);

        res.cookie("token",null,{expires: new Date(Date.now())});
        res.send("Logout Successfully")
    }catch(err){
        res.send(503).send("Error:"+err);
    }
}

const adminRegister = async(req,res)=>{
    try{  
      validate(req.body); 
      const {emailId, password}  = req.body;

      req.body.password = await bcrypt.hash(password, 10);
    
     const user =  await User.create(req.body);
     const token =  jwt.sign({_id:user._id , emailId:emailId, role:user.role},process.env.JWT_KEY,{expiresIn: 60*60});
     res.cookie('token',token,{maxAge: 60*60*1000});
     res.status(201).send("Admin Registered Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

module.exports = {signUp,login,logOut,adminRegister};
