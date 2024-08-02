const userModel = require('../models/user.model');
const UserModel = require('../models/user.model');
const {signUpError , signInError} = require('../utils/auth.error');
const jwt =  require('jsonwebtoken');
var maxAge =  24*60*60*1;

function createToken(id) {
    return jwt.sign({id} , process.env.SECRET , {expiresIn : maxAge})
    
}

exports.signUp = async function (req , res) {
    const {username , email , password} = req.body;
    
    try {
        const user = await UserModel.create({username , email , password});
        res.status(200).json({user: user._id});
        
    } catch (error) {
        const errors = signUpError(error);
        res.status(400).send(errors);
    }
}

exports.signIn = async function (req , res) {
    const {email , password} = req.body;    
    try {
        const user = await userModel.login(email , password);
        const token = createToken(user._id);
        res.cookie('jwt' , token , {maxAge});
        res.status(200).json({user: user._id});
    } catch (error) {
        const errors = signInError(error);
        res.status(400).send(errors);
    }
}


exports.signOut = async function (req , res) {
        res.cookie('jwt' , "" ,{ maxAge : 1});
        res.redirect('/');
}