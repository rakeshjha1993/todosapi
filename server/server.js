const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');

var app = express();
var port = process.env.port || 3000 ;
app.use(bodyParser.json());

app.post('/todos',(req,res) => {
    var text = req.body.text;
    var todo = new Todo({
        text
    });
    todo.save().then((doc)=>{
        res.status(200).send(doc);
    }).catch((e) => {
        res.status(400).send(e);
        //console.log(err.message);
    });
});

app.get('/todos',(req,res) => {
    Todo.find().then((todos)=>{
        res.send({todos});
    }).catch((error)=>{
        res.status(400).send(error);
    });
});

app.get('/todos/:id',(req,res) => {
    var id = req.params.id;
    console.log(id);
    if(!ObjectId.isValid(id)){
        res.status(404).send({"message":"Todo not Found"});
    } 
    Todo.findById(id).then((todo) => {
        console.log(todo);
        if(!todo){
          return res.status(404).send({"message":"Todo not Found"});
            
        }
        res.send(todo);
    }).catch((e) => {
        res.status(400).send();
    })
    
})


app.listen(port,(err)=>{
    if(err){
        return console.log(err.message);
    }
    console.log('server is listening on ${port}');

})

module.exports.app = app;