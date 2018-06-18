const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema( {
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: `{VALUE} is not a valid email`
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
},{usePushEach: true});

userSchema.methods.generateAuthToken = function () {
    var user = this ;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'abc').toString();

    user.tokens.push({access,token});

    return user.save().then(()=>{
        return token;
    });
};



var User = mongoose.model('user', userSchema);

module.exports = {
    User
}