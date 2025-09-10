import React, { useState, useEffect } from 'react';
import { fetchDiscussions } from '../../../frontend/api';
import { editDiscussion, deleteDiscussion } from '../../../frontend/discussionApi';
import { Link } from 'react-router-dom';

const Discussions = () => {
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            window.location.href = '/login';
        }
    }, []);

    const [discussions, setDiscussions] = useState([]);

    useEffect(() => {
        const getDiscussions = async () => {
            const token = localStorage.getItem('authToken');
            const data = await fetchDiscussions(token);
            setDiscussions(data);
        };
        getDiscussions();
    }, []);

    const currentUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('authToken');
    const [editId, setEditId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editContent, setEditContent] = useState('');

    const handleEdit = (discussion) => {
        setEditId(discussion._id);
        setEditTitle(discussion.title);
        setEditContent(discussion.content);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        await editDiscussion(editId, { title: editTitle, content: editContent }, token);
        setEditId(null);
        setEditTitle('');
        setEditContent('');
        const data = await fetchDiscussions(token);
        setDiscussions(data);
    };

    const handleDelete = async (discussionId) => {
        await deleteDiscussion(discussionId, token);
        const data = await fetchDiscussions(token);
        setDiscussions(data);
    };

    return (
        <div>
            <h1>Discussions</h1>
            <Link to="/new-discussion">Post a new discussion</Link>
            <ul>
                {discussions.map(discussion => (
                    <li key={discussion._id}>
                        <Link to={`/discussion/${discussion._id}`}>{discussion.title}</Link>
                        {discussion.author === currentUserId && (
                            <>
                                <button onClick={() => handleEdit(discussion)}>Edit</button>
                                <button onClick={() => handleDelete(discussion._id)}>Delete</button>
                            </>
                        )}
                        {editId === discussion._id && (
                            <form onSubmit={handleEditSubmit} style={{ marginTop: '8px' }}>
                                <input
                                    value={editTitle}
                                    onChange={e => setEditTitle(e.target.value)}
                                    placeholder="Edit title"
                                />
                                <input
                                    value={editContent}
                                    onChange={e => setEditContent(e.target.value)}
                                    placeholder="Edit content"
                                />
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditId(null)}>Cancel</button>
                            </form>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Discussions;
