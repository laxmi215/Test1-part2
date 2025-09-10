import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PostList from './PostList';

const Discussion = () => {
  const { id } = useParams();
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    // You may want to fetch user info from backend using the token
    // For now, assume userId is stored in localStorage after login
    const userId = localStorage.getItem('userId');
    setCurrentUserId(userId);
  }, []);

  return (
    <div>
      <h1>Discussion Details</h1>
      {/* You can add more discussion details here */}
      <PostList discussionId={id} currentUserId={currentUserId} />
    </div>
  );
};

export default Discussion;
