import React, { useState, useEffect, useCallback } from 'react';
import './Todo.css';

function Todo() {
    const [inputText, setInputText] = useState("");
    const [todos, setTodos] = useState([]);
    const [status, setStatus] = useState("all");
    const [filteredTodos, setFilteredTodos] = useState([]);

    const filterHandler = useCallback(() => {
        switch (status) {
            case "completed":
                setFilteredTodos(todos.filter(todo => todo.completed));
                break;
            case "incomplete":
                setFilteredTodos(todos.filter(todo => !todo.completed));
                break;
            default:
                setFilteredTodos(todos);
                break;
        }
    }, [todos, status]);

    const saveLocalTodos = useCallback(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    useEffect(() => {
        getLocalTodos();
    }, []);

    useEffect(() => {
        filterHandler();
        saveLocalTodos();
    }, [filterHandler, saveLocalTodos]);

    const getLocalTodos = () => {
        if (localStorage.getItem("todos") === null) {
            localStorage.setItem("todos", JSON.stringify([]));
        } else {
            const todoLocal = JSON.parse(localStorage.getItem("todos"));
            setTodos(todoLocal);
        }
    };

    const inputTextHandler = (e) => {
        setInputText(e.target.value);
    };

    const submitTodoHandler = (e) => {
        e.preventDefault();
        setTodos([
            ...todos,
            { text: inputText, completed: false, id: Math.random() * 1000 }
        ]);
        setInputText("");
    };

    const deleteHandler = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    const completeHandler = (id) => {
        setTodos(
            todos.map((todo) => {
                if (todo.id === id) {
                    return { ...todo, completed: !todo.completed };
                }
                return todo;
            })
        );
    };

    const statusHandler = (e) => {
        setStatus(e.target.value);
    };

    return (
        <div className="App">
            <header>
                <h1>My To Do List</h1>
            </header>
            <form>
                <input
                    value={inputText}
                    onChange={inputTextHandler}
                    type="text"
                    className="todo-input"
                    placeholder="Add a new todo..."
                />
                <button onClick={submitTodoHandler} className="todo-button" type="submit">
                    <i className="fas fa-plus-circle"></i>
                </button>
                <div className="select">
                    <select onChange={statusHandler} name="todos" className="filter-todo">
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="incomplete">Incomplete</option>
                    </select>
                </div>
            </form>

            <div className="todo-container">
                <ul className="todo-list">
                    {filteredTodos.map((todo) => (
                        <div className="todo" key={todo.id}>
                            <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
                                {todo.text}
                            </li>
                            <button onClick={() => completeHandler(todo.id)} className="complete-btn">
                                <i className="fas fa-check-circle"></i>
                            </button>
                            <button onClick={() => deleteHandler(todo.id)} className="trash-btn">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Todo;
