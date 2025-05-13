import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { IoMdAdd } from 'react-icons/io';

// Base API URL - use environment variable or fallback to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const Create = ({ updateTodos }) => {
    const [formData, setFormData] = useState({
        task: '',
        description: '',
        priority: 'medium',
        category: 'general',
        dueDate: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const createTask = async (e) => {
        e.preventDefault();
        if (!formData.task.trim()) {
            alert('Task title is required');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/add`, formData);
            console.log('Task created:', response.data);

            // Clear form
            setFormData({
                task: '',
                description: '',
                priority: 'medium',
                category: 'general',
                dueDate: ''
            });

            // Update the parent component's todos
            if (updateTodos) {
                updateTodos();
            } else {
                // Force page reload if updateTodos is not provided
                window.location.reload();
            }
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task. Please try again.');
        }
    };

    return (
        <div className="create-section">
            <h1>Todo List</h1>
            <form className="create-form" onSubmit={createTask}>
                <div className="form-group">
                    <label htmlFor="task">Task Title</label>
                    <input
                        type="text"
                        id="task"
                        name="task"
                        placeholder="What needs to be done?"
                        value={formData.task}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description (Optional)</label>
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Add details about this task..."
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <select
                            id="priority"
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        >
                            <option value="general">General</option>
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="shopping">Shopping</option>
                            <option value="health">Health</option>
                            <option value="education">Education</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date (Optional)</label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button type="submit">
                    <IoMdAdd style={{ marginRight: '5px', fontSize: '18px' }} />
                    Add Task
                </button>
            </form>
        </div>
    );
};

export default Create;
