import React, { useEffect, useState } from 'react';
import { createDiscussion } from '../../../frontend/api';
import { useNavigate } from 'react-router-dom';

const NewDiscussion = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/login';
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        try {
            await createDiscussion({ title, content }, token);
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
