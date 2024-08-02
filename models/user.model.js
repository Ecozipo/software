const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema(
    {
        id: {
            type: String,
    },
        username:{
            type: String,
            required: true,
            minLength: 5,
            unique: true
        },
        email: {
            type: String,
            required: true,
            validate: [isEmail],
            lowercase: true,
            unique:true, 
            trim: true
        },
        password: {
            type: String,
            minLength: 8,
            required: true
        },
        picture: {
            type: String ,
        }
}
) ;

//hash password with bcrypt before saving data
UserSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password , salt)
    next();
});

//access to login method via authcontroller
UserSchema.statics.login = async function(email, password) {
    const user = await this.findOne({ email });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);

      if (auth) {
        return user;
      }
      throw Error('password');
    }
    throw Error('email')
  };

module.exports = mongoose.model('User' , UserSchema);



