import React, { useEffect, useState } from 'react';
import Create from './Create';
import './App.css';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill, BsFillTrashFill, BsPencil, BsCheck2 } from 'react-icons/bs';

// Base API URL - use environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const Home = () => {
    const [todos, setTodos] = useState([]);
    const [updatetask, setUpdatetask] = useState('');
    const [taskid, setTaskid] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = () => {
        axios.get(`${API_URL}/get`)
            .then(result => setTodos(result.data))
            .catch(err => console.log(err));
    };

    const edit = (id) => {
        axios.put(`${API_URL}/edit/${id}`)
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, done: !todo.done };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
            })
            .catch(err => console.log(err));
    };

    const Update = (id, updatedTask) => {
        axios.put(`${API_URL}/update/${id}`, { task: updatedTask })
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.map(todo => {
                    if (todo._id === id) {
                        return { ...todo, task: updatedTask };
                    }
                    return todo;
                });
                setTodos(updatedTodos);
                setTaskid('');
                setUpdatetask('');
            })
            .catch(err => console.log(err));
    };

    const cancelEdit = () => {
        setTaskid('');
        setUpdatetask('');
    };

    const Hdelete = (id) => {
        axios.delete(`${API_URL}/delete/${id}`)
            .then(result => {
                console.log(result.data);
                const updatedTodos = todos.filter(todo => todo._id !== id);
                setTodos(updatedTodos);
                setShowDeleteConfirm(null);
            })
            .catch(err => console.log(err));
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <main>
            <Create updateTodos={fetchTodos} />
            {
                todos.length === 0 ? <div className='task'>No tasks found</div> :
                    todos.map((todo) => (
                        <div className={`task ${todo.priority}-priority`} key={todo._id}>
                            <div className='checkbox'>
                                {todo.done ?
                                    <BsFillCheckCircleFill className='icon' onClick={() => edit(todo._id)} /> :
                                    <BsCircleFill className='icon' onClick={() => edit(todo._id)} />
                                }

                                {taskid === todo._id ? (
                                    <div className="edit-container">
                                        <input
                                            type='text'
                                            value={updatetask}
                                            onChange={e => setUpdatetask(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="edit-actions">
                                            <BsCheck2
                                                className='icon save-icon'
                                                onClick={() => Update(todo._id, updatetask)}
                                            />
                                            <button
                                                className="cancel-btn"
                                                onClick={cancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="task-content">
                                        <p className={todo.done ? 'through' : 'normal'}>{todo.task}</p>
                                        {todo.description && (
                                            <p className="task-description">{todo.description}</p>
                                        )}
                                        <div className="task-meta">
                                            <span className="task-badge category-badge">{todo.category}</span>
                                            {todo.dueDate && (
                                                <span className={`due-date ${new Date(todo.dueDate) < new Date() ? 'overdue' : ''}`}>
                                                    Due: {formatDate(todo.dueDate)}
                                                </span>
                                            )}
                                            <span className="timestamp">
                                                Created: {formatDate(todo.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="actions">
                                <BsPencil
                                    className='icon edit'
                                    onClick={() => {
                                        if (taskid === todo._id) {
                                            Update(todo._id, updatetask);
                                        } else {
                                            setTaskid(todo._id);
                                            setUpdatetask(todo.task);
                                        }
                                    }}
                                />

                                {showDeleteConfirm === todo._id ? (
                                    <div className="delete-confirm">
                                        <span>Delete?</span>
                                        <button
                                            className="confirm-btn yes"
                                            onClick={() => Hdelete(todo._id)}
                                        >
                                            Yes
                                        </button>
                                        <button
                                            className="confirm-btn no"
                                            onClick={() => setShowDeleteConfirm(null)}
                                        >
                                            No
                                        </button>
                                    </div>
                                ) : (
                                    <BsFillTrashFill
                                        className='icon delete'
                                        onClick={() => setShowDeleteConfirm(todo._id)}
                                    />
                                )}
                            </div>
                        </div>
                    ))
            }
        </main>
    );
};

export default Home;
