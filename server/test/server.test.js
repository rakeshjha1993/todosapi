const {ObjectID} = require('mongodb');
const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');

const {Todo} = require('./../models/todo');

const todos = [{
    "_id":new ObjectID(),
    "text":"something new todo"
},{
    "_id":new ObjectID(),
    "text":"something more new todo"
}];

beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        return Todo.insertMany(todos);
    }).then(()=> done());
})

describe('/POST Todos',()=>{
    it('should post the data to server',(done)=>{
        var text = 'Testing the post API'
        request(app)
                .post('/todos')
                .send({text})
                .expect(200)
                .expect((res)=>{
                    expect(res.body.text).toBe(text);
                })
                .end((err,res) => {
                    if(err){
                      return  done(err);
                    }
                    Todo.find({text}).then((todos)=>{
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    }).catch((error)=>{
                        if(error){
                            done(error);
                        }
                    });
                });

    });

    it('should not accept bad data',(done)=>{
        var text ='';
        request(app)
                .post('/todos')
                .send({})
                .expect(400)
                .end((err,res) => {
                    if(err){
                        return done(err);
                    }
                    Todo.find().then((todos)=>{
                        expect(todos.length).toBe(2);
                        done();
                       
                    }).catch((e)=> {
                        done(e);
                    });
                });

                
    });
});

describe('GET /todos',()=>{
    it('should fetch data back',(done) => {
        request(app)
                .get('/todos')
                .expect(200)
                .expect((res)=>{
                    expect(res.body.todos.length).toBe(2);
                    
                })
                .end(done);
    });
});

describe('GET /todos/:id',()=>{
    it('should fetch single todo',(done)=>{
        request(app)
                .get(`/todos/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect((res)=>{
                    expect(res.body.text).toBe(todos[0].text);
                })
                .end(done);
    });
    
    it('should give invalid object id',(done)=>{
        request(app)
                .get('/todos/0b23ee2f6567242268d378e0')
                .expect(404)
                .end(done);
    });

    it('should give document not found',(done)=>{
        request(app)
                .get(`/todos/5b23ee2f6567242268d378e98`)
                .expect(404)
                .expect((res)=>{
                    expect(res.body.message).toBe('Todo not Found');
                })
                .end(done);
    });

});