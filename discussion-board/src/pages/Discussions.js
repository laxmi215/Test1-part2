import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Link } from 'react-router-dom';

const Discussions = () => {
    const [discussions, setDiscussions] = useState([]);

    useEffect(() => {
        const fetchDiscussions = async () => {
            const response = await api.get('/discussions');
            setDiscussions(response.data);
        };
        fetchDiscussions();
    }, []);

    return (
        <div>
            <h1>Discussions</h1>
            <Link to="/new-discussion">Post a new discussion</Link>
            <ul>
                {discussions.map(discussion => (
                    <li key={discussion._id}>
                        <Link to={`/discussion/${discussion._id}`}>{discussion.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Discussions;
