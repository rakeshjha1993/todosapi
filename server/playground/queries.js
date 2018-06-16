const {ObjectID} = require('mongodb');
const {mongoose} = require('./../db/mongoose');

const {User} =  require('./../models/user');

var id = "5b23682470bafb3dd1e8ccf7";

// console.log(User);

if(!ObjectID.isValid(id)){
   console.log('invalid object Id');
}
else{
    User.findById(id).then((user) =>{
        if(!user){
            return console.log(`${id} is not avilable`);    
        }
        console.log('User by Id',user);
    }).catch((e)=> {
        console.log(e)
    });
}

