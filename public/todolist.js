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

    const renderTodo = function (outputElement, todo, index) {
        const output = $(outputElement);

        const todoEl = $('<div>').addClass('todo');

        const label = $('<label>').addClass('fancy-checkbox');
        // const checkbox = $('<input type="checkbox">')
        //     .attr('checked', todo.completed)
        //     .addClass('completed')
        //     .attr('data-index', index);


        // label.append(checkbox);

        label.append('<i class="far fa-square unchecked">');

        label.append('<i class="completed">')
            .attr('checked', todo.completed)
            .addClass('completed')
            .attr('data-index', index);

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

    $(document).on('click', '.unchecked', function(){ 
        $('.completed').toggleClass('fas fa-check-square checked');
    }); 

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
            text: $('.addToDo').val(),
            completed: false,
        };

        for (let key in newTodo) {
            if (newTodo[key] === '') {
                alert('Please add text for new todo');
                return;
            }
        }

        console.log(newTodo);

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
                    $('#addToDo').val('');

                    // Set the users focus (cursor) to input
                    $('#addToDo').focus();

                    render();
                } else {

                    alert('There was a problem with your submission. Please check your entry and try again.');
                }
            });
    });

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