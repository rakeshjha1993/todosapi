var env = process.env.NODE_ENV || 'development';

 //console.log(env);

if(env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodosApi";
}else if (env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = "mongodb://localhost:27017/TodosApi";
}



const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const {_} = require('lodash');
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');


//console.log(process.env.MONGODB_URI);


var app = express();
var port = process.env.PORT;
app.use(bodyParser.json());

// todos routes

app.post('/todos', (req, res) => {
    var text = req.body.text;
    var todo = new Todo({
        text
    });
    todo.save().then((doc) => {
        res.status(200).send(doc);
    }).catch((e) => {
        res.status(400).send(e);
        //console.log(err.message);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({
            todos
        });
    }).catch((error) => {
        res.status(400).send(error);
    });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.status(404).send({
            "message": "Todo not Found"
        });
    }
    Todo.findById(id).then((todo) => {
        // console.log(todo);
        if (!todo) {
            return res.status(404).send({
                "message": "Todo not Found"
            });

        }
        res.send(todo);
    }).catch((e) => {
        res.status(400).send();
    });

});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;
    if (!ObjectId.isValid(id)) {
        res.status(404).send({
            "message": "Todo not Found"
        });
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                "message": "Todo not Found"
            });
        }
        res.send({
            todo
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['completed', 'text']);

    if (!ObjectId.isValid(id)) {
        console.log(id);
        res.status(404).send({
            "message": "Invalid Object ID"
        });
    }
    console.log(req.body);
    if (_.isBoolean(body.completed) && body.completed) {

        var completedAt = new Date().getTime();
        body.completedAt = completedAt;
    } else {
        body.completed = false;
        body.completedAt = null;
    }
    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send({
                "message": "Todo not Found"
            });
        }
        res.send({
            todo
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

// users routes

app.post('/users',(req,res) => {
    console.log(req.body);
    var body = _.pick(req.body,['email','password']);
    console.log(body);
    var user = new User (
        body
    );
    user.save().then((user)=>{
        return user.generateAuthToken();
       
    })
    .then((token) => {
        res.header('x-auth', token).send(user);
    })
    .catch((e)=>{
        console.log(e);
        res.status(400).send(e);
    });
});

app.listen(port, (err) => {
    if (err) {
        return console.log(err.message);
    }
    console.log(`server is listening on ${port}`);

})

module.exports.app = app;