const validator = require('validator')

const validate = (data) => {
    const requiredData = ['firstName','emailId','password'];
    const isAllowed = requiredData.every((k)=> Object.keys(data).includes(k));
    if(!isAllowed) 
        throw new Error("Some field missing");
    if(!validator.isEmail(data.emailId))
        throw new Error("Inavlid email");
    if(!validator.isStrongPassword(data.password))
        throw new Error("Weak Password");
} 

module.exports = validate;