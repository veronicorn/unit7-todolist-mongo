$(function () {

    const state = {
        todos: [],
    };

    const render = function () {

        // Empty our output divs
        $('#todos').empty();

        // Turn off any click listeners from our update items
        $('add-new-todo').off('click');

        // Run Queries!
        // ==========================================
        getTodos();
    }

    /**
     * TODO schema = { text: 'my todo text', completed: false }
     */
    const renderTodo = function (outputElement, todo, index) {
        const output = $(outputElement);

        const todoEl = $('<div>').addClass('todo');

        const label = $('<label>').addClass('fancy-checkbox');
        const checkbox = $('<input type="checkbox">')
            .attr('checked', todo.completed)
            .addClass('completed')
            .attr('data-index', index);


        label.append(checkbox);
        label.append('<i class="fas fa-check-square checked">');
        label.append('<i class="far fa-square unchecked">');

        todoEl.append(
            label,

            $('<span>').text(todo.text).addClass('list-text'),

            $('<button>')
                // .text('x')
                .addClass('delete')
                .attr('data-index', index)
                .append('<i>').addClass('fas fa-times')
        );

        output.append(todoEl);
    }

    const renderTodos = function (outputElement, todos) {
        const output = $(outputElement);
        output.empty();
        todos.forEach((todo, index) => renderTodo(outputElement, todo, index));
    }

    const getTodos = function () {

        // The AJAX function uses the URL of our API to GET the data associated with it (initially set to localhost)
        $.ajax({
            url: '/api/todo-list',
            method: 'GET'
        })
            .then(function (todos) {
                // update todo length
                state.todos = todos;
                renderTodos('#todos', todos);
            });
    }

    // ADD NEW TODO
    // Click listener for the submit button
    $('.submit').on('click', function (event) {
        event.preventDefault();

        // Here we grab the form elements
        const newTodo = {
            text: $('#new-todo-text').val(),
            completed: false,
        };

        for (let key in newTodo) {
            if (newTodo[key] === '') {
                alert('Please add text for new todo');
                return;
            }
        }

        console.log(newTodo);

        // This line is the magic. It's very similar to the standard ajax function we used.
        // Essentially we give it a URL, we give it the object we want to send, then we have a 'callback'.
        // The callback is the response of the server. In our case, we set up code in api-routes that 'returns' true or false
        // depending on if a todos is available or not.

        $.ajax({
            url: '/api/todo-list',
            method: 'POST',
            data: newTodo
        }).then(
            function (data) {

                // If our POST request was successfully processed, proceed on
                if (data.success) {

                    console.log('data', data)

                    // Clear the form when submitting
                    $('#new-todo-text').val('');

                    // Set the users focus (cursor) to input
                    $('#new-todo-text').focus();

                    render();
                } else {

                    alert('There was a problem with your submission. Please check your entry and try again.');
                }
            });
    });

    // UPDATE TODO COMPLETED STATUS
    $('body').on('click', '.completed', function (event) {
        const todoIndex = $(this).attr('data-index');
        const completed = event.target.checked; // TODO use jquery for this

        // find the todo the user is updating
        const todoToUpdate = state.todos[Number(todoIndex)];

        // update the competed field
        todoToUpdate.completed = completed;

        // Make the PUT request
        $.ajax({
            url: `/api/todo-list${todoIndex}`,
            method: 'PUT',
            data: todoToUpdate
        })
            .then(function (data) {

                // If our PUT request was successfully processed, proceed on
                if (data.success) {
                    render();
                } else {

                    alert('There was a problem with your submission. Please check your entry and try again.');
                }


            });
    })

    // DELETE TODO
    $('body').on('click', '.delete', function (event) {
        const todoIndex = $(this).attr('data-index');

        console.log(state.todos[Number(todoIndex)])

        // Make the DELETE request
        $.ajax({
            url: `/api/todo-list${todoIndex}`,
            method: 'DELETE'
        })
            .then(function (data) {

                // If our DELETE request was successfully processed, proceed on
                if (data.success) {
                    render();
                } else {

                    alert('There was a problem with your submission. Please check your entry and try again.');
                }

            });
    });

    // fetch all todos and render them 
    render();
});