const mongoose = require('mongoose');

var Todo = mongoose.model('todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: String,
    }
});

module.exports = {
    Todo
}