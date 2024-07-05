const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup =  async (req, res, next) => {
     try{
       const { username, dob, email, password } = req.body;
       const existingUser = await User.findOne({email});
       if(existingUser){
        return res.json({message: "User already exits."});
       }

       const user = await User.create({ username, dob, email, password});
       const token = createSecretToken(user._id);
       res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
       });
       res.status(201).json({message: "user signed in successfull", success: true, user});
       next();

     }catch(error) {
      console.error(error);
     }
};

module.exports.Login = async ( req, res, next) => {
    try{

     const { email, password } = req.body;
     if( !email || !password ){
        return res.json({ message: "All fields are required "});
     }

     const user = await User.findOne({email});
     if(!user){
        return res.json({message: "Incorrect email or password!"});
     }

    const auth = await bcrypt.compare(password, user.password);
    if(!auth){
        return res.json({message: "Incorrect email or password!"});
    }
    
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
    });
    res.status(201).json({message:"User logged in successfully!",  success: true, user});
    next();

    }catch(error){
        console.error(error);
    }
};