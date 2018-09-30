const todos = require('../data/todo-list.js');

module.exports = function (app) {

    // API Requests for /api/todo-list
    // Below code controls what happens when a request is made to /api/todos

    // GET Request
    // Responds with all the currently reserved todos
    app.get('/api/todo-list', function (req, res) {
        res.json(todos);
    });

    // POST Request
    // Adds a new todo to our data collection
    // Responds with success: true or false if successful
    app.post('/api/todo-list', function (req, res) {

        const confirmation = { success: true };

        // ensure boolean values
        req.body.completed = req.body.completed === 'true';

        // ADD THE TODO
        todos.push(req.body);

        // Send back a confirmation the POST was successfully processed to end the response
        res.json(confirmation);
    });

    // API Requests for /api/todos/:index
    // Below code controls what happens when a request is made to /api/todos/:index

    // example: GET /api/todo/0
    // GET Request
    // Responds with just the requested todo at the referenced index
    app.get('/api/todo-list:index', function (req, res) {
        res.json(todos[req.params.index]);
    });

    // PUT Request
    // Replaces the todo at the referenced index with the one provided
    // Responds with success: true or false if successful
    app.put('/api/todo-list:index', function (req, res) {

        // ensure boolean values
        req.body.completed = req.body.completed === 'true';

        // Replace the referenced todo with the one provided in the body
        todos.splice(req.params.index, 1, req.body);
        res.json({
            success: true
        });
    });

    // DELETE Request
    // Removes the todo at the referenced index
    // If there are todos on the waiting list, moves them to the reserved todos list
    // Responds with success: true or false if successful
    app.delete('/api/todo-list:index', function (req, res) {

        // Remove the referenced todo from the todos
        todos.splice(req.params.index, 1);

        // Respond that this operation was successfully completed
        res.json({
            success: true
        });
    });
}