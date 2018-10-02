const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ToDoSchema = new Schema({

    text: {
        type: String, 
    }

});

const Todo = mongoose.model('Todo', ToDoSchema);

module.exports = Todo;