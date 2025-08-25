import React, { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const NewDiscussion = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            await api.post('/discussions', { title, content }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/discussions');
        } catch (error) {
            console.error("Error creating discussion:", error);
            alert("Failed to create discussion. Please try again.");
        }
    };

    return (
        <div>
            <h1>Post a New Discussion</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Post Discussion</button>
            </form>
        </div>
    );
};

export default NewDiscussion;
