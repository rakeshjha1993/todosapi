const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const {_} = require('lodash');


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

userSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    console.log(_.pick(userObject,['email','password']));

    return _.pick(userObject,['email','_id']);
}

userSchema.methods.generateAuthToken = function () {
    var user = this ;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'abc').toString();

    user.tokens.push({access,token});

    return user.save().then(()=>{
        return token;
    });
};

userSchema.statics.findByToken = function(token){
    var User = this;
    var decoded ;

    try{
        decoded = jwt.verify(token,'abc');
        console.log(decoded);
    }catch(e){
        return new Promise((resolve,reject) => {
            reject();
        })
    }
    return User.findOne(
        {
            '_id': decoded._id,
            'tokens.token' : token,
            'tokens.access' : 'auth'
        }
    );

}

var User = mongoose.model('user', userSchema);

module.exports = {
    User
}