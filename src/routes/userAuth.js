const express = require('express')
const userRouter = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {signUp,logOut,login,adminRegister} = require('../controllers/userAuthent')

userRouter.post("/signup",signUp);
userRouter.post("/login",login);
userRouter.post("/logout",userMiddleware,logOut);
userRouter.post("/admin/register",adminMiddleware,adminRegister);

module.exports = userRouter;